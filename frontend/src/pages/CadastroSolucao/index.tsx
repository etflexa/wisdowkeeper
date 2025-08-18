import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import ContadorToken from "../../function/contadorToken";
import UploadFiles from "./UploadFiles";

// Configuração global do Axios
axios.defaults.baseURL = "http://localhost:8080";
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tipos
interface Categoria {
  _id: string;
  name: string;
}

const CriacaoSolucao = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  // Estados do formulário (sem os estados de arquivo)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [videoURL, setVideoURL] = useState("");

  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen] = useState(false);

  // Estados para categorias
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  // Estados para IDs de autenticação
  const [userId, setUserId] = useState<string | null>(null);
  const [enterpriseId, setEnterpriseId] = useState<string | null>(null);

  // Efeito para buscar dados de autenticação
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) throw new Error("Usuário não autenticado.");

      const userData = JSON.parse(userStr);
      if (!userData._id || !userData.enterpriseId)
        throw new Error("Dados de autenticação incompletos.");

      setUserId(userData._id);
      setEnterpriseId(userData.enterpriseId);
    } catch (err: any) {
      setError("Sessão inválida. Redirecionando para o login...");
      setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, 2000);
    }
  }, [navigate]);

  // Efeito para carregar as categorias
  useEffect(() => {
    if (!enterpriseId) return;

    const fetchCategorias = async () => {
      setLoadingCategorias(true);
      setError("");
      try {
        const response = await axios.get(
          `/api/solutions/categories/enterprises/${enterpriseId}`
        );
        setCategorias(response.data?.categories || []);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
        setError("Não foi possível carregar as categorias.");
      } finally {
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, [enterpriseId]);

  // Função de submissão simplificada
  const handleSubmit = async () => {
    if (!title || !description || !category) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!userId || !enterpriseId) {
      setError(
        "Não foi possível identificar o usuário ou empresa. Por favor, faça o login novamente."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Payload sem o campo 'files'
      const solutionData = {
        enterpriseId,
        title,
        category,
        description,
        videoURL: videoURL || null,
        files: files || [],
      };

      await axios.post(`/api/solutions/users/${userId}`, solutionData);

      alert("Solução cadastrada com sucesso!");
      navigate("/solucoes");
    } catch (err) {
      console.error("Erro ao cadastrar solução:", err);
      setError(
        "Ocorreu um erro ao salvar a solução. Verifique os dados e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // JSX simplificado, sem a seção de upload
  return (
    <div className='min-h-screen flex bg-gray-100'>
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <ContadorToken />

      <div className='flex-1 p-4 md:p-8 overflow-auto'>
        <div className='bg-white shadow-lg rounded-lg w-full max-w-4xl mx-auto p-6'>
          <h2 className='text-2xl md:text-3xl font-bold mb-6 text-center text-blue-600'>
            Criar Nova Solução
          </h2>

          {error && (
            <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center'>
              {error}
            </div>
          )}

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Coluna da Esquerda */}
            <div className='space-y-4'>
              <div>
                <label className='block text-gray-700 mb-2 font-medium'>
                  Título*
                </label>
                <input
                  className='border border-gray-300 p-3 rounded-lg w-full'
                  placeholder='Digite o título da solução'
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className='block text-gray-700 mb-2 font-medium'>
                  Link do Vídeo
                </label>
                <input
                  type='url'
                  className='border border-gray-300 p-3 rounded-lg w-full'
                  placeholder='https://exemplo.com/video'
                  value={videoURL}
                  onChange={e => setVideoURL(e.target.value)}
                />
              </div>
            </div>

            {/* Coluna da Direita */}
            <div className='space-y-4'>
              <div>
                <label className='block text-gray-700 mb-2 font-medium'>
                  Categoria*
                </label>
                {loadingCategorias ? (
                  <div className='border border-gray-300 p-3 rounded-lg w-full bg-gray-100 animate-pulse'>
                    Carregando categorias...
                  </div>
                ) : (
                  <select
                    className='border border-gray-300 p-3 rounded-lg w-full bg-white'
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    disabled={categorias.length === 0}
                  >
                    <option value='' disabled>
                      Selecione uma categoria
                    </option>
                    {categorias.map(cat => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Campo de Descrição abaixo das colunas */}
          <div className='mt-6'>
            <label className='block text-gray-700 mb-2 font-medium'>
              Descrição*
            </label>
            <textarea
              className='border border-gray-300 p-3 rounded-lg w-full h-32'
              placeholder='Descreva detalhadamente a solução...'
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <UploadFiles authId={userId} files={files} setFiles={setFiles} />

          {/* Botões de Ação */}
          <div className='mt-8 flex justify-end gap-4'>
            <button
              onClick={() => navigate("/solucoes")}
              className='px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium'
            >
              Cancelar
            </button>
            <button
              className={`px-6 py-3 rounded-lg font-medium text-white ${
                title && description && category && !loading
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleSubmit}
              disabled={!title || !description || !category || loading}
            >
              {loading ? "Salvando..." : "Salvar Solução"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriacaoSolucao;
