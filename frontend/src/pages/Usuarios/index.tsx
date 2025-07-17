import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ContadorToken from "../../function/contadorToken";
import axios from "axios";

type Usuario = {
  _id: string;
  type: string;
  name: string;
  lastName: string;
  cpf: string;
  email: string;
  enterpriseId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  const [isSidebarOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Configuração do Axios
  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json"
    }
  });

  // Dados da empresa
  const enterpriseData = JSON.parse(localStorage.getItem("enterprise") || "null");
  const enterpriseId = enterpriseData?._id;
  const enterpriseName = enterpriseData?.name || "Empresa";

  const fetchUsuarios = async (page = 1) => {
    try {
      setIsLoading(true);
      setError("");

      if (!enterpriseId) {
        throw new Error("Empresa não identificada");
      }

      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const response = await api.get<ApiResponse>(`/enterprises/${enterpriseId}/users`, {
        params: { page, limit: itemsPerPage },
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsuarios(response.data.users);
      setPagination(response.data.pagination);

    } catch (error: any) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiError = (error: any) => {
    console.error("Erro na requisição:", error);
    
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("enterprise");
        navigate("/login");
        return;
      }
      setError(error.response.data?.message || "Erro ao processar requisição");
    } else if (error.request) {
      setError("Sem resposta do servidor. Verifique sua conexão.");
    } else {
      setError(error.message || "Erro desconhecido");
    }
  };

  const toggleStatus = async (userId: string, isCurrentlyActive: boolean) => {
    if (!enterpriseId) return;

    const confirmacao = window.confirm(
      `Tem certeza que deseja ${isCurrentlyActive ? "desativar" : "ativar"} este usuário?`
    );
    if (!confirmacao) return;

    try {
      const token = localStorage.getItem("jwt");
      await api.patch(
        `/enterprises/${enterpriseId}/users/${userId}/status`,
        { isActive: !isCurrentlyActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchUsuarios(pagination.currentPage);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    if (enterpriseId) {
      fetchUsuarios();
    } else {
      setError("Empresa não identificada - redirecionando para login...");
      const timer = setTimeout(() => navigate("/login"), 2000);
      return () => clearTimeout(timer);
    }
  }, [enterpriseId]);

  const handleEditarClick = (userId: string, name: string) => {
    const resposta = window.confirm(`Editar usuário ${name}?`);
    if (resposta) {
      navigate(`/editarcadastro`, { state: { userId } });
    }
  };

  // Filtro local combinado
  const filteredUsuarios = usuarios.filter(user => {
    const matchesSearch = search === "" || 
      user.name.toLowerCase().includes(search.toLowerCase()) || 
      user.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = filterRole === "" || user.type === filterRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <ContadorToken />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-blue-600">
            Usuários - {enterpriseName}
          </h1>
          <button
            onClick={() => navigate("/cadastro")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Cadastrar Usuário
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="p-2 border rounded-lg shadow-sm"
          >
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
                        <td className="p-3 flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            {user.name.charAt(0)}
                          </div>
                          {user.name} {user.lastName}
                        </td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">{user.type}</td>
                        <td className="p-3">{user.cpf}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          <button
                            onClick={() => handleEditarClick(user._id, `${user.name} ${user.lastName}`)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => toggleStatus(user._id, user.isActive)}
                            className={`px-3 py-1 rounded-md hover:opacity-90 transition ${
                              user.isActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                            }`}
                          >
                            {user.isActive ? 'Desativar' : 'Ativar'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center p-4 text-gray-500">
                        {usuarios.length === 0 ? "Nenhum usuário cadastrado" : "Nenhum usuário encontrado"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center p-4 border-t">
                  <span className="text-sm text-gray-600">
                    Mostrando {usuarios.length} de {pagination.totalItems} usuários
                  </span>
                  <div className="flex gap-1">
                    <button
                      disabled={pagination.currentPage === 1}
                      onClick={() => fetchUsuarios(pagination.currentPage - 1)}
                      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                    >
                      Anterior
                    </button>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                      {pagination.currentPage}
                    </span>
                    <button
                      disabled={pagination.currentPage === pagination.totalPages}
                      onClick={() => fetchUsuarios(pagination.currentPage + 1)}
                      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                    >
                      Próximo
                    </button>
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