import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ContadorToken from "../../function/contadorToken";
import axios from "axios";
import Header from "../../components/Header";

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
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 10000,
  } );

  api.interceptors.request.use(config => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const [enterpriseId, setEnterpriseId] = useState<string | null>(null);
  const [enterpriseName, setEnterpriseName] = useState("Empresa");

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

  // --- LÓGICA CORRETA E FINAL: Condicional para DELETE ou PATCH ---
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
      if (isCurrentlyActive) {
        // --- AÇÃO DE DESATIVAR (DELETE) ---
        const url = `/enterprises/${enterpriseId}/users`;
        const payload = { userId: userIdToToggle, isDelete: false };
        console.log(`DESATIVANDO: Enviando DELETE para ${url} com corpo`, payload);
        await api.delete(url, { data: payload });
      } else {
        // --- AÇÃO DE ATIVAR (PATCH) ---
        // Rota específica para alterar o status de um usuário
        const url = `/enterprises/${enterpriseId}/users/${userIdToToggle}/status`;
        // Payload para definir o usuário como ativo
        const payload = { isActive: true };
        console.log(`ATIVANDO: Enviando PATCH para ${url} com corpo`, payload);
        await api.patch(url, payload);
      }

      alert(`Usuário ${actionText.slice(0, -1)}ado com sucesso!`);
      fetchUsuarios(pagination.currentPage);

    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    if (enterpriseId) {
      fetchUsuarios();
    }
  }, [enterpriseId]);

  const handleEditarClick = (userId: string, name: string) => {
    if (window.confirm(`Editar usuário ${name}?`)) {
      navigate(`/editarcadastro`, { state: { userId } });
    }
  };

  const filteredUsuarios = usuarios.filter(user =>
    (search === "" || user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())) &&
    (filterRole === "" || user.type === filterRole)
  );

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // O JSX do componente permanece o mesmo
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <ContadorToken />
      <div className="flex-1 p-6">
        <Header onToggleSidebar={toggleSidebar} showWelcome={true} />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-blue-600">Usuários - {enterpriseName}</h1>
          <button onClick={() => navigate("/cadastro")} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            Cadastrar Usuário
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        <div className="flex gap-4 mb-4">
          <input type="text" placeholder="Buscar por nome ou e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-2 border rounded-lg shadow-sm" />
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="p-2 border rounded-lg shadow-sm">
            <option value="">Todos</option>
            <option value="Estagiário">Estagiários</option>
            <option value="Desenvolvedor">Desenvolvedores</option>
            <option value="Supervisor">Supervisores</option>
            <option value="Administrador">Administradores</option>
          </select>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2">Carregando usuários...</p>
            </div>
          ) : (
            <>
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
                      <tr key={user._id} className="border-b hover:bg-gray-100">
                        <td className="p-3 flex items-center gap-2">{user.name} {user.lastName}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">{user.type}</td>
                        <td className="p-3">{user.cpf}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {user.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          <button onClick={() => handleEditarClick(user._id, `${user.name} ${user.lastName}`)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition">
                            Editar
                          </button>
                          <button onClick={() => toggleStatus(user._id, user.isActive)} className={`px-3 py-1 rounded-md hover:opacity-90 transition ${user.isActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                            {user.isActive ? 'Desativar' : 'Ativar'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={6} className="text-center p-4 text-gray-500">Nenhum usuário encontrado</td></tr>
                  )}
                </tbody>
              </table>
              {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center p-4 border-t">
                  <span className="text-sm text-gray-600">Mostrando {usuarios.length} de {pagination.totalItems} usuários</span>
                  <div className="flex gap-1">
                    <button disabled={pagination.currentPage === 1} onClick={() => fetchUsuarios(pagination.currentPage - 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Anterior</button>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">{pagination.currentPage}</span>
                    <button disabled={pagination.currentPage === pagination.totalPages} onClick={() => fetchUsuarios(pagination.currentPage + 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Próximo</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
