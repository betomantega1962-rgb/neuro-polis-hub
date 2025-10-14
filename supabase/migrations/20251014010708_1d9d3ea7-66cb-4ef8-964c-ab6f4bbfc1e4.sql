-- Criar a nova tabela lessons
CREATE TABLE public.lessons (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  youtube_url text,
  thumbnail_url text,
  duration_minutes integer,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT lessons_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE
);

-- Criar índice para melhor performance
CREATE INDEX lessons_course_id_idx ON public.lessons(course_id);
CREATE INDEX lessons_order_idx ON public.lessons(order_index);

-- Habilitar RLS na tabela lessons
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para lessons
CREATE POLICY "Anyone can view active lessons"
ON public.lessons
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage lessons"
ON public.lessons
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Criar um curso principal "NeuroCP Start" se não existir
INSERT INTO public.courses (id, title, description, is_active, order_index, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'NeuroCP Start',
  'Curso completo de introdução à Neurociência Política',
  true,
  1,
  now(),
  now()
)
ON CONFLICT DO NOTHING;

-- Migrar dados atuais de courses para lessons
INSERT INTO public.lessons (
  course_id,
  title,
  description,
  youtube_url,
  thumbnail_url,
  duration_minutes,
  order_index,
  is_active,
  created_at,
  updated_at
)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid as course_id,
  title,
  description,
  youtube_url,
  thumbnail_url,
  duration_minutes,
  order_index,
  is_active,
  created_at,
  updated_at
FROM public.courses
WHERE id != '00000000-0000-0000-0000-000000000001'::uuid;

-- Remover os registros antigos de courses (que agora são lessons)
DELETE FROM public.courses 
WHERE id != '00000000-0000-0000-0000-000000000001'::uuid;

-- Remover colunas específicas de aulas da tabela courses (agora só contém info do curso)
ALTER TABLE public.courses DROP COLUMN IF EXISTS youtube_url;
ALTER TABLE public.courses DROP COLUMN IF EXISTS duration_minutes;

-- Trigger para atualizar updated_at em lessons
CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();