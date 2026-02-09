import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { FileText, Download, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface CND {
  id: string;
  company_id: string;
  tipo: string;
  orgao: string;
  numero_certidao: string;
  data_emissao: string;
  data_validade: string;
  situacao: string;
  arquivo_url: string;
  arquivo_nome: string;
  status: string;
  alertado: boolean;
  companies: {
    razao_social: string;
    cnpj: string;
  };
}

export default function CNDsPage() {
  const [cnds, setCnds] = useState<CND[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCND, setSelectedCND] = useState<CND | null>(null);

  useEffect(() => {
    fetchCNDs();
    
    // Subscription para atualizações em tempo real
    const subscription = supabase
      .channel('cnd_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cnd_certidoes' }, () => {
        fetchCNDs();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchCNDs() {
    try {
      setLoading(true);
      let query = supabase
        .from('cnd_certidoes')
        .select(`
          *,
          companies:company_id (razao_social, cnpj)
        `)
        .order('created_at', { ascending: false });

      if (filterTipo !== 'todos') {
        query = query.eq('tipo', filterTipo);
      }

      if (filterStatus !== 'todos') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filtrar por termo de busca no cliente
      let filteredData = data || [];
      if (searchTerm) {
        filteredData = filteredData.filter(cnd => 
          cnd.companies?.razao_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cnd.companies?.cnpj?.includes(searchTerm)
        );
      }

      setCnds(filteredData);
    } catch (error) {
      console.error('Erro ao buscar CNDs:', error);
      toast.error('Erro ao carregar CNDs');
    } finally {
      setLoading(false);
    }
  }

  async function triggerManualConsult(tipo: string) {
    try {
      toast.info(`Iniciando consulta manual de CND ${tipo}...`);
      
      // Chamar webhook do N8N para consulta manual
      const response = await fetch(`${import.meta.env.VITE_N8N_WEBHOOK_URL}/iaudit-consulta-manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: tipo, manual: true })
      });

      if (!response.ok) throw new Error('Falha na consulta');

      toast.success(`Consulta de CND ${tipo} iniciada! Os resultados aparecerão em breve.`);
    } catch (error) {
      toast.error('Erro ao iniciar consulta manual');
    }
  }

  function getStatusBadge(status: string) {
    const styles = {
      valida: 'bg-green-100 text-green-800',
      vencida: 'bg-red-100 text-red-800',
      vencendo: 'bg-yellow-100 text-yellow-800'
    };
    return <Badge className={styles[status] || 'bg-gray-100'}>{status?.toUpperCase()}</Badge>;
  }

  function getTipoIcon(tipo: string) {
    const icons = {
      federal: <CheckCircle className="w-4 h-4 text-blue-500" />,
      estadual: <CheckCircle className="w-4 h-4 text-green-500" />,
      fgts: <CheckCircle className="w-4 h-4 text-orange-500" />,
      municipal: <CheckCircle className="w-4 h-4 text-purple-500" />
    };
    return icons[tipo] || <FileText className="w-4 h-4" />;
  }

  function isVencendo(dataValidade: string) {
    const hoje = new Date();
    const validade = new Date(dataValidade);
    const diffDias = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diffDias <= 15 && diffDias > 0;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Certidões Negativas de Débito (CNDs)</h1>
          <p className="text-muted-foreground">Gerenciamento automático de certidões fiscais</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => triggerManualConsult('federal')} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Consultar Federal
          </Button>
          <Button onClick={() => triggerManualConsult('fgts')} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Consultar FGTS
          </Button>
          <Button onClick={() => triggerManualConsult('estadual')}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Consultar Estadual
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de CNDs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cnds.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Válidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {cnds.filter(c => c.status === 'valida').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vencendo (15 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {cnds.filter(c => isVencendo(c.data_validade)).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {cnds.filter(c => c.status === 'vencida').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Buscar por empresa ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="federal">Federal</SelectItem>
                <SelectItem value="estadual">Estadual</SelectItem>
                <SelectItem value="fgts">FGTS</SelectItem>
                <SelectItem value="municipal">Municipal</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="valida">Válida</SelectItem>
                <SelectItem value="vencendo">Vencendo</SelectItem>
                <SelectItem value="vencida">Vencida</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchCNDs} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de CNDs */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Emissão</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : cnds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhuma CND encontrada
                  </TableCell>
                </TableRow>
              ) : (
                cnds.map((cnd) => (
                  <TableRow key={cnd.id}>
                    <TableCell>
                      <div className="font-medium">{cnd.companies?.razao_social}</div>
                      <div className="text-sm text-muted-foreground">{cnd.companies?.cnpj}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTipoIcon(cnd.tipo)}
                        <span className="capitalize">{cnd.tipo}</span>
                      </div>
                    </TableCell>
                    <TableCell>{cnd.numero_certidao || '-'}</TableCell>
                    <TableCell>
                      {new Date(cnd.data_emissao).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {new Date(cnd.data_validade).toLocaleDateString('pt-BR')}
                        {isVencendo(cnd.data_validade) && (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(cnd.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {cnd.arquivo_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(cnd.arquivo_url, '_blank')}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedCND(cnd)}>
                              Ver
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes da CND</DialogTitle>
                            </DialogHeader>
                            {selectedCND && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Empresa</label>
                                    <p>{selectedCND.companies?.razao_social}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">CNPJ</label>
                                    <p>{selectedCND.companies?.cnpj}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Tipo</label>
                                    <p className="capitalize">{selectedCND.tipo}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Órgão</label>
                                    <p>{selectedCND.orgao}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Número</label>
                                    <p>{selectedCND.numero_certidao}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Situação</label>
                                    <p className="capitalize">{selectedCND.situacao}</p>
                                  </div>
                                </div>
                                {selectedCND.arquivo_url && (
                                  <div className="border rounded-lg p-4">
                                    <h4 className="font-medium mb-2">Visualização do PDF</h4>
                                    <iframe
                                      src={selectedCND.arquivo_url}
                                      className="w-full h-96"
                                      title="PDF Preview"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}