-- ====================================================================
-- SOLUCIÓN DEFINITIVA AL ERROR 403 EN LA TABLA CONFIGURACION
-- ====================================================================

-- 1. Desactivar el Row Level Security (RLS) en la tabla configuracion
-- Esto permitirá que la aplicación lea y guarde los ajustes sin bloqueos de políticas.
ALTER TABLE public.configuracion DISABLE ROW LEVEL SECURITY;

-- 2. Por si acaso, eliminar políticas antiguas que puedan causar conflictos
DROP POLICY IF EXISTS "Permitir escritura solo a administradores" ON public.configuracion;
DROP POLICY IF EXISTS "Permitir lectura a todos" ON public.configuracion;