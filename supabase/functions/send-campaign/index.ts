import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendCampaignRequest {
  campaignId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { campaignId }: SendCampaignRequest = await req.json();

    console.log("Enviando campanha:", campaignId);

    // Buscar campanha
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", campaignId)
      .single();

    if (campaignError || !campaign) {
      throw new Error("Campanha não encontrada");
    }

    if (campaign.status !== "draft") {
      throw new Error("Apenas campanhas em rascunho podem ser enviadas");
    }

    // Atualizar status para "sending"
    await supabase
      .from("campaigns")
      .update({ status: "sending" })
      .eq("id", campaignId);

    // Buscar destinatários (todos os usuários com email)
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, display_name, email_notifications")
      .eq("email_notifications", true);

    if (profilesError) {
      throw profilesError;
    }

    // Buscar emails dos usuários
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      throw usersError;
    }

    // Filtrar usuários com notificações ativas
    const enabledUserIds = new Set(profiles?.map(p => p.user_id) || []);
    const recipients = users
      .filter(user => user.email && enabledUserIds.has(user.id))
      .map(user => user.email!);

    console.log(`Enviando para ${recipients.length} destinatários`);

    let successCount = 0;
    let errorCount = 0;

    // Enviar emails em lotes de 10
    const batchSize = 10;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      for (const email of batch) {
        try {
          await resend.emails.send({
            from: "ABNP <onboarding@resend.dev>",
            to: [email],
            subject: campaign.subject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">${campaign.subject}</h1>
                <div style="white-space: pre-wrap; line-height: 1.6;">
                  ${campaign.content}
                </div>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 12px;">
                  Esta é uma campanha de email da ABNP.
                </p>
              </div>
            `,
          });
          successCount++;
        } catch (error) {
          console.error(`Erro ao enviar para ${email}:`, error);
          errorCount++;
        }
      }

      // Pequeno delay entre lotes
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Atualizar campanha com resultados
    await supabase
      .from("campaigns")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        sent_count: successCount,
      })
      .eq("id", campaignId);

    console.log(`Campanha enviada. Sucesso: ${successCount}, Erros: ${errorCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        sent_count: successCount,
        error_count: errorCount,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Erro na função send-campaign:", error);
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
