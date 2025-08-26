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

// Tipos e funções auxiliares
type Solucao = {
  _id: string;
  title: string;
  createdAt: string;
};

type ApiResponse = {
  solutions: Solucao[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
};

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');
const truncateText = (text: string, maxLength: number) => text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [recentSolutions, setRecentSolutions] = useState<Solucao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:8080';
    const token = localStorage.getItem('jwt');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      setError("Token de autenticação não encontrado. Redirecionando...");
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const fetchAllSolutions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const enterpriseStr = localStorage.getItem("enterprise");
        const userStr = localStorage.getItem("user");
        const userData = userStr ? JSON.parse(userStr) : null;
        const enterpriseData = enterpriseStr ? JSON.parse(enterpriseStr) : null;
        const enterpriseId = userData?.enterpriseId || enterpriseData?._id;

        if (!enterpriseId) {
          throw new Error("ID da empresa não pôde ser determinado.");
        }
        
        const authId = userData?._id || enterpriseData?._id;
        const url = `/api/solutions/auth/${authId}/enterprises/${enterpriseId}`;

        // 1. Faz a primeira requisição para descobrir o total de páginas
        const firstPageResponse = await axios.get<ApiResponse>(url, { params: { page: 1 } });
        const totalPages = firstPageResponse.data.pagination.totalPages;
        let allSolutions = [...firstPageResponse.data.solutions];

        // 2. Se houver mais de uma página, busca as restantes
        if (totalPages > 1) {
          const pageRequests = [];
          for (let page = 2; page <= totalPages; page++) {
            pageRequests.push(axios.get<ApiResponse>(url, { params: { page } }));
          }

          // 3. Executa todas as requisições em paralelo
          const remainingPagesResponses = await Promise.all(pageRequests);
          
          // 4. Consolida os resultados de todas as páginas
          remainingPagesResponses.forEach(response => {
            allSolutions.push(...response.data.solutions);
          });
        }

        // 5. Ordena e seleciona os 7 mais recentes
        const sortedSolutions = allSolutions.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const top7Solutions = sortedSolutions.slice(0, 7);
        setRecentSolutions(top7Solutions);

      } catch (err: any) {
        console.error("Erro ao buscar todas as soluções:", err);
        const errorMessage = err.response?.data?.message || err.message || "Não foi possível carregar as soluções.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllSolutions();
  }, [navigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} onCloseSidebar={closeSidebar} />
      <ContadorToken/>
      <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
        <Header 
          onToggleSidebar={toggleSidebar} 
          showWelcome={true} 
          
        />
        <main className="p-4 md:p-6 flex-1 overflow-x-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Card: Visão Geral */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow col-span-1 lg:col-span-2">
              <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 md:mb-4">Visão Geral</h2>
              <p className="text-gray-600 mb-4 md:mb-6">Resumo das principais atividades e métricas.</p>
              <div className="bg-blue-50 p-3 md:p-4 rounded-lg shadow-sm h-80 md:h-96 mb-3 md:mb-4">
                <h3 className="text-md md:text-lg text-blue-600 font-medium">Acessos Mensais</h3>
                <div className="h-64 md:h-80 mt-3 md:mt-4">
                  <Line 
                    data={{ 
                      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], 
                      datasets: [{ 
                        label: 'Acessos em 2024', 
                        data: [65, 59, 80, 81, 56, 55, 40, 72, 88, 94, 100, 120], 
                        borderColor: 'rgb(59, 130, 246)', 
                        backgroundColor: 'rgba(59, 130, 246, 0.5)', 
                        tension: 0.3, 
                        fill: true 
                      }] 
                    }} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false, 
                      plugins: { 
                        legend: { 
                          position: 'top',
                          labels: {
                            font: {
                              size: window.innerWidth < 768 ? 10 : 12
                            }
                          }
                        }, 
                        tooltip: { 
                          mode: 'index', 
                          intersect: false 
                        } 
                      }, 
                      scales: { 
                        y: { 
                          beginAtZero: true 
                        } 
                      } 
                    }} 
                  />
                </div>
              </div>
            </div>

            {/* Card: Soluções Recentes */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow">
              <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 md:mb-4">Soluções Recentes</h2>
              {isLoading ? (
                <p className="text-gray-500">Carregando...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <>
                  {recentSolutions.length > 0 ? (
                    <ul className="space-y-2 md:space-y-3">
                      {recentSolutions.map((solucao) => (
                        <li key={solucao._id} className="text-sm md:text-base text-gray-700 border-b border-gray-200 pb-2">
                          {truncateText(solucao.title, window.innerWidth < 768 ? 25 : 30)} -{' '}
                          <span className="text-blue-500 font-medium">{formatDate(solucao.createdAt)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Nenhuma solução encontrada.</p>
                  )}
                  <button 
                    onClick={() => navigate('/solucoes')} 
                    className="w-full mt-4 md:mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm md:text-base"
                  >
                    Todas as Soluções
                  </button>
                </>
              )}
            </div>

            {/* Outros Cards */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow">
              <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 md:mb-4">Feedbacks</h2>
              <div className="bg-blue-100 p-3 md:p-4 rounded-lg shadow-sm">
                <p className="text-gray-600 text-sm md:text-base">"O sistema é muito fácil de usar."</p>
                <p className="text-xs md:text-sm text-blue-500">- Usuário 1</p>
              </div>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-lg shadow">
              <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 md:mb-4">Soluções Favoritas</h2>
              <div className="bg-blue-100 p-3 md:p-4 rounded-lg shadow-sm">
                <p className="text-gray-600 text-sm md:text-base">"Gostei das melhorias no painel de controle!"</p>
                <p className="text-xs md:text-sm text-blue-500">- Usuário 2</p>
              </div>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-lg shadow">
              <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 md:mb-4">Comentários Recentes</h2>
              <div className="bg-blue-100 p-3 md:p-4 rounded-lg shadow-sm">
                <p className="text-gray-600 text-sm md:text-base">"Precisa de algumas melhorias, mas é ótimo!"</p>
                <p className="text-xs md:text-sm text-blue-500">- Usuário 3</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;