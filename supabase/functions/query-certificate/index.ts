import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QueryRequest {
  client_id: string;
  certificate_type: "cnd_federal" | "cnd_estadual" | "cnd_fgts";
  cnpj: string;
}

const API_ENDPOINTS = {
  cnd_federal: "https://api.infosimples.com/api/v2/consultas/receita-federal/pgfn/nova",
  cnd_estadual: "https://api.infosimples.com/api/v2/consultas/sefaz/pr/certidao-debitos",
  cnd_fgts: "https://api.infosimples.com/api/v2/consultas/caixa/regularidade",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const INFOSIMPLES_TOKEN = Deno.env.get("INFOSIMPLES_TOKEN");
    if (!INFOSIMPLES_TOKEN) {
      throw new Error("INFOSIMPLES_TOKEN não configurado");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Variáveis do Supabase não configuradas");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { client_id, certificate_type, cnpj }: QueryRequest = await req.json();

    if (!client_id || !certificate_type || !cnpj) {
      throw new Error("Parâmetros obrigatórios: client_id, certificate_type, cnpj");
    }

    const endpoint = API_ENDPOINTS[certificate_type];
    if (!endpoint) {
      throw new Error(`Tipo de certidão inválido: ${certificate_type}`);
    }

    // Clean CNPJ - remove formatting
    const cleanCnpj = cnpj.replace(/[^\d]/g, "");

    console.log(`Consultando ${certificate_type} para CNPJ ${cleanCnpj}`);

    // Make API request to InfoSimples
    const apiResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: INFOSIMPLES_TOKEN,
        cnpj: cleanCnpj,
        timeout: 300,
      }),
    });

    const apiData = await apiResponse.json();

    console.log("API Response:", JSON.stringify(apiData, null, 2));

    // Parse response and determine status
    let status: "ok" | "pending" | "attention" | "expired" = "pending";
    let expiryDate: string | null = null;
    let certificateNumber: string | null = null;
    let notes: string | null = null;

    if (apiData.code === 200 && apiData.data_count > 0) {
      const data = apiData.data[0];
      
      // Check for positive certificate (regular or specific field names)
      if (data.situacao?.toLowerCase().includes("regular") || 
          data.situacao?.toLowerCase().includes("positiva com efeito") ||
          data.certidao_emitida === true) {
        status = "ok";
      } else if (data.situacao?.toLowerCase().includes("negativa")) {
        status = "ok";
      } else if (data.situacao?.toLowerCase().includes("pendente") ||
                 data.situacao?.toLowerCase().includes("pendência")) {
        status = "attention";
      } else {
        status = "pending";
      }

      // Extract expiry date if available
      if (data.validade) {
        // Try to parse date in format DD/MM/YYYY
        const parts = data.validade.split("/");
        if (parts.length === 3) {
          expiryDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }

      certificateNumber = data.codigo_controle || data.numero_certidao || null;
      notes = data.situacao || data.mensagem || null;
    } else if (apiData.code === 600 || apiData.code === 601) {
      // Query in progress or pending
      status = "pending";
      notes = apiData.message || "Consulta em processamento";
    } else {
      // Error or no data
      status = "attention";
      notes = apiData.message || "Erro na consulta";
    }

    // Check if certificate already exists for this client and type
    const { data: existingCert } = await supabase
      .from("certificates")
      .select("id")
      .eq("client_id", client_id)
      .eq("type", certificate_type)
      .maybeSingle();

    let result;

    if (existingCert) {
      // Update existing certificate
      const { data, error } = await supabase
        .from("certificates")
        .update({
          status,
          expiry_date: expiryDate,
          certificate_number: certificateNumber,
          notes,
          last_checked_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingCert.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new certificate record
      const { data, error } = await supabase
        .from("certificates")
        .insert({
          client_id,
          type: certificate_type,
          status,
          expiry_date: expiryDate,
          certificate_number: certificateNumber,
          notes,
          issue_date: status === "ok" ? new Date().toISOString() : null,
          last_checked_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return new Response(
      JSON.stringify({
        success: true,
        certificate: result,
        api_response: apiData,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
