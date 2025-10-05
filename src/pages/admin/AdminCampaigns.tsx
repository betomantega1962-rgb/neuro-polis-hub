import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Mail, Plus, Send, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CampaignFormDialog } from '@/components/admin/CampaignFormDialog';
import { CampaignViewDialog } from '@/components/admin/CampaignViewDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Campaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  template: string;
  target_audience: any;
  scheduled_at: string;
  sent_at: string;
  status: string;
  sent_count: number;
  open_count: number;
  click_count: number;
  created_by: string;
  created_at: string;
}

export const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar campanhas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'sending': return 'secondary';
      case 'scheduled': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'draft': 'Rascunho',
      'scheduled': 'Agendado',
      'sending': 'Enviando',
      'sent': 'Enviado',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  };

  const handleView = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setViewOpen(true);
  };

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setFormOpen(true);
  };

  const handleSendClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setSendDialogOpen(true);
  };

  const handleSendCampaign = async () => {
    if (!selectedCampaign) return;

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-campaign', {
        body: { campaignId: selectedCampaign.id }
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Campanha enviada para ${data.sent_count} destinatários`,
      });

      fetchCampaigns();
      setSendDialogOpen(false);
    } catch (error) {
      console.error('Erro ao enviar campanha:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar campanha",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
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
          <Mail className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Campanhas de Email</h1>
            <p className="text-muted-foreground">Gerencie campanhas de marketing por email</p>
          </div>
        </div>
        <Button onClick={() => {
          setSelectedCampaign(null);
          setFormOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Campanha
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Campanhas ({campaigns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enviados</TableHead>
                <TableHead>Taxa de Abertura</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">
                    {campaign.title}
                  </TableCell>
                  <TableCell>
                    {campaign.subject}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(campaign.status)}>
                      {getStatusLabel(campaign.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {campaign.sent_count || 0}
                  </TableCell>
                  <TableCell>
                    {campaign.sent_count > 0 ? 
                      `${Math.round((campaign.open_count / campaign.sent_count) * 100)}%` : 
                      'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    {new Date(campaign.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleView(campaign)}>
                        <Eye className="mr-1 h-3 w-3" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(campaign)}>
                        <Edit className="mr-1 h-3 w-3" />
                        Editar
                      </Button>
                      {campaign.status === 'draft' && (
                        <Button size="sm" variant="default" onClick={() => handleSendClick(campaign)}>
                          <Send className="mr-1 h-3 w-3" />
                          Enviar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CampaignFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        campaign={selectedCampaign}
        onSuccess={fetchCampaigns}
      />

      <CampaignViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        campaign={selectedCampaign}
      />

      <AlertDialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Envio</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja enviar esta campanha? Esta ação não pode ser desfeita.
              A campanha será enviada para todos os usuários que aceitaram receber notificações por email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={sending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendCampaign} disabled={sending}>
              {sending ? 'Enviando...' : 'Enviar Campanha'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};