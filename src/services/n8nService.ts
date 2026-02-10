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

class N8NService {
  /**
   * Dispara consulta manual de CNDs
   */
  async consultarCNDs(params: ConsultaCNDParams) {
    try {
      const response = await fetch(`${N8N_BASE_URL}/webhook/trigger-consulta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: params.client_id,
          tipos: params.tipos || ['federal', 'estadual', 'fgts']
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
