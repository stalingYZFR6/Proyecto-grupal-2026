-- 1. LIMPIEZA INMEDIATA: Borrar el correo que está atascado en el sistema de autenticación
DELETE FROM auth.users WHERE LOWER(email) = LOWER('Jugirohan@gmail.com');

-- 2. MEJORA INTELIGENTE: Reemplazar la función para que si el correo ya existe, actualice la contraseña en lugar de fallar
CREATE OR REPLACE FUNCTION crear_usuario_confirmado(
  p_email TEXT,
  p_password TEXT,
  p_id_empleado INT,
  p_rol TEXT
) RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_encrypted_password TEXT;
  v_existing_auth_id UUID;
BEGIN
  -- Encriptar la contraseña recibida
  v_encrypted_password := crypt(p_password, gen_salt('bf'));

  -- Buscar si el correo ya existe en la autenticación interna de Supabase
  SELECT id INTO v_existing_auth_id FROM auth.users WHERE LOWER(email) = LOWER(p_email);

  IF v_existing_auth_id IS NOT NULL THEN
    -- Si el correo ya existe, actualizamos su contraseña y nos aseguramos de que esté confirmado
    UPDATE auth.users 
    SET encrypted_password = v_encrypted_password,
        email_confirmed_at = NOW(),
        updated_at = NOW()
    WHERE id = v_existing_auth_id;
    
    v_user_id := v_existing_auth_id;
  ELSE
    -- Si no existe, creamos un nuevo UUID e insertamos el usuario en auth.users
    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      p_email,
      v_encrypted_password,
      NOW(),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      '{}'::jsonb,
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );

    -- Insertar la identidad correspondiente
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      v_user_id,
      json_build_object('sub', v_user_id, 'email', p_email)::jsonb,
      'email',
      v_user_id::text,
      NULL,
      NOW(),
      NOW()
    );
  END IF;

  -- Limpiar cualquier registro previo de este empleado en la tabla pública para evitar duplicados
  DELETE FROM public.usuarios WHERE id_empleado = p_id_empleado;

  -- Insertar el nuevo registro limpio en la tabla pública vinculándolo correctamente
  INSERT INTO public.usuarios (
    id_empleado,
    id_auth,
    rol,
    activo
  ) VALUES (
    p_id_empleado,
    v_user_id,
    p_rol,
    TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;