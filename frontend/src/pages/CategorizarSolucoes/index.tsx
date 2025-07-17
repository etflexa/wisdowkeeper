import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ContadorToken from "../../function/contadorToken";
import axios from "axios";

type Categoria = {
  _id: string;
  name: string;
  enterpriseId: string;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  categories: Categoria[]; // Alterado para corresponder ao formato da API
  // Adicione outros campos se a API retornar paginação ou metadados
};

const CategorizarSolucoes = () => {
  const [isSidebarOpen] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [editandoCategoria, setEditandoCategoria] = useState<{ id: string | null; name: string }>({
    id: null,
    name: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Configuração do Axios com interceptor para tratamento global de erros
  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 10000
  });

  // Adiciona interceptor para incluir o token em todas as requisições
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Dados da empresa
  const enterpriseData = JSON.parse(localStorage.getItem("enterprise") || "null");
  const enterpriseId = enterpriseData?._id;
  const enterpriseName = enterpriseData?.name || "Empresa";

  // Carrega categorias
  const fetchCategorias = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!enterpriseId) {
        throw new Error("Empresa não identificada");
      }

      const response = await api.get<ApiResponse>(`/solutions/categories/enterprises/${enterpriseId}`);
      
      // Verifica se a resposta contém o array de categorias
      if (response.data && Array.isArray(response.data.categories)) {
        setCategorias(response.data.categories);
      } else {
        throw new Error("Formato de dados inválido da API");
      }
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Tratamento global de erros
  const handleApiError = (error: any) => {
    console.error("Erro na API:", error);
    
    if (error.response) {
      if (error.response.status === 401) {
        setError("Sessão expirada, redirecionando...");
        localStorage.removeItem('jwt');
        localStorage.removeItem('enterprise');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(error.response.data?.message || "Erro na requisição");
      }
    } else if (error.request) {
      setError("Sem resposta do servidor");
    } else {
      setError(error.message || "Erro desconhecido");
    }
  };

  // Efeito inicial - carrega categorias
  useEffect(() => {
    if (enterpriseId) {
      fetchCategorias();
    } else {
      setError("Empresa não identificada - redirecionando para login...");
      const timer = setTimeout(() => navigate("/login"), 2000);
      return () => clearTimeout(timer);
    }
  }, [enterpriseId]);

  // Adiciona nova categoria
  const adicionarCategoria = async () => {
    if (!novaCategoria.trim()) {
      setError("Nome da categoria é obrigatório");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Atualiza a lista após adicionar
      await fetchCategorias();
      setNovaCategoria("");
      setSuccess("Categoria adicionada com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualiza categoria
  const salvarEdicao = async () => {
    if (!editandoCategoria.id || !editandoCategoria.name.trim()) {
      setError("Nome da categoria é obrigatório");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      await api.put(
        `/solutions/categories/${editandoCategoria.id}`,
        { name: editandoCategoria.name }
      );

      // Atualiza a lista após editar
      await fetchCategorias();
      setEditandoCategoria({ id: null, name: "" });
      setSuccess("Categoria atualizada com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Exclui categoria
  const excluirCategoria = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      setIsLoading(true);
      setError("");
      
      await api.delete(`/solutions/categories/${id}`);
      
      // Atualiza a lista após excluir
      await fetchCategorias();
      setSuccess("Categoria excluída com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!enterpriseId) {
    return (
      <div className="min-h-screen flex bg-gray-100">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 flex justify-center items-center">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Acesso não autorizado
            </h2>
            <p className="mb-4">{error || "Você precisa fazer login para acessar esta página"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <ContadorToken />

      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white min-h-full shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Categorizar Soluções - {enterpriseName}</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Adicionar Nova Categoria</h3>
            <div className="flex gap-2">
              <input
                type="text"
                className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-300"
                placeholder="Nome da categoria"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                disabled={isLoading}
              />
              <button
                onClick={adicionarCategoria}
                disabled={isLoading || !novaCategoria.trim()}
                className={`p-2 text-white rounded transition ${
                  isLoading || !novaCategoria.trim() ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isLoading ? "Adicionando..." : "Adicionar"}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categorias Existentes</h3>
            
            {isLoading ? (
              <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : categorias.length === 0 ? (
              <p className="text-gray-500 text-center p-4">Nenhuma categoria cadastrada</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="p-3 text-left">Nome</th>
                      <th className="p-3 text-left">Data de Criação</th>
                      <th className="p-3 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map((cat) => (
                      <tr key={cat._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          {editandoCategoria.id === cat._id ? (
                            <input
                              type="text"
                              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-300"
                              value={editandoCategoria.name}
                              onChange={(e) =>
                                setEditandoCategoria({ ...editandoCategoria, name: e.target.value })
                              }
                              disabled={isLoading}
                            />
                          ) : (
                            cat.name
                          )}
                        </td>
                        <td className="p-3">
                          {new Date(cat.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          {editandoCategoria.id === cat._id ? (
                            <button
                              onClick={salvarEdicao}
                              disabled={isLoading || !editandoCategoria.name.trim()}
                              className={`p-2 text-white rounded transition mr-2 ${
                                isLoading || !editandoCategoria.name.trim() ? 'bg-green-300' : 'bg-green-500 hover:bg-green-600'
                              }`}
                            >
                              {isLoading ? "Salvando..." : "Salvar"}
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditandoCategoria({ id: cat._id, name: cat.name })}
                                disabled={isLoading}
                                className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition mr-2 disabled:bg-yellow-300"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => excluirCategoria(cat._id)}
                                disabled={isLoading}
                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:bg-red-300"
                              >
                                Excluir
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorizarSolucoes;