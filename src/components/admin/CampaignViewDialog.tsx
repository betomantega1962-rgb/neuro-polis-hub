import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CampaignViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: any;
}

export const CampaignViewDialog = ({ open, onOpenChange, campaign }: CampaignViewDialogProps) => {
  if (!campaign) return null;

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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'sending': return 'secondary';
      case 'scheduled': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{campaign.title}</span>
            <Badge variant={getStatusVariant(campaign.status)}>
              {getStatusLabel(campaign.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações da Campanha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assunto</p>
                <p className="text-base">{campaign.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Template</p>
                <p className="text-base capitalize">{campaign.template}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Criado em</p>
                <p className="text-base">
                  {new Date(campaign.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
            </CardContent>
          </Card>

          {campaign.status === 'sent' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Enviados</p>
                  <p className="text-2xl font-bold">{campaign.sent_count || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Abertos</p>
                  <p className="text-2xl font-bold">{campaign.open_count || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Abertura</p>
                  <p className="text-2xl font-bold">
                    {campaign.sent_count > 0 
                      ? `${Math.round((campaign.open_count / campaign.sent_count) * 100)}%` 
                      : '0%'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conteúdo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{campaign.content}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
