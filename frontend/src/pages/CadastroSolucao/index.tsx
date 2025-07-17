import { useState, useRef, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import ContadorToken from "../../function/contadorToken";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

interface Categoria {
  _id: string;
  name: string;
  enterpriseId: string;
  createdAt: string;
  updatedAt: string;
}

const CriacaoSolucao = () => {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [linkv, setLinkv] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSidebarOpen] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [errorCategorias, setErrorCategorias] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Configuração do Axios
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

  // Carrega categorias do banco de dados
  const fetchCategorias = async () => {
    try {
      setLoadingCategorias(true);
      setErrorCategorias("");

      if (!enterpriseId) {
        throw new Error("Empresa não identificada");
      }

      const response = await api.get(`/solutions/categories/enterprises/${enterpriseId}`);
      
      if (response.data && Array.isArray(response.data.categories)) {
        setCategorias(response.data.categories);
      } else {
        throw new Error("Formato de dados inválido da API");
      }
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setLoadingCategorias(false);
    }
  };

  // Tratamento de erros da API
  const handleApiError = (error: any) => {
    console.error("Erro na API:", error);
    
    if (error.response) {
      if (error.response.status === 401) {
        setErrorCategorias("Sessão expirada, redirecionando...");
        localStorage.removeItem('jwt');
        localStorage.removeItem('enterprise');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrorCategorias(error.response.data?.message || "Erro ao carregar categorias");
      }
    } else if (error.request) {
      setErrorCategorias("Sem resposta do servidor");
    } else {
      setErrorCategorias(error.message || "Erro desconhecido");
    }
  };

  // Carrega categorias ao montar o componente
  useEffect(() => {
    if (enterpriseId) {
      fetchCategorias();
    } else {
      setErrorCategorias("Empresa não identificada - redirecionando para login...");
      const timer = setTimeout(() => navigate("/login"), 2000);
      return () => clearTimeout(timer);
    }
  }, [enterpriseId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  const handleSubmit = async () => {
    if (!titulo || !descricao || !categoria) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulação de sucesso no cadastro
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage("Solução cadastrada com sucesso!");
      setTitulo("");
      setDescricao("");
      setCategoria("");
      setLinkv("");
      setUploadedFiles([]);
      
      // Redireciona após 2 segundos
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error("Erro:", error);
      alert("Ocorreu um erro ao tentar cadastrar a solução.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <ContadorToken />
      
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl mx-auto p-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-600">
            Criar Nova Solução
          </h2>
          
          {successMessage && (
            <p className="text-green-500 text-center mb-6 p-3 bg-green-50 rounded-lg">
              {successMessage}
            </p>
          )}

          {errorCategorias && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {errorCategorias}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Título*</label>
                <input
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
                  placeholder="Digite o título da solução"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Categoria*</label>
                {loadingCategorias ? (
                  <div className="border border-gray-300 p-3 rounded-lg w-full bg-gray-100 animate-pulse">
                    Carregando categorias...
                  </div>
                ) : (
                  <select
                    className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-500 bg-white transition"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    disabled={categorias.length === 0}
                  >
                    <option value="" disabled>Selecione uma categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
                {categorias.length === 0 && !loadingCategorias && (
                  <p className="text-sm text-red-500 mt-1">Nenhuma categoria disponível</p>
                )}
              </div>
            </div>

            {/* Restante do código permanece igual */}
            {/* Coluna 2 */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Link do Vídeo</label>
                <input
                  type="url"
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
                  placeholder="https://exemplo.com/video"
                  value={linkv}
                  onChange={(e) => setLinkv(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Arquivos</label>
                <div 
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition cursor-pointer hover:bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center text-gray-500">
                    <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p>Clique para adicionar arquivos</p>
                    <p className="text-xs mt-1">Arraste e solte arquivos aqui ou clique para selecionar</p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lista de arquivos */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-gray-700 mb-2 font-medium">Arquivos selecionados:</h3>
              <ul className="border rounded-lg divide-y divide-gray-200">
                {uploadedFiles.map((file, index) => (
                  <li key={index} className="p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Descrição - Ocupa largura total */}
          <div className="mt-6">
            <label className="block text-gray-700 mb-2 font-medium">Descrição*</label>
            <textarea
              className="border border-gray-300 p-3 rounded-lg w-full h-32 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
              placeholder="Descreva detalhadamente a solução..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={() => navigate('/solucoes')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancelar
            </button>
            
            <button
              className={`px-6 py-3 rounded-lg transition font-medium ${
                titulo && descricao && categoria
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
              onClick={handleSubmit}
              disabled={!titulo || !descricao || !categoria || loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </span>
              ) : "Salvar Solução"}
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4">* Campos obrigatórios</p>
        </div>
      </div>
    </div>
  );
};

export default CriacaoSolucao;