import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlayCircle, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

interface CourseFormData {
  title: string;
  description: string;
  thumbnail_url: string;
  order_index: number;
  is_active: boolean;
}

export const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    thumbnail_url: '',
    order_index: 0,
    is_active: true
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      thumbnail_url: '',
      order_index: 0,
      is_active: true
    });
    setEditingCourse(null);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      console.log('AdminCourses: Fetching courses...');
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('AdminCourses: Error fetching courses:', error);
        throw error;
      }
      
      console.log('AdminCourses: Courses fetched:', data);
      setCourses(data || []);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar cursos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseStatus = async (courseId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_active: !isActive })
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status do curso atualizado",
      });
      
      fetchCourses();
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do curso",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      toast({
        title: "Erro",
        description: "Título é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingCourse) {
        // Editar curso existente
        const { error } = await supabase
          .from('courses')
          .update(formData)
          .eq('id', editingCourse.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Curso atualizado com sucesso",
        });
      } else {
        // Criar novo curso
        const { error } = await supabase
          .from('courses')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Curso criado com sucesso",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      toast({
        title: "Erro",
        description: `Erro ao ${editingCourse ? 'atualizar' : 'criar'} curso`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      thumbnail_url: course.thumbnail_url || '',
      order_index: course.order_index || 0,
      is_active: course.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Curso deletado com sucesso",
      });
      
      fetchCourses();
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar curso",
        variant: "destructive",
      });
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
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
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <PlayCircle className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Cursos</h1>
            <p className="text-muted-foreground">Gerencie os cursos da plataforma</p>
          </div>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Curso
        </Button>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? 'Editar Curso' : 'Criar Novo Curso'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Digite o título do curso"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do curso"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="thumbnail_url">URL da Thumbnail</Label>
                <Input
                  id="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="URL da imagem de capa"
                />
              </div>
              <div>
                <Label htmlFor="order">Ordem</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Curso ativo</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSubmit} className="flex-1">
                  {editingCourse ? 'Atualizar Curso' : 'Criar Curso'}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cursos ({courses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{course.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {course.description?.substring(0, 50)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.order_index}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={course.is_active ? 'default' : 'secondary'}>
                      {course.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(course.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(course)}
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant={course.is_active ? "destructive" : "default"}
                        onClick={() => toggleCourseStatus(course.id, course.is_active)}
                      >
                        {course.is_active ? 'Desativar' : 'Ativar'}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="mr-1 h-3 w-3" />
                            Deletar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Isso deletará permanentemente o curso "{course.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(course.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Deletar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};