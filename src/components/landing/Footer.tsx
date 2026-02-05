import { Shield } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Produto: ["Funcionalidades", "Preços", "Integrações", "API"],
    Empresa: ["Sobre", "Blog", "Carreiras", "Contato"],
    Legal: ["Privacidade", "Termos", "LGPD", "Segurança"],
    Suporte: ["Central de Ajuda", "Documentação", "Status", "Comunidade"]
  };

  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-7 h-7 text-primary" />
              <span className="text-lg font-bold">
                <span className="text-foreground">IA</span>
                <span className="text-gradient">udit</span>
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plataforma de inteligência fiscal para escritórios contábeis.
            </p>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4 text-sm">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} IAudit. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Desenvolvido por{" "}
            <a 
              href="https://allanturing.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Allan Turing
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
