import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  youtube_url: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
}

interface LessonFormData {
  course_id: string;
  title: string;
  description: string;
  youtube_url: string;
  thumbnail_url: string;
  duration_minutes: string;
  order_index: string;
  is_active: boolean;
}

export const AdminLessons = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deleteLesson, setDeleteLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState<LessonFormData>({
    course_id: "",
    title: "",
    description: "",
    youtube_url: "",
    thumbnail_url: "",
    duration_minutes: "",
    order_index: "0",
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      course_id: "",
      title: "",
      description: "",
      youtube_url: "",
      thumbnail_url: "",
      duration_minutes: "",
      order_index: "0",
      is_active: true,
    });
    setEditingLesson(null);
  };

  useEffect(() => {
    fetchCourses();
    fetchLessons();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("id, title")
      .order("order_index");

    if (error) {
      toast.error("Erro ao carregar cursos");
      console.error(error);
      return;
    }

    setCourses(data || []);
  };

  const fetchLessons = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .order("order_index");

    if (error) {
      toast.error("Erro ao carregar aulas");
      console.error(error);
    } else {
      setLessons(data || []);
    }
    setLoading(false);
  };

  const toggleLessonStatus = async (lesson: Lesson) => {
    const { error } = await supabase
      .from("lessons")
      .update({ is_active: !lesson.is_active })
      .eq("id", lesson.id);

    if (error) {
      toast.error("Erro ao atualizar status da aula");
      console.error(error);
    } else {
      toast.success(lesson.is_active ? "Aula desativada" : "Aula ativada");
      fetchLessons();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.course_id || !formData.title) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const lessonData = {
      course_id: formData.course_id,
      title: formData.title,
      description: formData.description || null,
      youtube_url: formData.youtube_url || null,
      thumbnail_url: formData.thumbnail_url || null,
      duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
      order_index: parseInt(formData.order_index),
      is_active: formData.is_active,
    };

    if (editingLesson) {
      const { error } = await supabase
        .from("lessons")
        .update(lessonData)
        .eq("id", editingLesson.id);

      if (error) {
        toast.error("Erro ao atualizar aula");
        console.error(error);
      } else {
        toast.success("Aula atualizada com sucesso!");
        setIsDialogOpen(false);
        resetForm();
        fetchLessons();
      }
    } else {
      const { error } = await supabase
        .from("lessons")
        .insert([lessonData]);

      if (error) {
        toast.error("Erro ao criar aula");
        console.error(error);
      } else {
        toast.success("Aula criada com sucesso!");
        setIsDialogOpen(false);
        resetForm();
        fetchLessons();
      }
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      course_id: lesson.course_id,
      title: lesson.title,
      description: lesson.description || "",
      youtube_url: lesson.youtube_url || "",
      thumbnail_url: lesson.thumbnail_url || "",
      duration_minutes: lesson.duration_minutes?.toString() || "",
      order_index: lesson.order_index.toString(),
      is_active: lesson.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteLesson) return;

    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", deleteLesson.id);

    if (error) {
      toast.error("Erro ao deletar aula");
      console.error(error);
    } else {
      toast.success("Aula deletada com sucesso!");
      setDeleteLesson(null);
      fetchLessons();
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course?.title || "Curso não encontrado";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Gerenciar Aulas</CardTitle>
            <CardDescription>
              Adicione, edite ou remova aulas dos cursos
            </CardDescription>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Aula
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criada em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell>{getCourseName(lesson.course_id)}</TableCell>
                  <TableCell>
                    {lesson.duration_minutes ? `${lesson.duration_minutes} min` : "-"}
                  </TableCell>
                  <TableCell>{lesson.order_index}</TableCell>
                  <TableCell>
                    <Switch
                      checked={lesson.is_active}
                      onCheckedChange={() => toggleLessonStatus(lesson)}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(lesson.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(lesson)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteLesson(lesson)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? "Editar Aula" : "Nova Aula"}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações da aula
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course">Curso *</Label>
              <Select
                value={formData.course_id}
                onValueChange={(value) => setFormData({ ...formData, course_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube_url">URL do YouTube</Label>
              <Input
                id="youtube_url"
                type="url"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">URL da Thumbnail</Label>
              <Input
                id="thumbnail_url"
                type="url"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration_minutes">Duração (minutos)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_index">Ordem</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Aula ativa</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingLesson ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteLesson} onOpenChange={() => setDeleteLesson(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a aula "{deleteLesson?.title}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
