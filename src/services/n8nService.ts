// src/services/n8nService.ts

const N8N_BASE_URL = import.meta.env.VITE_N8N_BASE_URL || 'https://seu-n8n.com';

export interface ConsultaCNDParams {
  client_id: string;
  tipos?: ('federal' | 'estadual' | 'fgts')[];
}

export interface EnviarNotificacaoParams {
  client_id: string;
  user_id: string;
  tipo_certidao: string;
  mensagem: string;
  pdf_base64?: string;
}

export interface UploadPDFParams {
  client_id: string;
  cnpj: string;
  razao_social: string;
  tipo_certidao: string;
  pdf_base64: string;
  numero_certidao?: string;
}

const VALID_CND_TIPOS = ['federal', 'estadual', 'fgts', 'municipal', 'trabalhista'] as const;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateUUID(value: string, fieldName: string): void {
  if (!UUID_REGEX.test(value)) {
    throw new Error(`${fieldName} inválido`);
  }
}

function validateTipos(tipos: string[]): void {
  for (const tipo of tipos) {
    if (!VALID_CND_TIPOS.includes(tipo as any)) {
      throw new Error(`Tipo de CND inválido: ${tipo}`);
    }
  }
}

class N8NService {
  /**
   * Dispara consulta manual de CNDs
   */
  async consultarCNDs(params: ConsultaCNDParams) {
    validateUUID(params.client_id, 'client_id');
    const tipos = params.tipos || ['federal', 'estadual', 'fgts'];
    validateTipos(tipos);

    try {
      const response = await fetch(`${N8N_BASE_URL}/webhook/trigger-consulta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: params.client_id,
          tipos
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao disparar consulta');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro consultarCNDs:', error);
      throw error;
    }
  }

  /**
   * Envia notificação via WhatsApp/Email
   */
  async enviarNotificacao(params: EnviarNotificacaoParams) {
    validateUUID(params.client_id, 'client_id');
    validateUUID(params.user_id, 'user_id');
    if (!params.tipo_certidao || typeof params.tipo_certidao !== 'string' || params.tipo_certidao.length > 100) {
      throw new Error('tipo_certidao inválido');
    }
    if (!params.mensagem || typeof params.mensagem !== 'string' || params.mensagem.length > 5000) {
      throw new Error('mensagem inválida');
    }

    try {
      const response = await fetch(`${N8N_BASE_URL}/webhook-notificacao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar notificação');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro enviarNotificacao:', error);
      throw error;
    }
  }

  /**
   * Faz upload de PDF para Google Drive
   */
  async uploadPDF(params: UploadPDFParams) {
    validateUUID(params.client_id, 'client_id');
    if (!params.cnpj || !/^\d{14}$/.test(params.cnpj.replace(/\D/g, ''))) {
      throw new Error('CNPJ inválido');
    }
    if (!params.razao_social || params.razao_social.length > 255) {
      throw new Error('razao_social inválido');
    }
    if (!params.tipo_certidao || typeof params.tipo_certidao !== 'string' || params.tipo_certidao.length > 100) {
      throw new Error('tipo_certidao inválido');
    }

    try {
      const response = await fetch(`${N8N_BASE_URL}/webhook-upload-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro uploadPDF:', error);
      throw error;
    }
  }
}

export const n8nService = new N8NService();
