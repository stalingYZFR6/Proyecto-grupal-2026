-- 1. LIMPIEZA INMEDIATA: Borrar el correo que está atascado en el sistema de autenticación
DELETE FROM auth.users WHERE LOWER(email) = LOWER('Jugirohan@gmail.com');

-- 2. FUNCIÓN PARA CREAR USUARIO (MEJORADA PARA MANEJAR EXISTENTES)
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
    -- Si el correo ya existe, actualizamos su contraseña y confirmamos el email
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

  -- Limpiar cualquier registro previo de este empleado en la tabla pública
  DELETE FROM public.usuarios WHERE id_empleado = p_id_empleado;

  -- Insertar el nuevo registro limpio en la tabla pública
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

-- 3. FUNCIÓN PARA ELIMINAR USUARIO COMPLETAMENTE (DE LA TABLA PÚBLICA Y DEL SISTEMA DE AUTENTICACIÓN)
CREATE OR REPLACE FUNCTION eliminar_usuario_completo(p_id_usuario INT)
RETURNS VOID AS $$
DECLARE
  v_auth_id UUID;
BEGIN
  -- 1. Obtener el UUID de autenticación del usuario
  SELECT id_auth INTO v_auth_id 
  FROM public.usuarios 
  WHERE id_usuario = p_id_usuario;

  -- 2. Borrar de la tabla pública primero (por si acaso)
  DELETE FROM public.usuarios WHERE id_usuario = p_id_usuario;

  -- 3. Borrar del sistema de autenticación de Supabase
  -- Esto eliminará automáticamente las identidades y sesiones relacionadas
  IF v_auth_id IS NOT NULL THEN
    DELETE FROM auth.users WHERE id = v_auth_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;