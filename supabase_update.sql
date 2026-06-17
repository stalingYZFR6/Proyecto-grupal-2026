-- ====================================================================
-- 1. CREACIÓN DE LA TABLA DE DOCUMENTOS DEL EMPLEADO
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.documentos_empleado (
    id_documento SERIAL PRIMARY KEY,
    id_empleado INT REFERENCES public.empleado(id_empleado) ON DELETE CASCADE,
    titulo_personalizado TEXT NOT NULL,
    url_archivo TEXT NOT NULL,
    tipo_archivo TEXT NOT NULL, -- 'image', 'pdf', 'other'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.documentos_empleado ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- 2. POLÍTICAS DE SEGURIDAD RLS PARA documentos_empleado
-- ====================================================================
DROP POLICY IF EXISTS "Admin tiene acceso total a documentos" ON public.documentos_empleado;
CREATE POLICY "Admin tiene acceso total a documentos" 
ON public.documentos_empleado 
FOR ALL 
USING (public.get_current_user_role() = 'Admin');

DROP POLICY IF EXISTS "Empleados pueden ver sus propios documentos" ON public.documentos_empleado;
CREATE POLICY "Empleados pueden ver sus propios documents" 
ON public.documentos_empleado 
FOR SELECT 
USING (
    id_empleado = (SELECT id_empleado FROM public.usuarios WHERE id_auth = auth.uid() LIMIT 1)
);

DROP POLICY IF EXISTS "Empleados pueden insertar sus propios documentos" ON public.documentos_empleado;
CREATE POLICY "Empleados pueden insertar sus propios documentos" 
ON public.documentos_empleado 
FOR INSERT 
WITH CHECK (
    id_empleado = (SELECT id_empleado FROM public.usuarios WHERE id_auth = auth.uid() LIMIT 1)
);

DROP POLICY IF EXISTS "Empleados pueden eliminar sus propios documentos" ON public.documentos_empleado;
CREATE POLICY "Empleados pueden eliminar sus propios documentos" 
ON public.documentos_empleado 
FOR DELETE 
USING (
    id_empleado = (SELECT id_empleado FROM public.usuarios WHERE id_auth = auth.uid() LIMIT 1)
);