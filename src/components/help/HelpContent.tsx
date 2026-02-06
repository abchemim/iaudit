import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Video, 
  FileText, 
  ExternalLink,
  Mail,
  Phone,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como cadastrar um novo cliente?",
    answer: "Acesse o menu 'Clientes' na barra lateral e clique no botão 'Novo Cliente'. Preencha os dados obrigatórios como Razão Social, CNPJ e Regime Tributário. Após salvar, o cliente estará disponível para monitoramento em todos os módulos.",
  },
  {
    question: "Como consultar certidões automaticamente?",
    answer: "No módulo 'Certidões', selecione o cliente desejado e clique em 'Nova Consulta'. Escolha o tipo de certidão (Federal, Estadual ou FGTS) e o sistema fará a consulta automaticamente via API. O resultado será salvo e você pode acompanhar a validade.",
  },
  {
    question: "O que significam os status das cores?",
    answer: "Verde (Em dia): Situação regular, sem pendências. Amarelo (Atenção): Há algo que precisa de atenção, como vencimento próximo. Vermelho (Vencido/Irregular): Situação crítica que requer ação imediata.",
  },
  {
    question: "Como funciona o monitoramento de FGTS Digital?",
    answer: "O módulo FGTS Digital permite cadastrar e acompanhar as guias de recolhimento de cada cliente por competência. Você pode registrar pagamentos, acompanhar vencimentos e ter uma visão consolidada de todas as empresas.",
  },
  {
    question: "Como configurar alertas automáticos?",
    answer: "Acesse 'Configurações' > 'Notificações' e ative os canais desejados (Email e/ou WhatsApp). Depois, selecione quais tipos de alerta deseja receber, como vencimento de certidões, declarações pendentes e guias FGTS.",
  },
  {
    question: "O que é o Sublimite do Simples Nacional?",
    answer: "O Sublimite é o teto de faturamento que uma empresa pode atingir para permanecer no Simples Nacional. No Paraná, o limite estadual é diferente do federal. O sistema monitora o faturamento acumulado e alerta quando a empresa se aproxima do limite.",
  },
];

const HelpContent = () => {
  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Central de Ajuda</h2>
        <p className="text-sm text-muted-foreground">
          Encontre respostas para suas dúvidas e aprenda a usar o sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="glass-card hover:bg-secondary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="p-3 rounded-lg bg-primary/10 mb-3">
                  <Book className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium">Documentação</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Guias completos de uso
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card hover:bg-secondary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="p-3 rounded-lg bg-primary/10 mb-3">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium">Tutoriais em Vídeo</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Aprenda passo a passo
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card hover:bg-secondary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="p-3 rounded-lg bg-primary/10 mb-3">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium">Novidades</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Atualizações do sistema
                </p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Perguntas Frequentes
              </CardTitle>
              <CardDescription>
                Respostas para as dúvidas mais comuns sobre o sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Primeiros Passos</CardTitle>
              <CardDescription>
                Siga estes passos para começar a usar o sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Cadastre seus clientes</h4>
                    <p className="text-sm text-muted-foreground">
                      Adicione as empresas que você deseja monitorar com CNPJ e regime tributário.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Configure as integrações</h4>
                    <p className="text-sm text-muted-foreground">
                      Em Configurações, adicione tokens de API e certificados digitais.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Inicie o monitoramento</h4>
                    <p className="text-sm text-muted-foreground">
                      Consulte certidões, cadastre declarações e acompanhe guias FGTS.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Acompanhe o Dashboard</h4>
                    <p className="text-sm text-muted-foreground">
                      Visualize todas as pendências e status de seus clientes em um só lugar.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Support */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Suporte
              </CardTitle>
              <CardDescription>
                Precisa de ajuda? Entre em contato conosco.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">suporte@iaudit.com.br</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <p className="text-sm text-muted-foreground">(41) 3000-0000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Horário</p>
                  <p className="text-sm text-muted-foreground">Seg-Sex: 8h às 18h</p>
                </div>
              </div>
              <Button className="w-full mt-4">
                <MessageCircle className="w-4 h-4 mr-2" />
                Abrir Chamado
              </Button>
            </CardContent>
          </Card>

          {/* Version Info */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">IAudit</p>
                <p className="text-xs text-muted-foreground">Versão 1.0.0</p>
                <p className="text-xs text-muted-foreground mt-2">
                  © 2026 Todos os direitos reservados
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Useful Links */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm">Links Úteis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="https://www.gov.br/receitafederal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Receita Federal
              </a>
              <a
                href="https://www8.receita.fazenda.gov.br/SimplesNacional/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Portal Simples Nacional
              </a>
              <a
                href="https://conectividade.caixa.gov.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                FGTS Digital
              </a>
              <a
                href="https://cav.receita.fazenda.gov.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                e-CAC
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpContent;
