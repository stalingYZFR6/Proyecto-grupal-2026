-- ====================================================================
-- SOLUCIÓN DEFINITIVA AL ERROR 403 (PERMISOS DE ESCRITURA)
-- ====================================================================

-- 1. Desactivar por completo el Row Level Security (RLS)
ALTER TABLE public.configuracion DISABLE ROW LEVEL SECURITY;

-- 2. Otorgar permisos explícitos de lectura, inserción, actualización y borrado
GRANT ALL PRIVILEGES ON TABLE public.configuracion TO postgres;
GRANT ALL PRIVILEGES ON TABLE public.configuracion TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.configuracion TO anon;
GRANT ALL PRIVILEGES ON TABLE public.configuracion TO service_role;

-- 3. Asegurar que la columna 'clave' sea la llave primaria (Primary Key)
-- Esto es indispensable para que el método 'upsert' de Supabase funcione sin errores.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'public.configuracion'::regclass AND contype = 'p'
    ) THEN
        ALTER TABLE public.configuracion ADD PRIMARY KEY (clave);
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Si ya tiene una llave primaria o hay un conflicto, se asegura un índice único
        CREATE UNIQUE INDEX IF NOT EXISTS configuracion_clave_idx ON public.configuracion (clave);
END $$;