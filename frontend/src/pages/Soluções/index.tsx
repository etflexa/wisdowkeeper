import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import ContadorToken from "../../function/contadorToken";
import Header from "../../components/Header";

// Tipos
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

// Configuração global do axios
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
  const [isEnterprise, setIsEnterprise] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter] = useState<FilterType>('all');
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [usersList, setUsersList] = useState<any[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [enterpriseId, setEnterpriseId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Obter dados do usuário/empresa logado
  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const enterprise = localStorage.getItem('enterprise');
        const user = localStorage.getItem('user');
        
        if (enterprise) {
          const enterpriseData = JSON.parse(enterprise);
          if (!enterpriseData._id) { navigate('/login'); return; }
          setIsEnterprise(true);
          setCurrentUserId(enterpriseData._id);
          setEnterpriseId(enterpriseData._id);
          try {
            const response = await axios.get(`/api/enterprises/${enterpriseData._id}/users`);
            setUsersList(response.data.users || []);
          } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            setUsersList([]);
          }
        } else if (user) {
          const userData = JSON.parse(user);
          if (!userData._id || !userData.enterpriseId) { navigate('/login'); return; }
          setIsEnterprise(false);
          setCurrentUserId(userData._id);
          setEnterpriseId(userData.enterpriseId);
        } else {
          console.error('Nenhum dado de autenticação encontrado');
          navigate('/login');
        }
      } catch (error) {
        console.error('Erro ao carregar dados de autenticação:', error);
        navigate('/login');
      }
    };
    fetchAuthData();
  }, [navigate]);

  // Função para buscar soluções da API (agora controla a paginação)
  const fetchSolutions = async (page: number) => {
    if (!enterpriseId || !currentUserId) return;

    setIsLoading(true);
    try {
      let url = '';
      let params: any = { page: page, limit: 5 }; // Define um limite de itens por página

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

  // Efeito para buscar as soluções quando os filtros mudam
  useEffect(() => {
    fetchSolutions(1); // Sempre busca a primeira página ao mudar um filtro
  }, [filter, selectedUserId, currentUserId, enterpriseId, isEnterprise]);

  // Funções de ação
  const handleEditarClick = (id: string) => navigate(`/editarsolucao`, { state: { id } });
  const handleVisualizarClick = (id: string) => navigate(`/consultarsolucao/${id}`);
  const toggleStatus = async (solucaoId: string) => {
    try {
      const solucao = solucoes.find(s => s._id === solucaoId);
      if (!solucao) return;
      const newStatus = !solucao.active;
      await axios.patch(`/api/solutions/${solucaoId}/status`, { active: newStatus });
      fetchSolutions(pagination.currentPage); // Recarrega a página atual
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status da solução');
    }
  };

  // Funções de permissão
  const isSolutionOwner = (solucao: Solucao) => solucao.userId === currentUserId;
  const canEditSolution = (solucao: Solucao) => !isEnterprise && isSolutionOwner(solucao);
  const canToggleSolution = (solucao: Solucao) => isEnterprise || isSolutionOwner(solucao);

  // Filtro de busca opera nos dados da página atual retornada pela API
  const filteredSolucoes = solucoes.filter(
    (solucao) =>
      solucao.title.toLowerCase().includes(search.toLowerCase()) ||
      solucao.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = usersList.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <ContadorToken />
      <div className="flex-1 p-6">
        <Header onToggleSidebar={toggleSidebar} showWelcome={true} />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-blue-600">Soluções</h1>
          {!isEnterprise && (
            <button onClick={() => navigate("/CadastrarSolucao")} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
              Cadastrar Solução
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4 mb-4">
          <div className="flex gap-4">
            {isEnterprise && filter === 'user-specific' && (
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar usuário por nome ou email..."
                  value={userSearchTerm}
                  onChange={(e) => { setUserSearchTerm(e.target.value); setShowUserDropdown(true); }}
                  onFocus={() => setShowUserDropdown(true)}
                  onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
                  className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {showUserDropdown && filteredUsers.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredUsers.map(user => (
                      <div
                        key={user._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => { setSelectedUserId(user._id); setUserSearchTerm(`${user.name} (${user.email})`); setShowUserDropdown(false); }}
                      >
                        {user.name} - {user.email}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <input
              type="text"
              placeholder="Buscar por título ou categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {pagination.totalItems > 0 && (
            <div className="text-sm text-gray-500 mb-2">
              Mostrando {filteredSolucoes.length} de {pagination.totalItems} soluções cadastradas
            </div>
          )}
          {selectedUserId && (
            <div className="text-sm text-gray-600">
              Mostrando soluções do usuário: {userSearchTerm}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3">Carregando soluções...</span>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left">Título</th>
                  <th className="p-3 text-left">Categoria</th>
                  <th className="p-3 text-left">Descrição</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredSolucoes.length > 0 ? (
                  filteredSolucoes.map((solucao) => {
                    const canEdit = canEditSolution(solucao);
                    const canToggle = canToggleSolution(solucao);
                    return (
                      <tr key={solucao._id} className="border-b hover:bg-gray-100">
                        <td className="p-3 flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">{solucao.title.charAt(0)}</div>
                          {solucao.title}
                        </td>
                        <td className="p-3">{solucao.category}</td>
                        <td className="p-3"><p className="truncate max-w-xs">{solucao.description}</p></td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${solucao.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {solucao.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          <button onClick={() => handleVisualizarClick(solucao._id)} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition">Visualizar</button>
                          {canEdit && (<button onClick={() => handleEditarClick(solucao._id)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition">Editar</button>)}
                          {canToggle && (<button onClick={() => toggleStatus(solucao._id)} className={`px-3 py-1 rounded-md hover:opacity-80 transition ${solucao.active ? 'bg-red-600 text-white' : 'bg-gray-400 text-gray-800'}`}>{solucao.active ? 'Desativar' : 'Ativar'}</button>)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={5} className="text-center p-4 text-gray-500">Nenhuma solução encontrada</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && !isLoading && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <button
              disabled={pagination.currentPage === 1}
              onClick={() => fetchSolutions(pagination.currentPage - 1)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-gray-700">
              Página {pagination.currentPage} de {pagination.totalPages}
            </span>
            <button
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => fetchSolutions(pagination.currentPage + 1)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Próximo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Solucoes;
