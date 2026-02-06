# Workflows N8N - IAudit CND Automation

## Visão Geral

Este diretório contém os workflows N8N para automação de consultas de Certidões Negativas de Débito (CNDs) via API InfoSimples.

## Workflows Disponíveis

| Workflow | Arquivo | Agendamento | Descrição |
|----------|---------|-------------|-----------|
| CND Federal (PGFN) | `iaudit_cnd_federal.json` | Seg-Sex 08:00 | Consulta CNDs federais para todas empresas ativas |
| FGTS (Caixa) | `iaudit_fgts.json` | Seg-Sex 09:00 | Consulta CRF FGTS com detecção de débitos |
| CND Estadual (SEFAZ) | `iaudit_cnd_estadual.json` | Dia 1 e 15, 10:00 | Consulta CNDs estaduais (PR suportado) |
| Verificar Vencimentos | `iaudit_check_vencimentos.json` | Diário 07:00 | Verifica CNDs prestes a vencer e envia alertas |
| Consulta Manual | `iaudit_consulta_manual.json` | Webhook | Permite consultas on-demand via API |

## Pré-requisitos

### 1. Credenciais do Supabase

Você precisa configurar uma credencial do tipo **HTTP Header Auth** no N8N com:

- **Name**: `supabaseServiceRoleKey`
- **Header Name**: `Authorization`
- **Header Value**: `Bearer [SUA_SERVICE_ROLE_KEY]`

> ⚠️ A Service Role Key está disponível em: Supabase Dashboard → Settings → API → `service_role` (secret)

### 2. Token InfoSimples

O token InfoSimples já está configurado como secret no Supabase Edge Functions (`INFOSIMPLES_TOKEN`).

## Como Importar

### Método 1: Via Interface N8N

1. Abra seu N8N
2. Clique em **Workflows** → **Import from File**
3. Selecione o arquivo `.json` desejado
4. Configure as credenciais quando solicitado
5. Ative o workflow

### Método 2: Via API N8N

```bash
curl -X POST "https://seu-n8n.com/api/v1/workflows" \
  -H "X-N8N-API-KEY: sua-api-key" \
  -H "Content-Type: application/json" \
  -d @iaudit_cnd_federal.json
```

## Configuração Pós-Importação

### 1. Atualizar Credenciais

Após importar cada workflow:
1. Abra o workflow
2. Clique em cada nó HTTP Request
3. Selecione a credencial `supabaseServiceRoleKey` configurada

### 2. Ativar MCP (Opcional)

Se quiser que os workflows fiquem disponíveis para o Lovable via MCP:
1. Abra o workflow
2. Vá em **Settings** (engrenagem)
3. Ative **Available in MCP**

### 3. Testar Antes de Ativar

1. Clique em **Execute Workflow** para testar manualmente
2. Verifique os logs no Supabase: `logs_automacao`
3. Se tudo funcionar, ative o trigger de agendamento

## Fluxo de Dados

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  N8N Workflow   │────▶│  Edge Function   │────▶│   InfoSimples   │
│  (Agendado)     │     │  consulta-cnd    │     │      API        │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │    Supabase      │
                        │  cnd_certidoes   │
                        │  logs_automacao  │
                        └──────────────────┘
```

## Endpoints das Edge Functions

| Função | URL | Método |
|--------|-----|--------|
| consulta-cnd | `https://dtknaeiykrfjrzgvskvz.supabase.co/functions/v1/consulta-cnd` | POST |
| send-cnd-alert | `https://dtknaeiykrfjrzgvskvz.supabase.co/functions/v1/send-cnd-alert` | POST |
| check-cnd-vencimentos | `https://dtknaeiykrfjrzgvskvz.supabase.co/functions/v1/check-cnd-vencimentos` | POST |

## Webhook para Consulta Manual

Após ativar o workflow `iaudit_consulta_manual.json`, você terá uma URL de webhook como:

```
https://seu-n8n.com/webhook/consulta-manual
```

### Exemplo de Chamada

```bash
curl -X POST "https://seu-n8n.com/webhook/consulta-manual" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "uuid-do-cliente",
    "tipo": "federal"
  }'
```

### Tipos Suportados

- `federal` - CND Federal (PGFN)
- `fgts` - CRF FGTS (Caixa)
- `estadual` - CND Estadual (SEFAZ PR)

## Monitoramento

### Logs de Automação

```sql
SELECT * FROM logs_automacao 
WHERE workflow_n8n LIKE 'iaudit%'
ORDER BY created_at DESC 
LIMIT 50;
```

### Créditos InfoSimples

```sql
SELECT 
  DATE(created_at) as data,
  tipo_consulta,
  SUM(creditos_usados) as total_creditos,
  COUNT(*) as consultas
FROM infosimples_creditos
GROUP BY DATE(created_at), tipo_consulta
ORDER BY data DESC;
```

## Custos Estimados

| Tipo de Consulta | Créditos | Custo Estimado |
|------------------|----------|----------------|
| CND Federal | ~1.5 | R$ 1,50 |
| FGTS | ~1.0 | R$ 1,00 |
| CND Estadual | ~1.2 | R$ 1,20 |

## Troubleshooting

### Erro: "Unauthorized"
- Verifique se a credencial `supabaseServiceRoleKey` está configurada corretamente
- Confirme que está usando a Service Role Key, não a Anon Key

### Erro: "INFOSIMPLES_TOKEN não configurado"
- Verifique se o secret está configurado no Supabase: Dashboard → Edge Functions → Secrets

### Consulta retorna "pendente"
- A InfoSimples pode demorar até 5 minutos para processar
- O workflow possui um delay de 3-5 segundos entre consultas

### Rate Limit
- Os workflows possuem batch de 5 empresas com delay entre cada
- Se necessário, aumente o delay no nó "Aguardar (Rate Limit)"
