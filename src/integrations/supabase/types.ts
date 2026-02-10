export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      caixa_postal_fiscal: {
        Row: {
          acao_sugerida: string | null
          anexos: Json | null
          arquivada: boolean | null
          assunto: string | null
          classificacao: string | null
          cliente_id: string | null
          conteudo_original: string | null
          conteudo_resumo: string | null
          created_at: string | null
          data_leitura: string | null
          data_prazo: string | null
          dias_restantes: number | null
          id: string
          lida: boolean | null
          origem: string | null
          possui_prazo: boolean | null
          remetente: string | null
          responsavel: string | null
          tags_ia: string[] | null
          tipo_mensagem: string | null
          urgencia: string | null
        }
        Insert: {
          acao_sugerida?: string | null
          anexos?: Json | null
          arquivada?: boolean | null
          assunto?: string | null
          classificacao?: string | null
          cliente_id?: string | null
          conteudo_original?: string | null
          conteudo_resumo?: string | null
          created_at?: string | null
          data_leitura?: string | null
          data_prazo?: string | null
          dias_restantes?: number | null
          id?: string
          lida?: boolean | null
          origem?: string | null
          possui_prazo?: boolean | null
          remetente?: string | null
          responsavel?: string | null
          tags_ia?: string[] | null
          tipo_mensagem?: string | null
          urgencia?: string | null
        }
        Update: {
          acao_sugerida?: string | null
          anexos?: Json | null
          arquivada?: boolean | null
          assunto?: string | null
          classificacao?: string | null
          cliente_id?: string | null
          conteudo_original?: string | null
          conteudo_resumo?: string | null
          created_at?: string | null
          data_leitura?: string | null
          data_prazo?: string | null
          dias_restantes?: number | null
          id?: string
          lida?: boolean | null
          origem?: string | null
          possui_prazo?: boolean | null
          remetente?: string | null
          responsavel?: string | null
          tags_ia?: string[] | null
          tipo_mensagem?: string | null
          urgencia?: string | null
        }
        Relationships: []
      }
      clientes: {
        Row: {
          ativo: boolean | null
          cep: string | null
          certificado_a1_path: string | null
          certificado_senha_encrypted: string | null
          cidade: string | null
          cnpj: string
          created_at: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          frequencia_consulta: string | null
          id: string
          inscricao_estadual: string | null
          inscricao_municipal: string | null
          nome_fantasia: string | null
          observacoes: string | null
          razao_social: string
          regime_tributario: string | null
          responsavel: string | null
          responsavel_contador: string | null
          tags: string[] | null
          telefone: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          ativo?: boolean | null
          cep?: string | null
          certificado_a1_path?: string | null
          certificado_senha_encrypted?: string | null
          cidade?: string | null
          cnpj: string
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          frequencia_consulta?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          nome_fantasia?: string | null
          observacoes?: string | null
          razao_social: string
          regime_tributario?: string | null
          responsavel?: string | null
          responsavel_contador?: string | null
          tags?: string[] | null
          telefone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          ativo?: boolean | null
          cep?: string | null
          certificado_a1_path?: string | null
          certificado_senha_encrypted?: string | null
          cidade?: string | null
          cnpj?: string
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          frequencia_consulta?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          nome_fantasia?: string | null
          observacoes?: string | null
          razao_social?: string
          regime_tributario?: string | null
          responsavel?: string | null
          responsavel_contador?: string | null
          tags?: string[] | null
          telefone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          cnpj: string
          company_name: string
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          state: string | null
          state_registration: string | null
          user_id: string | null
        }
        Insert: {
          cnpj: string
          company_name: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          state?: string | null
          state_registration?: string | null
          user_id?: string | null
        }
        Update: {
          cnpj?: string
          company_name?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          state?: string | null
          state_registration?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cnd_certidoes: {
        Row: {
          alertado: boolean | null
          api_response: Json | null
          arquivo_url: string | null
          client_id: string
          codigo_controle: string | null
          created_at: string
          data_emissao: string | null
          data_validade: string | null
          id: string
          infosimples_creditos_usados: number | null
          infosimples_query_id: string | null
          infosimples_status: string | null
          numero_certidao: string | null
          obtida_automaticamente: boolean | null
          orgao: string | null
          pdf_base64: string | null
          proximo_check: string | null
          situacao: string | null
          status: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          alertado?: boolean | null
          api_response?: Json | null
          arquivo_url?: string | null
          client_id: string
          codigo_controle?: string | null
          created_at?: string
          data_emissao?: string | null
          data_validade?: string | null
          id?: string
          infosimples_creditos_usados?: number | null
          infosimples_query_id?: string | null
          infosimples_status?: string | null
          numero_certidao?: string | null
          obtida_automaticamente?: boolean | null
          orgao?: string | null
          pdf_base64?: string | null
          proximo_check?: string | null
          situacao?: string | null
          status?: string | null
          tipo: string
          updated_at?: string
        }
        Update: {
          alertado?: boolean | null
          api_response?: Json | null
          arquivo_url?: string | null
          client_id?: string
          codigo_controle?: string | null
          created_at?: string
          data_emissao?: string | null
          data_validade?: string | null
          id?: string
          infosimples_creditos_usados?: number | null
          infosimples_query_id?: string | null
          infosimples_status?: string | null
          numero_certidao?: string | null
          obtida_automaticamente?: boolean | null
          orgao?: string | null
          pdf_base64?: string | null
          proximo_check?: string | null
          situacao?: string | null
          status?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cnd_certidoes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      cnd_consultas_jobs: {
        Row: {
          client_id: string
          created_at: string
          error: string | null
          id: string
          progress: number | null
          result: Json | null
          status: string | null
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          error?: string | null
          id?: string
          progress?: number | null
          result?: Json | null
          status?: string | null
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          error?: string | null
          id?: string
          progress?: number | null
          result?: Json | null
          status?: string | null
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cnd_consultas_jobs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      cnds: {
        Row: {
          client_id: string | null
          created_at: string | null
          data_emissao: string | null
          data_vencimento: string
          id: string
          status_cnd: string | null
          tipo: string
          url_pdf: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          data_emissao?: string | null
          data_vencimento: string
          id?: string
          status_cnd?: string | null
          tipo: string
          url_pdf?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          data_emissao?: string | null
          data_vencimento?: string
          id?: string
          status_cnd?: string | null
          tipo?: string
          url_pdf?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cnds_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes: {
        Row: {
          categoria: string | null
          chave: string
          descricao: string | null
          id: string
          responsavel: string | null
          sensivel: boolean | null
          tipo: string | null
          updated_at: string | null
          valor: string | null
        }
        Insert: {
          categoria?: string | null
          chave: string
          descricao?: string | null
          id?: string
          responsavel?: string | null
          sensivel?: boolean | null
          tipo?: string | null
          updated_at?: string | null
          valor?: string | null
        }
        Update: {
          categoria?: string | null
          chave?: string
          descricao?: string | null
          id?: string
          responsavel?: string | null
          sensivel?: boolean | null
          tipo?: string | null
          updated_at?: string | null
          valor?: string | null
        }
        Relationships: []
      }
      configuracoes_alertas: {
        Row: {
          alerta_cnd_vencimento: boolean | null
          client_id: string | null
          created_at: string
          dias_antecedencia: number | null
          email_ativo: boolean | null
          id: string
          updated_at: string
          user_id: string
          whatsapp_ativo: boolean | null
          whatsapp_numero: string | null
        }
        Insert: {
          alerta_cnd_vencimento?: boolean | null
          client_id?: string | null
          created_at?: string
          dias_antecedencia?: number | null
          email_ativo?: boolean | null
          id?: string
          updated_at?: string
          user_id: string
          whatsapp_ativo?: boolean | null
          whatsapp_numero?: string | null
        }
        Update: {
          alerta_cnd_vencimento?: boolean | null
          client_id?: string | null
          created_at?: string
          dias_antecedencia?: number | null
          email_ativo?: boolean | null
          id?: string
          updated_at?: string
          user_id?: string
          whatsapp_ativo?: boolean | null
          whatsapp_numero?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_alertas_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      consultas_cnd: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          data_emissao: string | null
          data_notificacao: string | null
          data_validade: string | null
          detalhes_debitos: Json | null
          id: string
          notificado: boolean | null
          numero_certidao: string | null
          pdf_path: string | null
          pdf_url: string | null
          possui_debitos: boolean | null
          protocolo: string | null
          quantidade_debitos: number | null
          responsavel: string | null
          resposta_api: Json | null
          situacao_fiscal: string | null
          status: string
          tipo_certidao: string
          valor_total_debitos: number | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          data_emissao?: string | null
          data_notificacao?: string | null
          data_validade?: string | null
          detalhes_debitos?: Json | null
          id?: string
          notificado?: boolean | null
          numero_certidao?: string | null
          pdf_path?: string | null
          pdf_url?: string | null
          possui_debitos?: boolean | null
          protocolo?: string | null
          quantidade_debitos?: number | null
          responsavel?: string | null
          resposta_api?: Json | null
          situacao_fiscal?: string | null
          status: string
          tipo_certidao: string
          valor_total_debitos?: number | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          data_emissao?: string | null
          data_notificacao?: string | null
          data_validade?: string | null
          detalhes_debitos?: Json | null
          id?: string
          notificado?: boolean | null
          numero_certidao?: string | null
          pdf_path?: string | null
          pdf_url?: string | null
          possui_debitos?: boolean | null
          protocolo?: string | null
          quantidade_debitos?: number | null
          responsavel?: string | null
          resposta_api?: Json | null
          situacao_fiscal?: string | null
          status?: string
          tipo_certidao?: string
          valor_total_debitos?: number | null
        }
        Relationships: []
      }
      documentos_cnd: {
        Row: {
          cliente_id: string | null
          data_emissao: string | null
          id: string
          status_regularidade: string | null
          tipo: string | null
          url_arquivo: string | null
        }
        Insert: {
          cliente_id?: string | null
          data_emissao?: string | null
          id?: string
          status_regularidade?: string | null
          tipo?: string | null
          url_arquivo?: string | null
        }
        Update: {
          cliente_id?: string | null
          data_emissao?: string | null
          id?: string
          status_regularidade?: string | null
          tipo?: string | null
          url_arquivo?: string | null
        }
        Relationships: []
      }
      envios: {
        Row: {
          anexos: Json | null
          assunto: string | null
          canal: string
          cliente_id: string | null
          consulta_cnd_id: string | null
          created_at: string | null
          data_envio: string | null
          data_leitura: string | null
          destinatario: string
          erro_mensagem: string | null
          id: string
          mensagem: string | null
          message_id: string | null
          metadata: Json | null
          responsavel: string | null
          status: string | null
          template_usado: string | null
          tentativas: number | null
        }
        Insert: {
          anexos?: Json | null
          assunto?: string | null
          canal: string
          cliente_id?: string | null
          consulta_cnd_id?: string | null
          created_at?: string | null
          data_envio?: string | null
          data_leitura?: string | null
          destinatario: string
          erro_mensagem?: string | null
          id?: string
          mensagem?: string | null
          message_id?: string | null
          metadata?: Json | null
          responsavel?: string | null
          status?: string | null
          template_usado?: string | null
          tentativas?: number | null
        }
        Update: {
          anexos?: Json | null
          assunto?: string | null
          canal?: string
          cliente_id?: string | null
          consulta_cnd_id?: string | null
          created_at?: string | null
          data_envio?: string | null
          data_leitura?: string | null
          destinatario?: string
          erro_mensagem?: string | null
          id?: string
          mensagem?: string | null
          message_id?: string | null
          metadata?: Json | null
          responsavel?: string | null
          status?: string | null
          template_usado?: string | null
          tentativas?: number | null
        }
        Relationships: []
      }
      historico_debitos: {
        Row: {
          cliente_id: string | null
          consulta_cnd_id: string | null
          created_at: string | null
          data_constituicao: string | null
          data_vencimento: string | null
          id: string
          numero_inscricao: string | null
          numero_parcelamento: string | null
          observacoes: string | null
          orgao_origem: string | null
          parcelas_pagas: number | null
          processo: string | null
          quantidade_parcelas: number | null
          responsavel: string | null
          situacao: string | null
          tipo_debito: string | null
          valor_juros: number | null
          valor_multa: number | null
          valor_principal: number | null
          valor_total: number | null
        }
        Insert: {
          cliente_id?: string | null
          consulta_cnd_id?: string | null
          created_at?: string | null
          data_constituicao?: string | null
          data_vencimento?: string | null
          id?: string
          numero_inscricao?: string | null
          numero_parcelamento?: string | null
          observacoes?: string | null
          orgao_origem?: string | null
          parcelas_pagas?: number | null
          processo?: string | null
          quantidade_parcelas?: number | null
          responsavel?: string | null
          situacao?: string | null
          tipo_debito?: string | null
          valor_juros?: number | null
          valor_multa?: number | null
          valor_principal?: number | null
          valor_total?: number | null
        }
        Update: {
          cliente_id?: string | null
          consulta_cnd_id?: string | null
          created_at?: string | null
          data_constituicao?: string | null
          data_vencimento?: string | null
          id?: string
          numero_inscricao?: string | null
          numero_parcelamento?: string | null
          observacoes?: string | null
          orgao_origem?: string | null
          parcelas_pagas?: number | null
          processo?: string | null
          quantidade_parcelas?: number | null
          responsavel?: string | null
          situacao?: string | null
          tipo_debito?: string | null
          valor_juros?: number | null
          valor_multa?: number | null
          valor_principal?: number | null
          valor_total?: number | null
        }
        Relationships: []
      }
      infosimples_creditos: {
        Row: {
          cnpj_consultado: string | null
          created_at: string
          creditos_usados: number | null
          custo_estimado: number | null
          id: string
          query_id: string | null
          sucesso: boolean | null
          tipo_consulta: string
          user_id: string | null
        }
        Insert: {
          cnpj_consultado?: string | null
          created_at?: string
          creditos_usados?: number | null
          custo_estimado?: number | null
          id?: string
          query_id?: string | null
          sucesso?: boolean | null
          tipo_consulta: string
          user_id?: string | null
        }
        Update: {
          cnpj_consultado?: string | null
          created_at?: string
          creditos_usados?: number | null
          custo_estimado?: number | null
          id?: string
          query_id?: string | null
          sucesso?: boolean | null
          tipo_consulta?: string
          user_id?: string | null
        }
        Relationships: []
      }
      logs_automacao: {
        Row: {
          acao: string | null
          client_id: string | null
          created_at: string | null
          dados_retorno: Json | null
          id: string
          infosimples_creditos: number | null
          infosimples_query_id: string | null
          mensagem: string | null
          status: string | null
          tempo_execucao: number | null
          workflow_n8n: string | null
        }
        Insert: {
          acao?: string | null
          client_id?: string | null
          created_at?: string | null
          dados_retorno?: Json | null
          id?: string
          infosimples_creditos?: number | null
          infosimples_query_id?: string | null
          mensagem?: string | null
          status?: string | null
          tempo_execucao?: number | null
          workflow_n8n?: string | null
        }
        Update: {
          acao?: string | null
          client_id?: string | null
          created_at?: string | null
          dados_retorno?: Json | null
          id?: string
          infosimples_creditos?: number | null
          infosimples_query_id?: string | null
          mensagem?: string | null
          status?: string | null
          tempo_execucao?: number | null
          workflow_n8n?: string | null
        }
        Relationships: []
      }
      logs_sistema: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          detalhes: Json | null
          execution_id: string | null
          id: string
          ip_address: unknown
          mensagem: string | null
          responsavel: string | null
          severidade: string | null
          stack_trace: string | null
          tipo_evento: string
          user_agent: string | null
          workflow_name: string | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          detalhes?: Json | null
          execution_id?: string | null
          id?: string
          ip_address?: unknown
          mensagem?: string | null
          responsavel?: string | null
          severidade?: string | null
          stack_trace?: string | null
          tipo_evento: string
          user_agent?: string | null
          workflow_name?: string | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          detalhes?: Json | null
          execution_id?: string | null
          id?: string
          ip_address?: unknown
          mensagem?: string | null
          responsavel?: string | null
          severidade?: string | null
          stack_trace?: string | null
          tipo_evento?: string
          user_agent?: string | null
          workflow_name?: string | null
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          cnd_alert: boolean | null
          created_at: string
          dias_antecedencia_cnd: number | null
          dias_antecedencia_tarefas: number | null
          email_alert: boolean | null
          id: string
          tarefas_alert: boolean | null
          updated_at: string
          user_id: string
          whatsapp_ativo: boolean | null
          whatsapp_numero: string | null
        }
        Insert: {
          cnd_alert?: boolean | null
          created_at?: string
          dias_antecedencia_cnd?: number | null
          dias_antecedencia_tarefas?: number | null
          email_alert?: boolean | null
          id?: string
          tarefas_alert?: boolean | null
          updated_at?: string
          user_id: string
          whatsapp_ativo?: boolean | null
          whatsapp_numero?: string | null
        }
        Update: {
          cnd_alert?: boolean | null
          created_at?: string
          dias_antecedencia_cnd?: number | null
          dias_antecedencia_tarefas?: number | null
          email_alert?: boolean | null
          id?: string
          tarefas_alert?: boolean | null
          updated_at?: string
          user_id?: string
          whatsapp_ativo?: boolean | null
          whatsapp_numero?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          client_id: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      tarefas: {
        Row: {
          client_id: string | null
          concluida_em: string | null
          created_at: string
          data_vencimento: string | null
          descricao: string | null
          id: string
          prioridade: string | null
          relacionado_id: string | null
          relacionado_tipo: string | null
          status: string | null
          tipo: string | null
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          concluida_em?: string | null
          created_at?: string
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          prioridade?: string | null
          relacionado_id?: string | null
          relacionado_tipo?: string | null
          status?: string | null
          tipo?: string | null
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          concluida_em?: string | null
          created_at?: string
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          prioridade?: string | null
          relacionado_id?: string | null
          relacionado_tipo?: string | null
          status?: string | null
          tipo?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          crc_number: string | null
          created_at: string
          display_name: string | null
          id: string
          office_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          crc_number?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          office_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          crc_number?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          office_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
