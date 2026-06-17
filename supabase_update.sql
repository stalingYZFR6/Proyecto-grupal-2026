-- ====================================================================
-- CORREGIR POLÍTICAS DE RLS PARA LA TABLA CONFIGURACION (ERROR 403)
-- ====================================================================

-- 1. Eliminar la política anterior que fallaba
DROP POLICY IF EXISTS "Permitir escritura solo a administradores" ON public.configuracion;

-- 2. Crear una nueva política robusta que verifica el rol 'admin' directamente en la tabla usuarios
CREATE POLICY "Permitir escritura solo a administradores" 
ON public.configuracion FOR ALL TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE usuarios.id_auth = auth.uid() 
    AND LOWER(usuarios.rol) = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE usuarios.id_auth = auth.uid() 
    AND LOWER(usuarios.rol) = 'admin'
  )
);