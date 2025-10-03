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
import { Tag, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount_percentage: number;
  discount_amount: number;
  original_price: number;
  final_price: number;
  coupon_code: string;
  max_uses: number;
  current_uses: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  external_url: string;
  video_url: string;
  created_at: string;
}

interface OfferFormData {
  title: string;
  description: string;
  discount_percentage: number;
  discount_amount: number;
  original_price: number;
  final_price: number;
  coupon_code: string;
  max_uses: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  external_url: string;
  video_url: string;
}

export const AdminOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState<OfferFormData>({
    title: '',
    description: '',
    discount_percentage: 0,
    discount_amount: 0,
    original_price: 0,
    final_price: 0,
    coupon_code: '',
    max_uses: 0,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: '',
    is_active: true,
    external_url: '',
    video_url: ''
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discount_percentage: 0,
      discount_amount: 0,
      original_price: 0,
      final_price: 0,
      coupon_code: '',
      max_uses: 0,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: '',
      is_active: true,
      external_url: '',
      video_url: ''
    });
    setEditingOffer(null);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Erro ao buscar ofertas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar ofertas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleOfferStatus = async (offerId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ is_active: !isActive })
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status da oferta atualizado",
      });
      
      fetchOffers();
    } catch (error) {
      console.error('Erro ao atualizar oferta:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da oferta",
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
      if (editingOffer) {
        const { error } = await supabase
          .from('offers')
          .update(formData)
          .eq('id', editingOffer.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Oferta atualizada com sucesso",
        });
      } else {
        const { error } = await supabase
          .from('offers')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Oferta criada com sucesso",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchOffers();
    } catch (error) {
      console.error('Erro ao salvar oferta:', error);
      toast({
        title: "Erro",
        description: `Erro ao ${editingOffer ? 'atualizar' : 'criar'} oferta`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description || '',
      discount_percentage: offer.discount_percentage || 0,
      discount_amount: offer.discount_amount || 0,
      original_price: offer.original_price || 0,
      final_price: offer.final_price || 0,
      coupon_code: offer.coupon_code || '',
      max_uses: offer.max_uses || 0,
      valid_from: offer.valid_from ? offer.valid_from.split('T')[0] : new Date().toISOString().split('T')[0],
      valid_until: offer.valid_until ? offer.valid_until.split('T')[0] : '',
      is_active: offer.is_active,
      external_url: offer.external_url || '',
      video_url: offer.video_url || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Oferta deletada com sucesso",
      });
      
      fetchOffers();
    } catch (error) {
      console.error('Erro ao deletar oferta:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar oferta",
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
          <Tag className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Ofertas</h1>
            <p className="text-muted-foreground">Gerencie as ofertas e cupons</p>
          </div>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Oferta
        </Button>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOffer ? 'Editar Oferta' : 'Criar Nova Oferta'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Digite o título da oferta"
                  />
                </div>
                <div>
                  <Label htmlFor="coupon_code">Código do Cupom</Label>
                  <Input
                    id="coupon_code"
                    value={formData.coupon_code}
                    onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value })}
                    placeholder="CODIGO10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da oferta"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="discount_percentage">Desconto (%)</Label>
                  <Input
                    id="discount_percentage"
                    type="number"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="discount_amount">Desconto (R$)</Label>
                  <Input
                    id="discount_amount"
                    type="number"
                    value={formData.discount_amount}
                    onChange={(e) => setFormData({ ...formData, discount_amount: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="max_uses">Máx. Usos</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: parseInt(e.target.value) || 0 })}
                    placeholder="0 = ilimitado"
                    min="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="original_price">Preço Original (R$)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="final_price">Preço Final (R$)</Label>
                  <Input
                    id="final_price"
                    type="number"
                    value={formData.final_price}
                    onChange={(e) => setFormData({ ...formData, final_price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valid_from">Válido de</Label>
                  <Input
                    id="valid_from"
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="valid_until">Válido até</Label>
                  <Input
                    id="valid_until"
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="external_url">URL Externa</Label>
                <Input
                  id="external_url"
                  value={formData.external_url}
                  onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                  placeholder="https://exemplo.com/produto"
                />
              </div>
              <div>
                <Label htmlFor="video_url">URL do Vídeo (YouTube)</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Oferta ativa</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSubmit} className="flex-1">
                  {editingOffer ? 'Atualizar Oferta' : 'Criar Oferta'}
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
          <CardTitle>Lista de Ofertas ({offers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Desconto</TableHead>
                <TableHead>Cupom</TableHead>
                <TableHead>Usos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{offer.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {offer.description?.substring(0, 40)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {offer.discount_percentage && (
                        <Badge variant="outline">{offer.discount_percentage}%</Badge>
                      )}
                      {offer.discount_amount && (
                        <Badge variant="outline">R$ {offer.discount_amount}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {offer.coupon_code || 'N/A'}
                    </code>
                  </TableCell>
                  <TableCell>
                    {offer.current_uses || 0} / {offer.max_uses || '∞'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={offer.is_active ? 'default' : 'secondary'}>
                      {offer.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Até: {offer.valid_until ? 
                        new Date(offer.valid_until).toLocaleDateString('pt-BR') : 
                        'Sem limite'
                      }</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(offer)}
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant={offer.is_active ? "destructive" : "default"}
                        onClick={() => toggleOfferStatus(offer.id, offer.is_active)}
                      >
                        {offer.is_active ? 'Desativar' : 'Ativar'}
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
                              Esta ação não pode ser desfeita. Isso deletará permanentemente a oferta "{offer.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(offer.id)}
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