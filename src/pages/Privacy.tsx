import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Eye, UserCheck, Mail, Database, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="academic-container py-12">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Shield className="h-16 w-16 mx-auto text-primary" />
            <h1 className="text-4xl font-bold">Política de Privacidade</h1>
            <p className="text-muted-foreground text-lg">
              Academia Brasileira de Neurociência Política - ABNP
            </p>
            <p className="text-sm text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                1. Informações que Coletamos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1.1 Informações Fornecidas por Você</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Nome completo e informações de contato</li>
                  <li>Endereço de e-mail</li>
                  <li>Telefone (opcional)</li>
                  <li>Informações de progresso nos cursos</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">1.2 Informações Coletadas Automaticamente</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Dados de navegação e uso da plataforma</li>
                  <li>Endereço IP e informações do dispositivo</li>
                  <li>Cookies e tecnologias similares</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                2. Como Usamos Suas Informações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Fornecer e manter nossos serviços educacionais</li>
                <li>Personalizar sua experiência de aprendizado</li>
                <li>Enviar comunicações importantes sobre cursos e atualizações</li>
                <li>Melhorar nossos serviços e desenvolver novos recursos</li>
                <li>Garantir a segurança e prevenir fraudes</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                3. Proteção de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger
                suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
              <div>
                <h3 className="font-semibold mb-2">Medidas de Segurança:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Criptografia de dados em trânsito e em repouso</li>
                  <li>Controles de acesso baseados em funções</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Backups regulares de dados</li>
                  <li>Autenticação segura de usuários</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                4. Comunicações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Podemos enviar e-mails relacionados a:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Atualizações de cursos e novos conteúdos</li>
                <li>Notificações importantes da plataforma</li>
                <li>Newsletters educacionais (com opção de cancelamento)</li>
                <li>Ofertas especiais e promoções</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Você pode gerenciar suas preferências de comunicação a qualquer momento através
                das configurações da sua conta.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                5. Seus Direitos (LGPD)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Confirmação da existência de tratamento de dados</li>
                <li>Acesso aos seus dados pessoais</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                <li>Portabilidade dos dados a outro fornecedor</li>
                <li>Eliminação dos dados tratados com seu consentimento</li>
                <li>Informação sobre compartilhamento de dados</li>
                <li>Revogação do consentimento</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                6. Compartilhamento de Informações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Não vendemos suas informações pessoais. Podemos compartilhar seus dados apenas nas
                seguintes situações:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Com prestadores de serviços que nos auxiliam na operação da plataforma</li>
                <li>Quando exigido por lei ou ordem judicial</li>
                <li>Para proteger nossos direitos legais</li>
                <li>Com seu consentimento explícito</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência,
                analisar o uso da plataforma e personalizar conteúdo. Você pode controlar
                o uso de cookies através das configurações do seu navegador.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Retenção de Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir
                as finalidades descritas nesta política, a menos que um período de retenção
                mais longo seja exigido ou permitido por lei.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Alterações nesta Política</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos
                você sobre quaisquer mudanças significativas publicando a nova política nesta
                página e atualizando a data de "Última atualização".
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>10. Contato</CardTitle>
              <CardDescription>
                Para questões sobre esta política ou seus dados pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground">
                <strong>Academia Brasileira de Neurociência Política - ABNP</strong>
              </p>
              <p className="text-muted-foreground">
                E-mail: contato@abnp.com.br
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Nosso Encarregado de Proteção de Dados (DPO) está disponível para esclarecer
                dúvidas e atender solicitações relacionadas aos seus dados pessoais.
              </p>
            </CardContent>
          </Card>

          <div className="text-center pt-8">
            <Button onClick={() => navigate(-1)}>
              Voltar ao Site
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
