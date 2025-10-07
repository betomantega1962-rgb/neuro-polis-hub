import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  displayName: string;
  tempPassword: string;
  role: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, displayName, tempPassword, role }: WelcomeEmailRequest = await req.json();

    console.log(`Sending welcome email to ${email}`);

    const roleNames: Record<string, string> = {
      admin: 'Administrador',
      moderator: 'Moderador',
      user: 'Usuário'
    };

    const emailResponse = await resend.emails.send({
      from: "ABNP <onboarding@resend.dev>",
      to: [email],
      subject: "Bem-vindo à Academia Brasileira de Neurociência Política!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .credential-box {
              background: white;
              border: 2px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .credential-label {
              font-weight: 600;
              color: #6b7280;
              font-size: 12px;
              text-transform: uppercase;
              margin-bottom: 5px;
            }
            .credential-value {
              font-size: 18px;
              color: #1f2937;
              font-weight: 500;
              word-break: break-all;
            }
            .password-box {
              background: #fef3c7;
              border: 2px solid #fbbf24;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .warning {
              color: #92400e;
              font-size: 14px;
              margin-top: 10px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #3b82f6, #8b5cf6);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: 600;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 14px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            .badge {
              display: inline-block;
              background: #dbeafe;
              color: #1e40af;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 14px;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">🎓 Bem-vindo à ABNP!</h1>
            <p style="margin: 10px 0 0 0;">Academia Brasileira de Neurociência Política</p>
          </div>
          
          <div class="content">
            <p>Olá <strong>${displayName}</strong>,</p>
            
            <p>Você foi convidado para fazer parte da <strong>Academia Brasileira de Neurociência Política</strong> com o papel de <span class="badge">${roleNames[role] || role}</span>.</p>
            
            <p>Suas credenciais de acesso foram criadas. Por favor, faça login com as informações abaixo:</p>
            
            <div class="credential-box">
              <div class="credential-label">Email</div>
              <div class="credential-value">${email}</div>
            </div>
            
            <div class="password-box">
              <div class="credential-label">⚠️ Senha Temporária</div>
              <div class="credential-value" style="color: #92400e; font-family: 'Courier New', monospace;">${tempPassword}</div>
              <div class="warning">
                <strong>Importante:</strong> Esta é uma senha temporária. Por motivos de segurança, recomendamos que você altere sua senha após o primeiro login.
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('https://wrtnpreotcryidsdxlpn.supabase.co', 'https://28f1674e-8579-4383-a20e-8bdf9c993636.lovableproject.com') || 'https://28f1674e-8579-4383-a20e-8bdf9c993636.lovableproject.com'}" class="button">
                Acessar Plataforma
              </a>
            </div>
            
            <div style="background: #e0e7ff; border-left: 4px solid #6366f1; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <strong>📚 Próximos Passos:</strong>
              <ol style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>Acesse a plataforma usando o botão acima</li>
                <li>Faça login com suas credenciais</li>
                <li>Altere sua senha nas configurações de perfil</li>
                <li>Explore os cursos e conteúdos disponíveis</li>
              </ol>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Se você não solicitou este acesso ou acredita que recebeu este email por engano, por favor ignore esta mensagem ou entre em contato conosco.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Academia Brasileira de Neurociência Política</strong></p>
            <p>contato@abnp.com.br</p>
            <p style="font-size: 12px; margin-top: 10px;">
              © ${new Date().getFullYear()} ABNP. Todos os direitos reservados.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
