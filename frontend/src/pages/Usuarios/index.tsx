import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ContadorToken from "../../function/contadorToken";
import axios from "axios";
import Header from "../../components/Header";
import { FaSearch, FaEdit, FaToggleOn, FaToggleOff, FaPlus, FaUser, FaFilter, FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Tipos
type Usuario = {
  _id: string;
  type: string;
  name: string;
  lastName: string;
  cpf: string;
  email: string;
  enterpriseId: string;
  isActive: boolean;
};

type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

type ApiResponse = {
  users: Usuario[];
  pagination: Pagination;
};

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [pagination, setPagination] = useState<Pagination>({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [enterpriseId, setEnterpriseId] = useState<string | null>(null);
  const [enterpriseName, setEnterpriseName] = useState("Empresa");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 10000,
  });

  api.interceptors.request.use(config => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    const enterpriseData = JSON.parse(localStorage.getItem("enterprise") || "null");
    if (enterpriseData?._id) {
      setEnterpriseId(enterpriseData._id);
      setEnterpriseName(enterpriseData.name || "Empresa");
    } else {
      setError("Empresa não identificada. Redirecionando para o login...");
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [navigate]);

  const fetchUsuarios = async (page = 1) => {
    if (!enterpriseId) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get<ApiResponse>(`/enterprises/${enterpriseId}/users`, {
        params: { page, limit: 10 },
      });
      setUsuarios(response.data.users);
      setPagination(response.data.pagination);
      setCurrentPage(page);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiError = (error: any) => {
    console.error("Erro na requisição:", error);
    if (error.response?.status === 401) {
      setError("Sessão expirada. Faça o login novamente.");
      localStorage.clear();
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError(error.response?.data?.message || "Ocorreu um erro.");
    }
  };

  const toggleStatus = async (userIdToToggle: string, isCurrentlyActive: boolean) => {
    if (!enterpriseId) {
      setError("ID da empresa não encontrado.");
      return;
    }

    const actionText = isCurrentlyActive ? "desativar" : "ativar";
    if (!window.confirm(`Tem certeza que deseja ${actionText} este usuário?`)) {
      return;
    }

    try {
      // Usando o mesmo endpoint PATCH para ativar/desativar
      await api.patch(
        `/enterprises/${enterpriseId}/users`,
        {
          userId: userIdToToggle,
          isActive: !isCurrentlyActive // Inverte o status atual
        }
      );

      alert(`Usuário ${actionText === "desativar" ? "desativado" : "ativado"} com sucesso!`);
      fetchUsuarios(currentPage);

    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    if (enterpriseId) {
      fetchUsuarios(currentPage);
    }
  }, [enterpriseId, currentPage]);

  const handleEditarClick = (userId: string, name: string) => {
    if (window.confirm(`Editar usuário ${name}?`)) {
      navigate(`/editarcadastro`, { state: { userId } });
    }
  };

  const filteredUsuarios = usuarios.filter(user =>
    (search === "" || 
     user.name.toLowerCase().includes(search.toLowerCase()) || 
     user.email.toLowerCase().includes(search.toLowerCase()) ||
     `${user.name} ${user.lastName}`.toLowerCase().includes(search.toLowerCase())) &&
    (filterRole === "" || user.type === filterRole)
  );

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Componente de card para visualização mobile
  const UserCard = ({ user }: { user: Usuario }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3 flex-shrink-0">
            <FaUser />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 truncate">{user.name} {user.lastName}</h3>
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {user.isActive ? 'Ativo' : 'Inativo'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div>
            <span className="text-gray-500">Tipo:</span>
            <p className="font-medium">{user.type}</p>
          </div>
          <div>
            <span className="text-gray-500">CPF:</span>
            <p className="font-medium">{user.cpf}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleEditarClick(user._id, `${user.name} ${user.lastName}`)} 
            className="flex items-center bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition text-sm"
          >
            <FaEdit className="mr-1" /> Editar
          </button>
          <button 
            onClick={() => toggleStatus(user._id, user.isActive)} 
            className={`flex items-center px-3 py-2 rounded-md hover:opacity-90 transition text-sm ${user.isActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
          >
            {user.isActive ? <FaToggleOff className="mr-1" /> : <FaToggleOn className="mr-1" />}
            {user.isActive ? 'Desativar' : 'Ativar'}
          </button>
        </div>
      </div>
    );
  };

  // Gerar array de páginas para exibição
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} onCloseSidebar={closeSidebar} />
      <ContadorToken />
      <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
        <Header 
          onToggleSidebar={toggleSidebar} 
          showWelcome={true} 
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <h1 className="text-2xl font-semibold text-blue-600 mb-4 md:mb-0">Usuários - {enterpriseName}</h1>
            <button 
              onClick={() => navigate("/cadastro")} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center"
            >
              <FaPlus className="mr-2" /> Cadastrar Usuário
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Buscar por nome, e-mail..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <select 
                  value={filterRole} 
                  onChange={(e) => setFilterRole(e.target.value)} 
                  className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos os tipos</option>
                  <option value="Estagiário">Estagiários</option>
                  <option value="Desenvolvedor">Desenvolvedores</option>
                  <option value="Supervisor">Supervisores</option>
                  <option value="Administrador">Administradores</option>
                </select>
                
                <button className="flex items-center justify-center text-gray-600 bg-gray-100 px-3 py-2 rounded-lg md:hidden">
                  <FaFilter className="mr-2" /> Filtros
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">Carregando usuários...</p>
              </div>
            ) : (
              <>
                {/* Visualização em tabela para desktop */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="p-3 text-left">Nome</th>
                        <th className="p-3 text-left">E-mail</th>
                        <th className="p-3 text-left">Tipo</th>
                        <th className="p-3 text-left">CPF</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsuarios.length > 0 ? (
                        filteredUsuarios.map((user) => (
                          <tr key={user._id} className="border-b hover:bg-gray-50">
                            <td className="p-3 flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <FaUser size={14} />
                              </div>
                              <span className="font-medium">{user.name} {user.lastName}</span>
                            </td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">{user.type}</td>
                            <td className="p-3">{user.cpf}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {user.isActive ? 'Ativo' : 'Inativo'}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-2">
                                <button 
                                  onClick={() => handleEditarClick(user._id, `${user.name} ${user.lastName}`)} 
                                  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition flex items-center text-sm"
                                  title="Editar"
                                >
                                  <FaEdit className="mr-1" />
                                </button>
                                <button 
                                  onClick={() => toggleStatus(user._id, user.isActive)} 
                                  className={`px-3 py-1 rounded-md hover:opacity-90 transition flex items-center text-sm ${user.isActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
                                  title={user.isActive ? 'Desativar' : 'Ativar'}
                                >
                                  {user.isActive ? <FaToggleOff className="mr-1" /> : <FaToggleOn className="mr-1" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center p-8 text-gray-500">
                            Nenhum usuário encontrado
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Visualização em cards para mobile */}
                <div className="md:hidden">
                  {filteredUsuarios.length > 0 ? (
                    filteredUsuarios.map((user) => (
                      <UserCard key={user._id} user={user} />
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      Nenhum usuário encontrado
                    </div>
                  )}
                </div>

                {/* Paginação */}
                {pagination.totalPages > 1 && (
                  <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t gap-4 md:gap-0">
                    <span className="text-sm text-gray-600">
                      Mostrando {usuarios.length} de {pagination.totalItems} usuários
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <button 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(currentPage - 1)} 
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition flex items-center"
                      >
                        <FaArrowLeft className="mr-1" /> Anterior
                      </button>
                      
                      <div className="flex gap-1 mx-2">
                        {getPageNumbers().map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        {pagination.totalPages > 5 && currentPage < pagination.totalPages - 2 && (
                          <span className="px-2 py-1">...</span>
                        )}
                      </div>
                      
                      <button 
                        disabled={currentPage === pagination.totalPages} 
                        onClick={() => setCurrentPage(currentPage + 1)} 
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition flex items-center"
                      >
                        Próximo <FaArrowRight className="ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Usuarios;