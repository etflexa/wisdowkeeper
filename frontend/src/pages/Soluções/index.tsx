import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import ContadorToken from "../../function/contadorToken";
import Header from "../../components/Header";
// Ícone de lixeira adicionado
import { FaSearch, FaEye, FaEdit, FaTrash, FaPlus, FaBars, FaFilter } from "react-icons/fa";

// Tipos (sem alterações)
type File = {
  name: string;
  url: string;
  extention: string;
  _id: string;
};

type Solucao = {
  _id: string;
  enterpriseId: string;
  userId: string;
  title: string;
  category: string;
  description: string;
  videoURL: string;
  files: File[];
  createdAt: string;
  updatedAt: string;
  active?: boolean;
};

type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

type ApiResponse = {
  solutions: Solucao[];
  pagination: Pagination;
};

type FilterType = 'all' | 'user-specific';

// Configuração global do axios (sem alterações)
axios.defaults.baseURL = 'http://localhost:8080';
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt' );
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const Solucoes = () => {
  const [solucoes, setSolucoes] = useState<Solucao[]>([]);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<Pagination>({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [isEnterprise, setIsEnterprise] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter] = useState<FilterType>('all');
  const [selectedUserId] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [enterpriseId, setEnterpriseId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  // Detectar mudanças no tamanho da tela (sem alterações)
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Obter dados do usuário/empresa logado (sem alterações)
  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const enterpriseStr = localStorage.getItem('enterprise');
        const userStr = localStorage.getItem('user');
        
        if (enterpriseStr) {
          const enterpriseData = JSON.parse(enterpriseStr);
          if (!enterpriseData._id) { navigate('/login'); return; }
          setIsEnterprise(true);
          setCurrentUserId(enterpriseData._id);
          setEnterpriseId(enterpriseData._id);
        } else if (userStr) {
          const userData = JSON.parse(userStr);
          if (!userData._id || !userData.enterpriseId) { navigate('/login'); return; }
          setIsEnterprise(false);
          setCurrentUserId(userData._id);
          setEnterpriseId(userData.enterpriseId);
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };
    fetchAuthData();
  }, [navigate]);

  // Fetch de soluções (sem alterações)
  useEffect(() => {
    if (!enterpriseId || !currentUserId) return;

    const fetchSolutions = async () => {
      setIsLoading(true);
      try {
        let url = '';
        let params: any = { page: currentPage, limit: 6 }; 

        if (isEnterprise) {
          url = `/api/solutions/auth/${enterpriseId}/enterprises/${enterpriseId}`;
          if (filter === 'user-specific' && selectedUserId) {
            params.userId = selectedUserId;
          }
        } else {
          url = `/api/solutions/auth/${currentUserId}/enterprises/${enterpriseId}`;
        }

        const response = await axios.get<ApiResponse>(url, { params });
        
        setSolucoes(response.data.solutions);
        setPagination(response.data.pagination);

      } catch (error) {
        console.error('Erro ao buscar soluções:', error);
        setSolucoes([]);
        setPagination({ currentPage: 1, totalPages: 1, totalItems: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSolutions();
  }, [currentPage, currentUserId, enterpriseId, filter, selectedUserId, isEnterprise]);

  // Funções de ação
  const handleEditarClick = (id: string) => navigate(`/editarsolucao`, { state: { id } });
  const handleVisualizarClick = (id: string) => navigate(`/consultarsolucao/${id}`);

  // NOVA FUNÇÃO PARA EXCLUIR A SOLUÇÃO
  const handleExcluirClick = async (solucao: Solucao) => {
    // Confirmação para evitar exclusão acidental
    if (!window.confirm(`Tem certeza que deseja excluir a solução "${solucao.title}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      // Monta a URL conforme a documentação da API
      const url = `/api/solutions/${solucao._id}/auth/${currentUserId}/enterprises/${enterpriseId}/users/${solucao.userId}`;
      
      await axios.delete(url);

      // Atualiza a lista de soluções na tela removendo a que foi excluída
      setSolucoes(prevSolucoes => prevSolucoes.filter(s => s._id !== solucao._id));
      
      alert('Solução excluída com sucesso!');

    } catch (error) {
      console.error('Erro ao excluir solução:', error);
      alert('Erro ao excluir a solução. Verifique o console para mais detalhes.');
    }
  };

  // Funções de permissão (sem alterações)
  const isSolutionOwner = (solucao: Solucao) => solucao.userId === currentUserId;
  const canEditSolution = (solucao: Solucao) => !isEnterprise && isSolutionOwner(solucao);

  // Filtro de busca (sem alterações)
  const filteredSolucoes = solucoes.filter(
    (solucao) =>
      solucao.title.toLowerCase().includes(search.toLowerCase()) ||
      solucao.category.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Componente de card para visualização mobile
  const SolutionCard = ({ solucao }: { solucao: Solucao }) => {
    const canEdit = canEditSolution(solucao);
    
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3 flex-shrink-0">
            {solucao.title.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 truncate">{solucao.title}</h3>
            <p className="text-sm text-gray-600">{solucao.category}</p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-2">{solucao.description}</p>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleVisualizarClick(solucao._id)} 
            className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition text-sm"
          >
            <FaEye className="mr-1" /> Visualizar
          </button>
          
          {canEdit && (
            <button 
              onClick={() => handleEditarClick(solucao._id)} 
              className="flex items-center bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition text-sm"
            >
              <FaEdit className="mr-1" /> Editar
            </button>
          )}

          {/* BOTÃO DE EXCLUIR PARA EMPRESAS */}
          {isEnterprise && (
            <button 
              onClick={() => handleExcluirClick(solucao)} 
              className="flex items-center bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition text-sm"
            >
              <FaTrash className="mr-1" /> Excluir
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} onCloseSidebar={closeSidebar} />
      <ContadorToken />
      <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
        <Header 
          onToggleSidebar={toggleSidebar} 
          showWelcome={false} 
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {/* Cabeçalho e busca (sem alterações) */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <h1 className="text-2xl font-semibold text-blue-600 mb-4 md:mb-0">Soluções</h1>
            {!isEnterprise && (
              <button 
                onClick={() => navigate("/CadastrarSolucao")} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center"
              >
                <FaPlus className="mr-2" /> Cadastrar Solução
              </button>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por título ou categoria..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center md:hidden">
                <button className="flex items-center text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                  <FaFilter className="mr-2" /> Filtros
                </button>
              </div>
            </div>
            
            {pagination.totalItems > 0 && (
              <div className="text-sm text-gray-500">
                Mostrando {filteredSolucoes.length} de {pagination.totalItems} soluções cadastradas
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3">Carregando soluções...</span>
            </div>
          ) : (
            <>
              {/* Visualização em tabela para desktop */}
              {!isMobileView ? (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-blue-600 text-white">
                        <tr>
                          <th className="p-3 text-left">Título</th>
                          <th className="p-3 text-left">Categoria</th>
                          <th className="p-3 text-left">Descrição</th>
                          <th className="p-3 text-left">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSolucoes.length > 0 ? (
                          filteredSolucoes.map((solucao) => {
                            const canEdit = canEditSolution(solucao);
                            return (
                              <tr key={solucao._id} className="border-b hover:bg-gray-50">
                                <td className="p-3 flex items-center gap-2">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                    {solucao.title.charAt(0)}
                                  </div>
                                  <span className="font-medium">{solucao.title}</span>
                                </td>
                                <td className="p-3">{solucao.category}</td>
                                <td className="p-3 max-w-md"><p className="truncate">{solucao.description}</p></td>
                                
                                <td className="p-3">
                                  <div className="flex flex-wrap gap-2">
                                    <button 
                                      onClick={() => handleVisualizarClick(solucao._id)} 
                                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition flex items-center text-sm"
                                      title="Visualizar"
                                    >
                                      <FaEye className="mr-1" /> 
                                    </button>
                                    
                                    {canEdit && (
                                      <button 
                                        onClick={() => handleEditarClick(solucao._id)} 
                                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition flex items-center text-sm"
                                        title="Editar"
                                      >
                                        <FaEdit className="mr-1" /> 
                                      </button>
                                    )}

                                    {/* BOTÃO DE EXCLUIR PARA EMPRESAS */}
                                    {isEnterprise && (
                                      <button 
                                        onClick={() => handleExcluirClick(solucao)} 
                                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition flex items-center text-sm"
                                        title="Excluir"
                                      >
                                        <FaTrash className="mr-1" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center p-8 text-gray-500">
                              Nenhuma solução encontrada
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // Visualização em cards para mobile
                <div>
                  {filteredSolucoes.length > 0 ? (
                    filteredSolucoes.map((solucao) => (
                      <SolutionCard key={solucao._id} solucao={solucao} />
                    ))
                  ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <p className="text-gray-500">Nenhuma solução encontrada</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Paginação (sem alterações) */}
          {pagination.totalPages > 1 && !isLoading && (
            <div className="flex justify-center items-center mt-6 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
              >
                <FaBars className="transform rotate-90 mr-1" /> Anterior
              </button>
              <span className="px-4 py-2 text-gray-700 bg-white border rounded-lg">
                Página {currentPage} de {pagination.totalPages}
              </span>
              <button
                disabled={currentPage === pagination.totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
              >
                Próximo <FaBars className="transform -rotate-90 ml-1" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Solucoes;
