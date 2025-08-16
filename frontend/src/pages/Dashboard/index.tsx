import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import ContadorToken from "../../function/contadorToken";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Header from "../../components/Header";

// Configuração do ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Tipos e funções auxiliares (sem alterações)
type Solucao = {
  _id: string;
  title: string;
  createdAt: string;
};
type ApiResponse = {
  solutions: Solucao[];
};
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');
const truncateText = (text: string, maxLength: number) => text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [recentSolutions, setRecentSolutions] = useState<Solucao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Efeito para buscar os dados das soluções (lógica de autenticação corrigida)
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:8080';
    const token = localStorage.getItem('jwt' );
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const fetchRecentSolutions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // --- INÍCIO DA CORREÇÃO ---
        // Lógica para lidar com login de EMPRESA e de FUNCIONÁRIO
        const enterpriseStr = localStorage.getItem("enterprise");
        const userStr = localStorage.getItem("user");

        let authId = '';
        let enterpriseId = '';
        let url = '';

        if (enterpriseStr) {
          // Caso 1: Usuário logado é uma EMPRESA
          const enterpriseData = JSON.parse(enterpriseStr);
          if (!enterpriseData._id) throw new Error("ID da empresa não encontrado.");
          
          authId = enterpriseData._id;
          enterpriseId = enterpriseData._id;
          // A empresa vê todas as soluções da própria empresa
          url = `/api/solutions/auth/${authId}/enterprises/${enterpriseId}`;

        } else if (userStr) {
          // Caso 2: Usuário logado é um FUNCIONÁRIO
          const userData = JSON.parse(userStr);
          if (!userData._id || !userData.enterpriseId) throw new Error("Dados de autenticação do usuário incompletos.");

          authId = userData._id;
          enterpriseId = userData.enterpriseId;
          // O funcionário vê as soluções da sua empresa (a API pode filtrar por permissão)
          url = `/api/solutions/auth/${authId}/enterprises/${enterpriseId}`;

        } else {
          throw new Error("Nenhum dado de autenticação encontrado.");
        }
        // --- FIM DA CORREÇÃO ---

        const response = await axios.get<ApiResponse>(url, {
          params: { page: 1, limit: 5 } // Pega 5 soluções mais recentes
        });
        setRecentSolutions(response.data.solutions);

      } catch (err: any) {
        console.error("Erro ao buscar soluções recentes:", err);
        setError(err.message || "Não foi possível carregar as soluções.");
        // Se o erro for de autenticação, pode ser útil redirecionar para o login
        if (err.message.includes("autentica")) {
            setTimeout(() => navigate('/login'), 2000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentSolutions();
  }, [navigate]); // Adicionado navigate às dependências

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // O JSX permanece o mesmo, pois a lógica de renderização já está correta.
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <ContadorToken/>
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={toggleSidebar} showWelcome={true} />
        <div className="p-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card: Visão Geral */}
            <div className="bg-white p-6 rounded-lg shadow-lg col-span-1 lg:col-span-2">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Visão Geral</h2>
              <p className="text-gray-600 mb-6">Resumo das principais atividades e métricas.</p>
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm h-96 mb-4">
                <h3 className="text-lg text-blue-600 font-medium">Acessos Mensais</h3>
                <div className="h-80 mt-4">
                  <Line data={{ labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], datasets: [{ label: 'Acessos em 2024', data: [65, 59, 80, 81, 56, 55, 40, 72, 88, 94, 100, 120], borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.5)', tension: 0.3, fill: true }] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } }, scales: { y: { beginAtZero: true } } }} />
                </div>
              </div>
            </div>

            {/* Card: Soluções Recentes */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Soluções Recentes</h2>
              {isLoading ? (<p className="text-gray-500">Carregando...</p>) : error ? (<p className="text-red-500">{error}</p>) : (
                <>
                  {recentSolutions.length > 0 ? (
                    <ul className="space-y-3">
                      {recentSolutions.map((solucao) => (
                        <li key={solucao._id} className="text-gray-700 border-b border-gray-200 pb-2">
                          {truncateText(solucao.title, 30)} -{' '}
                          <span className="text-blue-500 font-medium">{formatDate(solucao.createdAt)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (<p className="text-gray-500">Nenhuma solução encontrada.</p>)}
                  <button onClick={() => navigate('/solucoes')} className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                    Todas as Soluções
                  </button>
                </>
              )}
            </div>

            {/* Outros Cards */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Feedbacks</h2>
              <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
                <p className="text-gray-600">"O sistema é muito fácil de usar."</p>
                <p className="text-sm text-blue-500">- Usuário 1</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Soluções Favoritas</h2>
              <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
                <p className="text-gray-600">"Gostei das melhorias no painel de controle!"</p>
                <p className="text-sm text-blue-500">- Usuário 2</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Comentários Recentes</h2>
              <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
                <p className="text-gray-600">"Precisa de algumas melhorias, mas é ótimo!"</p>
                <p className="text-sm text-blue-500">- Usuário 3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
