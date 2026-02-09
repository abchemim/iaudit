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
          vencimento: string | null
        }
        Insert: {
          client_id?: string | null
          concluida_em?: string | null
          created_at?: string
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
          vencimento?: string | null
        }
        Update: {
          client_id?: string | null
          concluida_em?: string | null
          created_at?: string
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
