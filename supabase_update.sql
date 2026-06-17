-- ====================================================================
-- 1. FUNCIÓN HELPER PARA OBTENER EL ROL DEL USUARIO ACTUAL
-- ====================================================================
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text AS $$
DECLARE
    v_rol text;
BEGIN
    SELECT rol INTO v_rol
    FROM public.usuarios
    WHERE id_auth = auth.uid()
    LIMIT 1;
    
    RETURN COALESCE(v_rol, 'empleado');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- 2. CREAR TABLA DE DOCUMENTOS DE EMPLEADOS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.documentos_empleado (
    id_documento SERIAL PRIMARY KEY,
    id_empleado INT REFERENCES public.empleado(id_empleado) ON DELETE CASCADE,
    url_archivo TEXT NOT NULL,
    titulo_personalizado TEXT NOT NULL,
    tipo_archivo TEXT NOT NULL, -- 'imagen', 'pdf', 'otro'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ====================================================================
-- 3. HABILITAR RLS EN LAS TABLAS CRÍTICAS
-- ====================================================================
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jornadas_asistencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empleado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_empleado ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- 4. POLÍTICAS PARA LA TABLA public.usuarios
-- ====================================================================
DROP POLICY IF EXISTS "Admin tiene acceso total a usuarios" ON public.usuarios;
CREATE POLICY "Admin tiene acceso total a usuarios" 
ON public.usuarios 
FOR ALL 
USING (public.get_current_user_role() = 'Admin');

DROP POLICY IF EXISTS "Empleados solo ven su propio usuario" ON public.usuarios;
CREATE POLICY "Empleados solo ven su propio usuario" 
ON public.usuarios 
FOR SELECT 
USING (id_auth = auth.uid());

-- ====================================================================
-- 5. POLÍTICAS PARA LA TABLA public.asistencias
-- ====================================================================
DROP POLICY IF EXISTS "Admin tiene acceso total a asistencias" ON public.asistencias;
CREATE POLICY "Admin tiene acceso total a asistencias" 
ON public.asistencias 
FOR ALL 
USING (public.get_current_user_role() = 'Admin');

DROP POLICY IF EXISTS "Empleados solo insertan su propia asistencia" ON public.asistencias;
CREATE POLICY "Empleados solo insertan su propia asistencia" 
ON public.asistencias 
FOR INSERT 
WITH CHECK (
    id_empleado = (SELECT id_empleado FROM public.usuarios WHERE id_auth = auth.uid() LIMIT 1)
);

DROP POLICY IF EXISTS "Empleados solo actualizan su propia asistencia" ON public.asistencias;
CREATE POLICY "Empleados solo actualizan su propia asistencia" 
ON public.asistencias 
FOR UPDATE 
USING (
    id_empleado = (SELECT id_empleado FROM public.usuarios WHERE id_auth = auth.uid() LIMIT 1)
);

DROP POLICY IF EXISTS "Empleados solo ven su propia asistencia" ON public.asistencias;
CREATE POLICY "Empleados solo ven su propia asistencia" 
ON public.asistencias 
FOR SELECT 
USING (
    id_empleado = (SELECT id_empleado FROM public.usuarios WHERE id_auth = auth.uid() LIMIT 1)
);

-- ====================================================================
-- 6. POLÍTICAS PARA LA TABLA public.jornadas_asistencia
-- ====================================================================
DROP POLICY IF EXISTS "Admin tiene acceso total a jornadas" ON public.jornadas_asistencia;
CREATE POLICY "Admin tiene acceso total a jornadas" 
ON public.jornadas_asistencia 
FOR ALL 
USING (public.get_current_user_role() = 'Admin');

DROP POLICY IF EXISTS "Todos pueden ver las jornadas" ON public.jornadas_asistencia;
CREATE POLICY "Todos pueden ver las jornadas" 
ON public.jornadas_asistencia 
FOR SELECT 
TO authenticated 
USING (true);

-- ====================================================================
-- 7. POLÍTICAS PARA LA TABLA public.empleado
-- ====================================================================
DROP POLICY IF EXISTS "Admin tiene acceso total a empleados" ON public.empleado;
CREATE POLICY "Admin tiene acceso total a empleados" 
ON public.empleado 
FOR ALL 
USING (public.get_current_user_role() = 'Admin');

DROP POLICY IF EXISTS "Todos pueden ver los empleados" ON public.empleado;
CREATE POLICY "Todos pueden ver los empleados" 
ON public.empleado 
FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Empleados solo pueden actualizar su propio perfil" ON public.empleado;
CREATE POLICY "Empleados solo pueden actualizar su propio perfil" 
ON public.empleado 
FOR UPDATE 
USING (
    id_empleado = (SELECT id_empleado FROM public.usuarios WHERE id_auth = auth.uid() LIMIT 1)
);

-- ====================================================================
-- 8. POLÍTICAS PARA LA TABLA public.documentos_empleado
-- ====================================================================
DROP POLICY IF EXISTS "Admin tiene acceso total a documentos" ON public.documentos_empleado;
CREATE POLICY "Admin tiene acceso total a documentos" 
ON public.documentos_empleado 
FOR ALL 
USING (public.get_current_user_role() = 'Admin');

DROP POLICY IF EXISTS "Todos pueden ver los documentos" ON public.documentos_empleado;
CREATE POLICY "Todos pueden ver los documentos" 
ON public.documentos_empleado 
FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Empleados solo pueden insertar sus propios documentos" ON public.documentos_empleado;
CREATE POLICY "Empleados solo pueden insertar sus propios documentos" 
ON public.documentos_empleado 
FOR INSERT 
WITH CHECK (
    id_empleado = (SELECT id_empleado FROM public.usuarios WHERE id_auth = auth.uid() LIMIT 1)
);

DROP POLICY IF EXISTS "Empleados solo pueden eliminar sus propios documentos" ON public.documentos_empleado;
CREATE POLICY "Empleados solo pueden eliminar sus propios documentos" 
ON public.documentos_empleado 
FOR DELETE 
USING (
    id_empleado = (SELECT id_empleado FROM public.usuarios WHERE id_auth = auth.uid() LIMIT 1)
);