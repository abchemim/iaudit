import { useState } from "react";
import { Save, User, Bell, Shield, Database, Key, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SettingsContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: false,
    certExpiry: true,
    declarations: true,
    fgts: true,
  });

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Configurações</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas preferências e configurações do sistema.
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="glass-card p-1">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="w-4 h-4" />
            Escritório
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Key className="w-4 h-4" />
            Integrações
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Informações do Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e credenciais.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" placeholder="Seu nome" defaultValue="Administrador" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user?.email || ""} disabled />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input id="role" placeholder="Ex: Contador" />
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h4 className="font-medium mb-4">Alterar Senha</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div />
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Preferências de Notificações</CardTitle>
              <CardDescription>
                Configure como e quando deseja receber alertas do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Canais de Notificação</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      Receba alertas por email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">
                      Receba alertas por WhatsApp
                    </p>
                  </div>
                  <Switch
                    checked={notifications.whatsapp}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, whatsapp: checked })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Tipos de Alerta</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Vencimento de Certidões</p>
                    <p className="text-sm text-muted-foreground">
                      Alertar quando certidões estiverem próximas do vencimento
                    </p>
                  </div>
                  <Switch
                    checked={notifications.certExpiry}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, certExpiry: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Declarações Pendentes</p>
                    <p className="text-sm text-muted-foreground">
                      Alertar sobre declarações a vencer
                    </p>
                  </div>
                  <Switch
                    checked={notifications.declarations}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, declarations: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Guias FGTS</p>
                    <p className="text-sm text-muted-foreground">
                      Alertar sobre guias FGTS pendentes
                    </p>
                  </div>
                  <Switch
                    checked={notifications.fgts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, fgts: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Dados do Escritório</CardTitle>
              <CardDescription>
                Informações do seu escritório de contabilidade.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Razão Social</Label>
                  <Input id="companyName" placeholder="Nome do escritório" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyCnpj">CNPJ</Label>
                  <Input id="companyCnpj" placeholder="00.000.000/0001-00" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crc">CRC</Label>
                  <Input id="crc" placeholder="Registro no CRC" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Telefone</Label>
                  <Input id="companyPhone" placeholder="(00) 0000-0000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Endereço</Label>
                <Input id="companyAddress" placeholder="Endereço completo" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <div className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Certificado Digital A1</CardTitle>
                <CardDescription>
                  Configure o certificado para acesso ao e-CAC e emissão de consultas automatizadas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Nenhum certificado configurado</p>
                      <p className="text-sm text-muted-foreground">
                        Faça upload do seu certificado A1 para habilitar consultas automáticas
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">API InfoSimples</CardTitle>
                <CardDescription>
                  Token de integração para consultas de certidões.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-status-success/10 border border-status-success/30">
                  <div className="flex items-center gap-3">
                    <Database className="w-8 h-8 text-status-success" />
                    <div>
                      <p className="font-medium text-status-success">Integração Ativa</p>
                      <p className="text-sm text-muted-foreground">
                        Token configurado e funcionando
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Atualizar Token</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">WhatsApp Business</CardTitle>
                <CardDescription>
                  Integração para envio automático de alertas e documentos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <Bell className="w-8 h-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Não configurado</p>
                      <p className="text-sm text-muted-foreground">
                        Conecte sua conta WhatsApp Business para envio automático
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Conectar</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsContent;
