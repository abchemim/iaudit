import { useState, useEffect } from "react";
import { Save, User, Bell, Shield, Key, Building2, Loader2, Upload, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUserProfile, useUpdateUserProfile, ROLE_LABELS } from "@/hooks/useUserProfile";
import { useCompanySettings, useUpdateCompanySettings } from "@/hooks/useCompanySettings";
import { useNotificationSettings, useUpdateNotificationSettings } from "@/hooks/useNotificationSettings";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

const SettingsContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: profile, isLoading } = useCurrentUserProfile();
  const updateProfile = useUpdateUserProfile();

  // Company settings
  const { data: companySettings, isLoading: isLoadingCompany } = useCompanySettings();
  const updateCompanySettings = useUpdateCompanySettings();

  // Notification settings
  const { data: notificationSettings, isLoading: isLoadingNotifications } = useNotificationSettings();
  const updateNotificationSettings = useUpdateNotificationSettings();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: false,
    certExpiry: true,
    declarations: true,
    fgts: true,
    tarefas: true,
    diasAntecedenciaTarefas: 3,
  });

  const [companyData, setCompanyData] = useState({
    companyName: "",
    companyCnpj: "",
    crc: "",
    companyPhone: "",
    companyAddress: "",
  });

  // Integration dialogs
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [newToken, setNewToken] = useState("");
  const [isSavingToken, setIsSavingToken] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (companySettings) {
      setCompanyData({
        companyName: companySettings.company_name || "",
        companyCnpj: companySettings.company_cnpj || "",
        crc: companySettings.crc || "",
        companyPhone: companySettings.company_phone || "",
        companyAddress: companySettings.company_address || "",
      });
    }
  }, [companySettings]);

  useEffect(() => {
    if (notificationSettings) {
      setNotifications({
        email: notificationSettings.email_enabled,
        whatsapp: notificationSettings.whatsapp_enabled,
        certExpiry: notificationSettings.cert_expiry_alert,
        declarations: notificationSettings.declarations_alert,
        fgts: notificationSettings.fgts_alert,
        tarefas: notificationSettings.tarefas_alert ?? true,
        diasAntecedenciaTarefas: notificationSettings.dias_antecedencia_tarefas ?? 3,
      });
    }
  }, [notificationSettings]);
  const handleSaveProfile = () => {
    updateProfile.mutate({
      name: formData.name,
      phone: formData.phone,
    });
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast({
        title: "Erro ao alterar senha",
        description: error.message || "Não foi possível alterar a senha.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSaveNotifications = () => {
    updateNotificationSettings.mutate({
      email_enabled: notifications.email,
      whatsapp_enabled: notifications.whatsapp,
      cert_expiry_alert: notifications.certExpiry,
      declarations_alert: notifications.declarations,
      fgts_alert: notifications.fgts,
      tarefas_alert: notifications.tarefas,
      dias_antecedencia_tarefas: notifications.diasAntecedenciaTarefas,
    });
  };

  const handleSaveCompany = () => {
    updateCompanySettings.mutate({
      company_name: companyData.companyName,
      company_cnpj: companyData.companyCnpj,
      crc: companyData.crc,
      company_phone: companyData.companyPhone,
      company_address: companyData.companyAddress,
    });
  };

  const handleSaveToken = async () => {
    if (!newToken.trim()) {
      toast({
        title: "Erro",
        description: "Informe o token da API.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingToken(true);
    // Simulating save - in production, this would be stored securely
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast({
      title: "Token atualizado",
      description: "O token da API InfoSimples foi atualizado com sucesso.",
    });
    setNewToken("");
    setTokenDialogOpen(false);
    setIsSavingToken(false);
  };

  const handleConfigureCertificate = () => {
    toast({
      title: "Upload de Certificado",
      description: "Funcionalidade de upload de certificado A1 em desenvolvimento. Entre em contato com o suporte.",
    });
    setCertificateDialogOpen(false);
  };

  const handleConnectWhatsapp = () => {
    toast({
      title: "WhatsApp Business",
      description: "Integração com WhatsApp Business em desenvolvimento. Entre em contato com o suporte.",
    });
    setWhatsappDialogOpen(false);
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Configurações</h2>
          <p className="text-sm text-muted-foreground">Gerencie suas preferências e configurações do sistema.</p>
        </div>
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
              <CardDescription>Atualize suas informações pessoais e credenciais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={user?.email || ""} disabled />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Perfil</Label>
                      <Input id="role" value={profile ? ROLE_LABELS[profile.role] : ""} disabled />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                      {updateProfile.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}

              <Separator className="my-6" />

              <div>
                <h4 className="font-medium mb-4">Alterar Senha</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </div>
                  <div />
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    onClick={handleChangePassword}
                    disabled={isChangingPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Alterando...
                      </>
                    ) : (
                      "Alterar Senha"
                    )}
                  </Button>
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
              <CardDescription>Configure como e quando deseja receber alertas do sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Canais de Notificação</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">Receba alertas por email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">Receba alertas por WhatsApp</p>
                  </div>
                  <Switch
                    checked={notifications.whatsapp}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, whatsapp: checked })}
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
                    onCheckedChange={(checked) => setNotifications({ ...notifications, certExpiry: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Declarações Pendentes</p>
                    <p className="text-sm text-muted-foreground">Alertar sobre declarações a vencer</p>
                  </div>
                  <Switch
                    checked={notifications.declarations}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, declarations: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Guias FGTS</p>
                    <p className="text-sm text-muted-foreground">Alertar sobre guias FGTS pendentes</p>
                  </div>
                  <Switch
                    checked={notifications.fgts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, fgts: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Tarefas</p>
                    <p className="text-sm text-muted-foreground">Alertar sobre tarefas próximas do vencimento</p>
                  </div>
                  <Switch
                    checked={notifications.tarefas}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, tarefas: checked })}
                  />
                </div>
                {notifications.tarefas && (
                  <div className="flex items-center justify-between pl-4 border-l-2 border-primary/20">
                    <div>
                      <p className="font-medium">Dias de Antecedência</p>
                      <p className="text-sm text-muted-foreground">Quantos dias antes do vencimento alertar</p>
                    </div>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      value={notifications.diasAntecedenciaTarefas}
                      onChange={(e) => setNotifications({ ...notifications, diasAntecedenciaTarefas: parseInt(e.target.value) || 3 })}
                      className="w-20"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveNotifications} disabled={updateNotificationSettings.isPending}>
                  {updateNotificationSettings.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Dados do Escritório</CardTitle>
              <CardDescription>Informações do seu escritório de contabilidade.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Razão Social</Label>
                  <Input
                    id="companyName"
                    placeholder="Nome do escritório"
                    value={companyData.companyName}
                    onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyCnpj">CNPJ</Label>
                  <Input
                    id="companyCnpj"
                    placeholder="00.000.000/0001-00"
                    value={companyData.companyCnpj}
                    onChange={(e) => setCompanyData({ ...companyData, companyCnpj: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crc">CRC</Label>
                  <Input
                    id="crc"
                    placeholder="Registro no CRC"
                    value={companyData.crc}
                    onChange={(e) => setCompanyData({ ...companyData, crc: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Telefone</Label>
                  <Input
                    id="companyPhone"
                    placeholder="(00) 0000-0000"
                    value={companyData.companyPhone}
                    onChange={(e) => setCompanyData({ ...companyData, companyPhone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Endereço</Label>
                <Input
                  id="companyAddress"
                  placeholder="Endereço completo"
                  value={companyData.companyAddress}
                  onChange={(e) => setCompanyData({ ...companyData, companyAddress: e.target.value })}
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveCompany} disabled={updateCompanySettings.isPending}>
                  {updateCompanySettings.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
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
                  <Button variant="outline" onClick={() => setCertificateDialogOpen(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">API InfoSimples</CardTitle>
                <CardDescription>Token de integração para consultas de certidões.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-status-success/10 border border-status-success/30">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-status-success" />
                    <div>
                      <p className="font-medium text-status-success">Integração Ativa</p>
                      <p className="text-sm text-muted-foreground">Token configurado e funcionando</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setTokenDialogOpen(true)}>
                    <Key className="w-4 h-4 mr-2" />
                    Atualizar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">WhatsApp Business</CardTitle>
                <CardDescription>Integração para envio automático de alertas e documentos.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-8 h-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Não configurado</p>
                      <p className="text-sm text-muted-foreground">
                        Conecte sua conta WhatsApp Business para envio automático
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setWhatsappDialogOpen(true)}>
                    Conectar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Certificate Dialog */}
      <Dialog open={certificateDialogOpen} onOpenChange={setCertificateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar Certificado A1</DialogTitle>
            <DialogDescription>Faça upload do seu certificado digital A1 (.pfx) e informe a senha.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Arquivo do Certificado (.pfx)</Label>
              <Input type="file" accept=".pfx,.p12" />
            </div>
            <div className="space-y-2">
              <Label>Senha do Certificado</Label>
              <Input type="password" placeholder="Digite a senha do certificado" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCertificateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfigureCertificate}>
              <Upload className="w-4 h-4 mr-2" />
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Token Dialog */}
      <Dialog open={tokenDialogOpen} onOpenChange={setTokenDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Token InfoSimples</DialogTitle>
            <DialogDescription>Informe o novo token de acesso à API InfoSimples.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Token da API</Label>
              <Input
                type="password"
                placeholder="Cole seu token aqui"
                value={newToken}
                onChange={(e) => setNewToken(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              O token pode ser obtido no painel da InfoSimples em configurações de API.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTokenDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveToken} disabled={isSavingToken}>
              {isSavingToken ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Dialog */}
      <Dialog open={whatsappDialogOpen} onOpenChange={setWhatsappDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conectar WhatsApp Business</DialogTitle>
            <DialogDescription>Configure a integração com WhatsApp Business para envio de alertas.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Número do WhatsApp</Label>
              <Input placeholder="+55 (00) 00000-0000" />
            </div>
            <div className="space-y-2">
              <Label>Token de Acesso (Meta Business)</Label>
              <Input type="password" placeholder="Cole o token do Meta Business" />
            </div>
            <p className="text-xs text-muted-foreground">
              Você precisa de uma conta Meta Business configurada para usar esta integração.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWhatsappDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConnectWhatsapp}>Conectar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsContent;
