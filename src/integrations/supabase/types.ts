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
      clientes: {
        Row: {
          ativo: boolean | null
          cei: string | null
          cnpj: string | null
          cpf: string | null
          created_at: string | null
          data_nascimento: string | null
          email: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cei?: string | null
          cnpj?: string | null
          cpf?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cei?: string | null
          cnpj?: string | null
          cpf?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      consultas_cnd_estadual: {
        Row: {
          cliente_id: string | null
          cnpj: string | null
          codigo_controle: string | null
          cpf: string | null
          created_at: string | null
          dados_completos: Json | null
          data_emissao: string | null
          data_validade: string | null
          estado: string | null
          id: string
          mensagem_erro: string | null
          numero_certidao: string | null
          pdf_url: string | null
          situacao: string | null
          status: string | null
        }
        Insert: {
          cliente_id?: string | null
          cnpj?: string | null
          codigo_controle?: string | null
          cpf?: string | null
          created_at?: string | null
          dados_completos?: Json | null
          data_emissao?: string | null
          data_validade?: string | null
          estado?: string | null
          id?: string
          mensagem_erro?: string | null
          numero_certidao?: string | null
          pdf_url?: string | null
          situacao?: string | null
          status?: string | null
        }
        Update: {
          cliente_id?: string | null
          cnpj?: string | null
          codigo_controle?: string | null
          cpf?: string | null
          created_at?: string | null
          dados_completos?: Json | null
          data_emissao?: string | null
          data_validade?: string | null
          estado?: string | null
          id?: string
          mensagem_erro?: string | null
          numero_certidao?: string | null
          pdf_url?: string | null
          situacao?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultas_cnd_estadual_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      consultas_cnd_federal: {
        Row: {
          cliente_id: string | null
          cnpj: string | null
          codigo_controle: string | null
          cpf: string | null
          created_at: string | null
          dados_completos: Json | null
          data_emissao: string | null
          data_validade: string | null
          id: string
          mensagem_erro: string | null
          numero_certidao: string | null
          pdf_url: string | null
          situacao: string | null
          status: string | null
        }
        Insert: {
          cliente_id?: string | null
          cnpj?: string | null
          codigo_controle?: string | null
          cpf?: string | null
          created_at?: string | null
          dados_completos?: Json | null
          data_emissao?: string | null
          data_validade?: string | null
          id?: string
          mensagem_erro?: string | null
          numero_certidao?: string | null
          pdf_url?: string | null
          situacao?: string | null
          status?: string | null
        }
        Update: {
          cliente_id?: string | null
          cnpj?: string | null
          codigo_controle?: string | null
          cpf?: string | null
          created_at?: string | null
          dados_completos?: Json | null
          data_emissao?: string | null
          data_validade?: string | null
          id?: string
          mensagem_erro?: string | null
          numero_certidao?: string | null
          pdf_url?: string | null
          situacao?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultas_cnd_federal_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      consultas_fgts: {
        Row: {
          cei: string | null
          cliente_id: string | null
          cnpj: string | null
          codigo_verificacao: string | null
          created_at: string | null
          dados_completos: Json | null
          data_emissao: string | null
          data_validade: string | null
          id: string
          mensagem_erro: string | null
          numero_certidao: string | null
          pdf_url: string | null
          situacao: string | null
          status: string | null
        }
        Insert: {
          cei?: string | null
          cliente_id?: string | null
          cnpj?: string | null
          codigo_verificacao?: string | null
          created_at?: string | null
          dados_completos?: Json | null
          data_emissao?: string | null
          data_validade?: string | null
          id?: string
          mensagem_erro?: string | null
          numero_certidao?: string | null
          pdf_url?: string | null
          situacao?: string | null
          status?: string | null
        }
        Update: {
          cei?: string | null
          cliente_id?: string | null
          cnpj?: string | null
          codigo_verificacao?: string | null
          created_at?: string | null
          dados_completos?: Json | null
          data_emissao?: string | null
          data_validade?: string | null
          id?: string
          mensagem_erro?: string | null
          numero_certidao?: string | null
          pdf_url?: string | null
          situacao?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultas_fgts_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_envio: {
        Row: {
          canal: string | null
          cliente_id: string | null
          consulta_id: string | null
          created_at: string | null
          destinatario: string | null
          id: string
          status: string | null
          tipo_consulta: string | null
          visualizado_em: string | null
        }
        Insert: {
          canal?: string | null
          cliente_id?: string | null
          consulta_id?: string | null
          created_at?: string | null
          destinatario?: string | null
          id?: string
          status?: string | null
          tipo_consulta?: string | null
          visualizado_em?: string | null
        }
        Update: {
          canal?: string | null
          cliente_id?: string | null
          consulta_id?: string | null
          created_at?: string | null
          destinatario?: string | null
          id?: string
          status?: string | null
          tipo_consulta?: string | null
          visualizado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_envio_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
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
