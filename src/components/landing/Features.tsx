import { 
  FileCheck, 
  Building2, 
  Wallet, 
  Calculator, 
  Mail, 
  Users,
  Send,
  FolderOpen,
  CheckSquare
} from "lucide-react";

const features = [
  {
    icon: FileCheck,
    title: "Vigilância e-CAC 24h",
    description: "Robôs monitoram sua situação fiscal em tempo real detectando débitos antes de virarem multas.",
    category: "Núcleo Fiscal"
  },
  {
    icon: Building2,
    title: "CNDs Automáticas",
    description: "Emissão periódica e armazenamento de certidões Federais, Estaduais e Municipais.",
    category: "Núcleo Fiscal"
  },
  {
    icon: Wallet,
    title: "Gestão de Parcelamentos",
    description: "Monitore parcelas pagas e a pagar de parcelamentos federais em uma única tela.",
    category: "Núcleo Fiscal"
  },
  {
    icon: Calculator,
    title: "Simples Nacional",
    description: "Monitoramento de sublimites de faturamento e geração automática do DAS.",
    category: "Núcleo Fiscal"
  },
  {
    icon: Mail,
    title: "Caixa Postal Fiscal",
    description: "Leitura automática de mensagens e intimações no e-CAC e no DET.",
    category: "Núcleo Fiscal"
  },
  {
    icon: Users,
    title: "Hub FGTS Digital",
    description: "Monitoramento das guias DCTFWeb, FGTS e alertas de multas por atraso.",
    category: "DP Digital"
  },
  {
    icon: Send,
    title: "Distribuição Automática",
    description: "Envio automático de guias via WhatsApp/E-mail com log de visualização.",
    category: "ConnectHub"
  },
  {
    icon: FolderOpen,
    title: "DriveHub",
    description: "Armazenamento em nuvem com arquivos renomeados e organizados por cliente.",
    category: "Backoffice"
  },
  {
    icon: CheckSquare,
    title: "TaskHub",
    description: "Gerenciador de tarefas com baixa automática quando obrigações são cumpridas.",
    category: "Backoffice"
  }
];

const categoryColors: Record<string, string> = {
  "Núcleo Fiscal": "text-primary",
  "DP Digital": "text-status-success",
  "ConnectHub": "text-status-warning",
  "Backoffice": "text-status-info"
};

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary mb-4 block">
            Funcionalidades
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tudo que você precisa para{" "}
            <span className="text-gradient">automatizar seu escritório</span>
          </h2>
          <p className="text-muted-foreground">
            Uma plataforma completa que substitui acessos manuais repetitivos aos portais governamentais.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-6 group hover:border-primary/30 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Category Badge */}
              <span className={`text-xs font-medium mb-4 block ${categoryColors[feature.category]}`}>
                {feature.category}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
