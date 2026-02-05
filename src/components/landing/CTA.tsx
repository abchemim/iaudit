import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="glass-card max-w-4xl mx-auto p-8 md:p-12 text-center rounded-2xl border-primary/20">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <Shield className="w-8 h-8 text-primary" />
          </div>

          {/* Content */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para automatizar sua{" "}
            <span className="text-gradient">gestão fiscal</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Comece hoje mesmo e liberte sua equipe de tarefas repetitivas. 
            Seus clientes protegidos, seu escritório mais produtivo.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" className="group">
              Começar Gratuitamente
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="glass" size="xl">
              <Zap className="w-5 h-5" />
              Agendar Demonstração
            </Button>
          </div>

          {/* Trust Note */}
          <p className="text-xs text-muted-foreground mt-6">
            Sem cartão de crédito • Setup em 5 minutos • Suporte dedicado
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
