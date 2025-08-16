import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import ContadorToken from "../../function/contadorToken";

type SolucaoData = {
  title: string;
  category: string;
  description: string;
  videoURL: string;
};

axios.defaults.baseURL = 'http://localhost:8080';
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt' );
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const EditSolution = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const solutionId = location.state?.id;

  // Estado para os dados editáveis do formulário
  const [solucao, setSolucao] = useState<SolucaoData>({
    title: "",
    category: "",
    description: "",
    videoURL: "",
  });

  // PASSO 1: Estado para guardar a versão original dos dados
  const [originalSolucao, setOriginalSolucao] = useState<SolucaoData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen] = useState(true);

  useEffect(() => {
    if (!solutionId) {
      setError("ID da solução não fornecido.");
      setIsLoading(false);
      setTimeout(() => navigate("/solucoes"), 3000);
      return;
    }

    const fetchSolutionData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) throw new Error('Usuário não autenticado.');
        const userData = JSON.parse(userStr);
        const authId = userData._id;
        const enterpriseId = userData.enterpriseId;
        if (!authId || !enterpriseId) throw new Error('Dados de autenticação inválidos.');
        
        const apiUrl = `/api/solutions/${solutionId}/auth/${authId}/enterprises/${enterpriseId}`;
        const response = await axios.get<{ solution: SolucaoData }>(apiUrl);
        const data = response.data.solution;
        
        const fetchedData = {
          title: data.title || "",
          category: data.category || "",
          description: data.description || "",
          videoURL: data.videoURL || "",
        };

        // Popula ambos os estados com os dados da API
        setSolucao(fetchedData);
        setOriginalSolucao(fetchedData);

      } catch (err) {
        console.error("Erro ao buscar dados da solução:", err);
        setError("Não foi possível carregar os dados para edição.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSolutionData();
  }, [solutionId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert("Usuário não autenticado.");
      setIsSubmitting(false);
      return;
    }
    
    const userData = JSON.parse(userStr);
    const userId = userData._id;
    const enterpriseId = userData.enterpriseId;

    if (!userId || !enterpriseId || !solutionId) {
        alert("Dados essenciais estão faltando.");
        setIsSubmitting(false);
        return;
    }

    // PASSO 2: Comparar e construir o payload dinâmico
    const modifiedFields: Partial<SolucaoData> = {};
    // Itera sobre as chaves do objeto de solução para encontrar as diferenças
    (Object.keys(solucao) as Array<keyof SolucaoData>).forEach(key => {
      if (solucao[key] !== originalSolucao?.[key]) {
        modifiedFields[key] = solucao[key];
      }
    });

    // Se nenhum campo foi modificado, não faz a requisição
    if (Object.keys(modifiedFields).length === 0) {
      alert("Nenhuma alteração foi feita.");
      setIsSubmitting(false);
      return;
    }

    // O payload final contém os IDs obrigatórios e apenas os campos modificados
    const payload = {
      enterpriseId,
      solutionId,
      ...modifiedFields,
    };

    console.log("DEBUG: Apenas os campos modificados serão enviados:", payload);

    const url = `/api/solutions/users/${userId}`;

    try {
      await axios.patch(url, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      alert("Solução atualizada com sucesso!");
      navigate("/solucoes");

    } catch (err) {
      console.error("ERRO NA REQUISIÇÃO:", err);
      let errorMessage = "Ocorreu um erro ao salvar as alterações.";
      if (axios.isAxiosError(err) && err.response) {
        errorMessage += ` (Erro ${err.response.status})`;
      }
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSolucao(prev => ({ ...prev, [name]: value }));
  };

  // Renderização do componente (JSX sem alterações)
  if (isLoading) { /* ... */ }
  if (error) { /* ... */ }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <ContadorToken />
      <div className="flex-1 p-6 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-semibold text-blue-600 mb-8">Editar Solução</h1>
          <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
            {/* O formulário JSX permanece o mesmo */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">Título</label>
              <input id="title" name="title" type="text" value={solucao.title} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="mb-6">
              <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">Categoria</label>
              <input id="category" name="category" type="text" value={solucao.category} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Descrição</label>
              <textarea id="description" name="description" value={solucao.description} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="mb-8">
              <label htmlFor="videoURL" className="block text-gray-700 font-semibold mb-2">URL do Vídeo (Opcional)</label>
              <input id="videoURL" name="videoURL" type="url" value={solucao.videoURL} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex justify-end gap-4">
                <button type="button" onClick={() => navigate("/solucoes")} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition" disabled={isSubmitting}>
                    Cancelar
                </button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSolution;
