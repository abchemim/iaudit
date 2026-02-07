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
      certificates: {
        Row: {
          certificate_number: string | null
          client_id: string
          created_at: string
          document_url: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          last_checked_at: string | null
          notes: string | null
          status: Database["public"]["Enums"]["status_type"]
          type: Database["public"]["Enums"]["certificate_type"]
          updated_at: string
        }
        Insert: {
          certificate_number?: string | null
          client_id: string
          created_at?: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          last_checked_at?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          type: Database["public"]["Enums"]["certificate_type"]
          updated_at?: string
        }
        Update: {
          certificate_number?: string | null
          client_id?: string
          created_at?: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          last_checked_at?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          type?: Database["public"]["Enums"]["certificate_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
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
          created_at: string
          data_emissao: string | null
          data_validade: string | null
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
          created_at?: string
          data_emissao?: string | null
          data_validade?: string | null
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
          created_at?: string
          data_emissao?: string | null
          data_validade?: string | null
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
        ]
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
          client_id: string | null
          created_at: string
          dias_antecedencia_alerta: number | null
          email_ativo: boolean | null
          email_endereco: string | null
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
          dias_antecedencia_alerta?: number | null
          email_ativo?: boolean | null
          email_endereco?: string | null
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
          dias_antecedencia_alerta?: number | null
          email_ativo?: boolean | null
          email_endereco?: string | null
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
      debitos_fiscais: {
        Row: {
          api_response: Json | null
          client_id: string
          created_at: string
          descricao: string | null
          detectado_via: string | null
          id: string
          origem: string
          prioridade: string | null
          resolvido_em: string | null
          status: string
          tipo: string
          updated_at: string
          valor: number | null
        }
        Insert: {
          api_response?: Json | null
          client_id: string
          created_at?: string
          descricao?: string | null
          detectado_via?: string | null
          id?: string
          origem: string
          prioridade?: string | null
          resolvido_em?: string | null
          status?: string
          tipo: string
          updated_at?: string
          valor?: number | null
        }
        Update: {
          api_response?: Json | null
          client_id?: string
          created_at?: string
          descricao?: string | null
          detectado_via?: string | null
          id?: string
          origem?: string
          prioridade?: string | null
          resolvido_em?: string | null
          status?: string
          tipo?: string
          updated_at?: string
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "debitos_fiscais_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
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
          email_enabled: boolean | null
          fgts_alert: boolean | null
          id: string
          updated_at: string
          user_id: string
          whatsapp_enabled: boolean | null
        }
        Insert: {
          cert_expiry_alert?: boolean | null
          created_at?: string
          declarations_alert?: boolean | null
          email_enabled?: boolean | null
          fgts_alert?: boolean | null
          id?: string
          updated_at?: string
          user_id: string
          whatsapp_enabled?: boolean | null
        }
        Update: {
          cert_expiry_alert?: boolean | null
          created_at?: string
          declarations_alert?: boolean | null
          email_enabled?: boolean | null
          fgts_alert?: boolean | null
          id?: string
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
          client_id: string | null
          concluido_em: string | null
          created_at: string
          descricao: string | null
          id: string
          prioridade: string
          relacionado_id: string | null
          relacionado_tipo: string | null
          status: string
          tipo: string
          titulo: string
          updated_at: string
          user_id: string | null
          vencimento: string | null
        }
        Insert: {
          client_id?: string | null
          concluido_em?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          prioridade?: string
          relacionado_id?: string | null
          relacionado_tipo?: string | null
          status?: string
          tipo?: string
          titulo: string
          updated_at?: string
          user_id?: string | null
          vencimento?: string | null
        }
        Update: {
          client_id?: string | null
          concluido_em?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          prioridade?: string
          relacionado_id?: string | null
          relacionado_tipo?: string | null
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
          user_id?: string | null
          vencimento?: string | null
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
