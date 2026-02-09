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
          analisada_ia: boolean | null
          arquivada: boolean | null
          assunto: string | null
          categoria: string | null
          company_id: string
          conteudo_original: string | null
          conteudo_resumido: string | null
          created_at: string | null
          data_leitura: string | null
          data_mensagem: string | null
          data_prazo: string | null
          id: string
          lida: boolean | null
          origem: string | null
          prioridade: string | null
          remetente: string | null
          respondida: boolean | null
          tags_ia: string[] | null
          tem_prazo: boolean | null
        }
        Insert: {
          acao_sugerida?: string | null
          analisada_ia?: boolean | null
          arquivada?: boolean | null
          assunto?: string | null
          categoria?: string | null
          company_id: string
          conteudo_original?: string | null
          conteudo_resumido?: string | null
          created_at?: string | null
          data_leitura?: string | null
          data_mensagem?: string | null
          data_prazo?: string | null
          id?: string
          lida?: boolean | null
          origem?: string | null
          prioridade?: string | null
          remetente?: string | null
          respondida?: boolean | null
          tags_ia?: string[] | null
          tem_prazo?: boolean | null
        }
        Update: {
          acao_sugerida?: string | null
          analisada_ia?: boolean | null
          arquivada?: boolean | null
          assunto?: string | null
          categoria?: string | null
          company_id?: string
          conteudo_original?: string | null
          conteudo_resumido?: string | null
          created_at?: string | null
          data_leitura?: string | null
          data_mensagem?: string | null
          data_prazo?: string | null
          id?: string
          lida?: boolean | null
          origem?: string | null
          prioridade?: string | null
          remetente?: string | null
          respondida?: boolean | null
          tags_ia?: string[] | null
          tem_prazo?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "caixa_postal_fiscal_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          cnpj: string
          company_name: string
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          municipal_registration: string | null
          phone: string | null
          state: string | null
          state_registration: string | null
          tax_regime: Database["public"]["Enums"]["tax_regime"]
          trade_name: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnpj: string
          company_name: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          municipal_registration?: string | null
          phone?: string | null
          state?: string | null
          state_registration?: string | null
          tax_regime?: Database["public"]["Enums"]["tax_regime"]
          trade_name?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cnpj?: string
          company_name?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          municipal_registration?: string | null
          phone?: string | null
          state?: string | null
          state_registration?: string | null
          tax_regime?: Database["public"]["Enums"]["tax_regime"]
          trade_name?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      cnd_certidoes: {
        Row: {
          alertado: boolean | null
          api_response: Json | null
          arquivo_nome: string | null
          arquivo_url: string | null
          client_id: string
          codigo_controle: string | null
          company_id: string | null
          created_at: string
          data_emissao: string | null
          data_validade: string | null
          fonte: string | null
          hash_arquivo: string | null
          id: string
          infosimples_creditos_usados: number | null
          infosimples_query_id: string | null
          infosimples_status: string | null
          notes: string | null
          numero_certidao: string | null
          obtida_automaticamente: boolean | null
          orgao: string
          pdf_base64: string | null
          proximo_check: string | null
          situacao: string | null
          status: string
          tipo: string
          updated_at: string
        }
        Insert: {
          alertado?: boolean | null
          api_response?: Json | null
          arquivo_nome?: string | null
          arquivo_url?: string | null
          client_id: string
          codigo_controle?: string | null
          company_id?: string | null
          created_at?: string
          data_emissao?: string | null
          data_validade?: string | null
          fonte?: string | null
          hash_arquivo?: string | null
          id?: string
          infosimples_creditos_usados?: number | null
          infosimples_query_id?: string | null
          infosimples_status?: string | null
          notes?: string | null
          numero_certidao?: string | null
          obtida_automaticamente?: boolean | null
          orgao?: string
          pdf_base64?: string | null
          proximo_check?: string | null
          situacao?: string | null
          status?: string
          tipo: string
          updated_at?: string
        }
        Update: {
          alertado?: boolean | null
          api_response?: Json | null
          arquivo_nome?: string | null
          arquivo_url?: string | null
          client_id?: string
          codigo_controle?: string | null
          company_id?: string | null
          created_at?: string
          data_emissao?: string | null
          data_validade?: string | null
          fonte?: string | null
          hash_arquivo?: string | null
          id?: string
          infosimples_creditos_usados?: number | null
          infosimples_query_id?: string | null
          infosimples_status?: string | null
          notes?: string | null
          numero_certidao?: string | null
          obtida_automaticamente?: boolean | null
          orgao?: string
          pdf_base64?: string | null
          proximo_check?: string | null
          situacao?: string | null
          status?: string
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
          {
            foreignKeyName: "cnd_certidoes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
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
          status: string
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
          status?: string
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
          status?: string
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
      companies: {
        Row: {
          ativo: boolean | null
          certificado_a1_url: string | null
          certificado_senha_encrypted: string | null
          cnpj: string
          codigo_acesso_ecac: string | null
          created_at: string | null
          faturamento_acumulado: number | null
          id: string
          nome_fantasia: string | null
          razao_social: string
          regime_tributario: string | null
          responsavel_id: string | null
          state: string | null
          state_registration: string | null
          status_fiscal: string | null
          sublimite_simples: number | null
          tags: string[] | null
          ultima_verificacao: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          certificado_a1_url?: string | null
          certificado_senha_encrypted?: string | null
          cnpj: string
          codigo_acesso_ecac?: string | null
          created_at?: string | null
          faturamento_acumulado?: number | null
          id?: string
          nome_fantasia?: string | null
          razao_social: string
          regime_tributario?: string | null
          responsavel_id?: string | null
          state?: string | null
          state_registration?: string | null
          status_fiscal?: string | null
          sublimite_simples?: number | null
          tags?: string[] | null
          ultima_verificacao?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          certificado_a1_url?: string | null
          certificado_senha_encrypted?: string | null
          cnpj?: string
          codigo_acesso_ecac?: string | null
          created_at?: string | null
          faturamento_acumulado?: number | null
          id?: string
          nome_fantasia?: string | null
          razao_social?: string
          regime_tributario?: string | null
          responsavel_id?: string | null
          state?: string | null
          state_registration?: string | null
          status_fiscal?: string | null
          sublimite_simples?: number | null
          tags?: string[] | null
          ultima_verificacao?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          company_address: string | null
          company_cnpj: string | null
          company_name: string | null
          company_phone: string | null
          crc: string | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_address?: string | null
          company_cnpj?: string | null
          company_name?: string | null
          company_phone?: string | null
          crc?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_address?: string | null
          company_cnpj?: string | null
          company_name?: string | null
          company_phone?: string | null
          crc?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      configuracoes_alertas: {
        Row: {
          alerta_cnd_vencimento: boolean | null
          alerta_debito_detectado: boolean | null
          alerta_guia_vencimento: boolean | null
          alerta_intimacao: boolean | null
          alerta_sublimite_simples: boolean | null
          client_id: string | null
          company_id: string | null
          created_at: string
          dias_antecedencia_alerta: number | null
          dias_antecedencia_cnd: number | null
          dias_antecedencia_guia: number | null
          email_ativo: boolean | null
          email_destinatario: string | null
          email_endereco: string | null
          id: string
          percentual_sublimite: number | null
          updated_at: string
          user_id: string
          whatsapp_ativo: boolean | null
          whatsapp_numero: string | null
        }
        Insert: {
          alerta_cnd_vencimento?: boolean | null
          alerta_debito_detectado?: boolean | null
          alerta_guia_vencimento?: boolean | null
          alerta_intimacao?: boolean | null
          alerta_sublimite_simples?: boolean | null
          client_id?: string | null
          company_id?: string | null
          created_at?: string
          dias_antecedencia_alerta?: number | null
          dias_antecedencia_cnd?: number | null
          dias_antecedencia_guia?: number | null
          email_ativo?: boolean | null
          email_destinatario?: string | null
          email_endereco?: string | null
          id?: string
          percentual_sublimite?: number | null
          updated_at?: string
          user_id: string
          whatsapp_ativo?: boolean | null
          whatsapp_numero?: string | null
        }
        Update: {
          alerta_cnd_vencimento?: boolean | null
          alerta_debito_detectado?: boolean | null
          alerta_guia_vencimento?: boolean | null
          alerta_intimacao?: boolean | null
          alerta_sublimite_simples?: boolean | null
          client_id?: string | null
          company_id?: string | null
          created_at?: string
          dias_antecedencia_alerta?: number | null
          dias_antecedencia_cnd?: number | null
          dias_antecedencia_guia?: number | null
          email_ativo?: boolean | null
          email_destinatario?: string | null
          email_endereco?: string | null
          id?: string
          percentual_sublimite?: number | null
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
          {
            foreignKeyName: "fk_configuracoes_alertas_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      debitos_fiscais: {
        Row: {
          api_response: Json | null
          client_id: string
          company_id: string | null
          competencia: string | null
          created_at: string
          data_vencimento: string | null
          descricao: string | null
          detectado_via: string | null
          detected_at: string | null
          id: string
          numero_documento: string | null
          origem: string
          parcelamento_id: string | null
          prioridade: string | null
          resolvido_em: string | null
          status: string
          tipo: string
          updated_at: string
          valor: number | null
          valor_juros: number | null
          valor_multa: number | null
          valor_principal: number | null
          valor_total: number | null
        }
        Insert: {
          api_response?: Json | null
          client_id: string
          company_id?: string | null
          competencia?: string | null
          created_at?: string
          data_vencimento?: string | null
          descricao?: string | null
          detectado_via?: string | null
          detected_at?: string | null
          id?: string
          numero_documento?: string | null
          origem: string
          parcelamento_id?: string | null
          prioridade?: string | null
          resolvido_em?: string | null
          status?: string
          tipo: string
          updated_at?: string
          valor?: number | null
          valor_juros?: number | null
          valor_multa?: number | null
          valor_principal?: number | null
          valor_total?: number | null
        }
        Update: {
          api_response?: Json | null
          client_id?: string
          company_id?: string | null
          competencia?: string | null
          created_at?: string
          data_vencimento?: string | null
          descricao?: string | null
          detectado_via?: string | null
          detected_at?: string | null
          id?: string
          numero_documento?: string | null
          origem?: string
          parcelamento_id?: string | null
          prioridade?: string | null
          resolvido_em?: string | null
          status?: string
          tipo?: string
          updated_at?: string
          valor?: number | null
          valor_juros?: number | null
          valor_multa?: number | null
          valor_principal?: number | null
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "debitos_fiscais_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debitos_fiscais_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debitos_fiscais_parcelamento_id_fkey"
            columns: ["parcelamento_id"]
            isOneToOne: false
            referencedRelation: "parcelamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      fgts_records: {
        Row: {
          amount: number | null
          client_id: string
          competence_month: string
          created_at: string
          due_date: string | null
          guide_number: string | null
          id: string
          notes: string | null
          paid_amount: number | null
          paid_at: string | null
          status: Database["public"]["Enums"]["status_type"]
          updated_at: string
        }
        Insert: {
          amount?: number | null
          client_id: string
          competence_month: string
          created_at?: string
          due_date?: string | null
          guide_number?: string | null
          id?: string
          notes?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          updated_at?: string
        }
        Update: {
          amount?: number | null
          client_id?: string
          competence_month?: string
          created_at?: string
          due_date?: string | null
          guide_number?: string | null
          id?: string
          notes?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fgts_records_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      guias_tributarias: {
        Row: {
          arquivo_nome: string | null
          arquivo_url: string | null
          codigo_barras: string | null
          company_id: string
          competencia: string | null
          created_at: string | null
          data_envio: string | null
          data_pagamento: string | null
          data_vencimento: string | null
          data_visualizacao: string | null
          enviada_cliente: boolean | null
          gerada_automaticamente: boolean | null
          id: string
          origem: string | null
          status: string | null
          tipo: string
          valor: number | null
          visualizada: boolean | null
        }
        Insert: {
          arquivo_nome?: string | null
          arquivo_url?: string | null
          codigo_barras?: string | null
          company_id: string
          competencia?: string | null
          created_at?: string | null
          data_envio?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          data_visualizacao?: string | null
          enviada_cliente?: boolean | null
          gerada_automaticamente?: boolean | null
          id?: string
          origem?: string | null
          status?: string | null
          tipo: string
          valor?: number | null
          visualizada?: boolean | null
        }
        Update: {
          arquivo_nome?: string | null
          arquivo_url?: string | null
          codigo_barras?: string | null
          company_id?: string
          competencia?: string | null
          created_at?: string | null
          data_envio?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          data_visualizacao?: string | null
          enviada_cliente?: boolean | null
          gerada_automaticamente?: boolean | null
          id?: string
          origem?: string | null
          status?: string | null
          tipo?: string
          valor?: number | null
          visualizada?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "guias_tributarias_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      infosimples_creditos: {
        Row: {
          cnpj_consultado: string | null
          created_at: string
          creditos_usados: number
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
          creditos_usados?: number
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
          creditos_usados?: number
          custo_estimado?: number | null
          id?: string
          query_id?: string | null
          sucesso?: boolean | null
          tipo_consulta?: string
          user_id?: string | null
        }
        Relationships: []
      }
      infosimples_saldo_historico: {
        Row: {
          api_response: Json | null
          created_at: string | null
          creditos_usados_mes: number | null
          data_consulta: string | null
          id: string
          plano: string | null
          saldo: number | null
          saldo_atual: number | null
          saldo_creditos: number | null
        }
        Insert: {
          api_response?: Json | null
          created_at?: string | null
          creditos_usados_mes?: number | null
          data_consulta?: string | null
          id?: string
          plano?: string | null
          saldo?: number | null
          saldo_atual?: number | null
          saldo_creditos?: number | null
        }
        Update: {
          api_response?: Json | null
          created_at?: string | null
          creditos_usados_mes?: number | null
          data_consulta?: string | null
          id?: string
          plano?: string | null
          saldo?: number | null
          saldo_atual?: number | null
          saldo_creditos?: number | null
        }
        Relationships: []
      }
      installments: {
        Row: {
          client_id: string
          created_at: string
          current_installment: number | null
          id: string
          installment_count: number
          monthly_amount: number | null
          next_due_date: string | null
          notes: string | null
          paid_amount: number | null
          program_name: string
          start_date: string | null
          status: Database["public"]["Enums"]["status_type"]
          total_amount: number
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          current_installment?: number | null
          id?: string
          installment_count: number
          monthly_amount?: number | null
          next_due_date?: string | null
          notes?: string | null
          paid_amount?: number | null
          program_name: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          total_amount: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          current_installment?: number | null
          id?: string
          installment_count?: number
          monthly_amount?: number | null
          next_due_date?: string | null
          notes?: string | null
          paid_amount?: number | null
          program_name?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "installments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_automacao: {
        Row: {
          acao: string
          client_id: string | null
          company_id: string | null
          created_at: string
          dados_retorno: Json | null
          erro_detalhes: string | null
          id: string
          infosimples_creditos: number | null
          infosimples_query_id: string | null
          mensagem: string | null
          stack_trace: string | null
          status: string
          tempo_execucao: number | null
          workflow_n8n: string | null
        }
        Insert: {
          acao: string
          client_id?: string | null
          company_id?: string | null
          created_at?: string
          dados_retorno?: Json | null
          erro_detalhes?: string | null
          id?: string
          infosimples_creditos?: number | null
          infosimples_query_id?: string | null
          mensagem?: string | null
          stack_trace?: string | null
          status?: string
          tempo_execucao?: number | null
          workflow_n8n?: string | null
        }
        Update: {
          acao?: string
          client_id?: string | null
          company_id?: string | null
          created_at?: string
          dados_retorno?: Json | null
          erro_detalhes?: string | null
          id?: string
          infosimples_creditos?: number | null
          infosimples_query_id?: string | null
          mensagem?: string | null
          stack_trace?: string | null
          status?: string
          tempo_execucao?: number | null
          workflow_n8n?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_automacao_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logs_automacao_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      mailbox_messages: {
        Row: {
          client_id: string
          content: string | null
          created_at: string
          id: string
          message_date: string
          priority: string
          source: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          client_id: string
          content?: string | null
          created_at?: string
          id?: string
          message_date?: string
          priority?: string
          source?: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          content?: string | null
          created_at?: string
          id?: string
          message_date?: string
          priority?: string
          source?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mailbox_messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          cert_expiry_alert: boolean | null
          created_at: string
          declarations_alert: boolean | null
          dias_antecedencia_tarefas: number | null
          email_enabled: boolean | null
          fgts_alert: boolean | null
          id: string
          tarefas_alert: boolean | null
          updated_at: string
          user_id: string
          whatsapp_enabled: boolean | null
        }
        Insert: {
          cert_expiry_alert?: boolean | null
          created_at?: string
          declarations_alert?: boolean | null
          dias_antecedencia_tarefas?: number | null
          email_enabled?: boolean | null
          fgts_alert?: boolean | null
          id?: string
          tarefas_alert?: boolean | null
          updated_at?: string
          user_id: string
          whatsapp_enabled?: boolean | null
        }
        Update: {
          cert_expiry_alert?: boolean | null
          created_at?: string
          declarations_alert?: boolean | null
          dias_antecedencia_tarefas?: number | null
          email_enabled?: boolean | null
          fgts_alert?: boolean | null
          id?: string
          tarefas_alert?: boolean | null
          updated_at?: string
          user_id?: string
          whatsapp_enabled?: boolean | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          client_id: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
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
      parcelamentos: {
        Row: {
          company_id: string
          created_at: string | null
          data_fim_prevista: string | null
          data_inicio: string | null
          dia_vencimento: number | null
          id: string
          numero_parcelamento: string | null
          orgao: string | null
          parcelas_pagas: number | null
          parcelas_pendentes: number | null
          quantidade_parcelas: number | null
          status: string | null
          tipo: string | null
          ultima_atualizacao: string | null
          valor_consolidado: number | null
          valor_original: number | null
          valor_parcela: number | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          data_fim_prevista?: string | null
          data_inicio?: string | null
          dia_vencimento?: number | null
          id?: string
          numero_parcelamento?: string | null
          orgao?: string | null
          parcelas_pagas?: number | null
          parcelas_pendentes?: number | null
          quantidade_parcelas?: number | null
          status?: string | null
          tipo?: string | null
          ultima_atualizacao?: string | null
          valor_consolidado?: number | null
          valor_original?: number | null
          valor_parcela?: number | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          data_fim_prevista?: string | null
          data_inicio?: string | null
          dia_vencimento?: number | null
          id?: string
          numero_parcelamento?: string | null
          orgao?: string | null
          parcelas_pagas?: number | null
          parcelas_pendentes?: number | null
          quantidade_parcelas?: number | null
          status?: string | null
          tipo?: string | null
          ultima_atualizacao?: string | null
          valor_consolidado?: number | null
          valor_original?: number | null
          valor_parcela?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "parcelamentos_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      simples_limits: {
        Row: {
          accumulated_revenue: number
          client_id: string
          id: string
          limit_amount: number
          percentage_used: number | null
          status: Database["public"]["Enums"]["status_type"]
          updated_at: string
          year: number
        }
        Insert: {
          accumulated_revenue?: number
          client_id: string
          id?: string
          limit_amount?: number
          percentage_used?: number | null
          status?: Database["public"]["Enums"]["status_type"]
          updated_at?: string
          year: number
        }
        Update: {
          accumulated_revenue?: number
          client_id?: string
          id?: string
          limit_amount?: number
          percentage_used?: number | null
          status?: Database["public"]["Enums"]["status_type"]
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "simples_limits_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      tarefas: {
        Row: {
          company_id: string | null
          concluida_automaticamente: boolean | null
          concluido_em: string | null
          created_at: string
          data_conclusao: string | null
          data_vencimento: string | null
          descricao: string | null
          id: string
          observacoes: string | null
          prioridade: string
          relacionado_id: string | null
          relacionado_tipo: string | null
          responsavel_id: string | null
          status: string
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          concluida_automaticamente?: boolean | null
          concluido_em?: string | null
          created_at?: string
          data_conclusao?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          observacoes?: string | null
          prioridade?: string
          relacionado_id?: string | null
          relacionado_tipo?: string | null
          responsavel_id?: string | null
          status?: string
          tipo?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          concluida_automaticamente?: boolean | null
          concluido_em?: string | null
          created_at?: string
          data_conclusao?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          observacoes?: string | null
          prioridade?: string
          relacionado_id?: string | null
          relacionado_tipo?: string | null
          responsavel_id?: string | null
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_client_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_declarations: {
        Row: {
          client_id: string
          competence_month: string
          created_at: string
          due_date: string | null
          id: string
          notes: string | null
          receipt_number: string | null
          status: Database["public"]["Enums"]["status_type"]
          submitted_at: string | null
          tax_amount: number | null
          type: Database["public"]["Enums"]["declaration_type"]
          updated_at: string
        }
        Insert: {
          client_id: string
          competence_month: string
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          receipt_number?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          submitted_at?: string | null
          tax_amount?: number | null
          type: Database["public"]["Enums"]["declaration_type"]
          updated_at?: string
        }
        Update: {
          client_id?: string
          competence_month?: string
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          receipt_number?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          submitted_at?: string | null
          tax_amount?: number | null
          type?: Database["public"]["Enums"]["declaration_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_declarations_client_id_fkey"
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
          created_at: string
          id: string
          is_active: boolean
          last_login_at: string | null
          name: string | null
          phone: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      relatorio_creditos: {
        Row: {
          custo_total: number | null
          data: string | null
          tipo_consulta: string | null
          total_consultas: number | null
          total_creditos: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      certificate_type:
        | "cnd_federal"
        | "cnd_estadual"
        | "cnd_municipal"
        | "cnd_trabalhista"
        | "cnd_fgts"
      declaration_type:
        | "pgdas"
        | "pgmei"
        | "dctfweb"
        | "sped_fiscal"
        | "sped_contabil"
        | "ecd"
        | "ecf"
      status_type: "ok" | "pending" | "attention" | "expired"
      tax_regime: "simples_nacional" | "lucro_presumido" | "lucro_real" | "mei"
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
    Enums: {
      certificate_type: [
        "cnd_federal",
        "cnd_estadual",
        "cnd_municipal",
        "cnd_trabalhista",
        "cnd_fgts",
      ],
      declaration_type: [
        "pgdas",
        "pgmei",
        "dctfweb",
        "sped_fiscal",
        "sped_contabil",
        "ecd",
        "ecf",
      ],
      status_type: ["ok", "pending", "attention", "expired"],
      tax_regime: ["simples_nacional", "lucro_presumido", "lucro_real", "mei"],
    },
  },
} as const
