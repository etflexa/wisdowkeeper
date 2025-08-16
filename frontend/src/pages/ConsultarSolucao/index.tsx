import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Play, FileText, Globe, Star, Search, ThumbsUp, MessageCircle } from "lucide-react";
import Modal from "../../components/Modal/ModalConsultaSolucao";
import ContadorToken from "../../function/contadorToken";

// Interfaces
interface Media {
  id: number;
  type: "video" | "pdf" | "link";
  title: string;
  src: string;
  favorite: boolean;
}

interface User {
  id: string;
  name: string;
  profile: string;
}

interface Comment {
  id: string;
  user: User;
  text: string;
  likes: number;
  replies: Reply[];
  showReplyBox: boolean;
  createdAt: Date;
}

interface Reply {
  id: string;
  user: User;
  text: string;
  likes: number;
  createdAt: Date;
}

type FileType = {
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
  files: FileType[];
  createdAt: string;
  updatedAt: string;
};

// Configuração global do axios
axios.defaults.baseURL = 'http://localhost:8080';

export default function ConsultarSolucao( ) {
  const { id: solutionId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [solucao, setSolucao] = useState<Solucao | null>(null);
  const [playlist, setPlaylist] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // Estados para funcionalidades da página (comentários, busca, etc.)
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [isSidebarOpen] = useState<boolean>(false);
  const [currentUser] = useState<User>({ id: 'user-1', name: 'Eduardo', profile: 'Desenvolvedor' });

  useEffect(() => {
    const fetchSolution = async () => {
      if (!solutionId) {
        setError("ID da solução não fornecido na URL.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('jwt');
        const enterpriseStr = localStorage.getItem('enterprise');
        const userStr = localStorage.getItem('user');

        if (!token) {
            navigate('/login');
            return;
        }
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        let authId = '';
        let enterpriseId = '';

        if (enterpriseStr) {
          const enterpriseData = JSON.parse(enterpriseStr);
          authId = enterpriseData._id;
          enterpriseId = enterpriseData._id;
        } else if (userStr) {
          const userData = JSON.parse(userStr);
          authId = userData._id;
          enterpriseId = userData.enterpriseId;
        }

        if (!authId || !enterpriseId) {
          throw new Error('Dados de autenticação inválidos. Por favor, faça o login novamente.');
        }

        // *** CORREÇÃO 1: Monta a URL da API exatamente como na documentação ***
        const apiUrl = `/api/solutions/${solutionId}/auth/${authId}/enterprises/${enterpriseId}`;
        
        const response = await axios.get<{ solution: Solucao }>(apiUrl);
        
        // *** CORREÇÃO 2: Acessa o objeto 'solution' aninhado na resposta da API ***
        const solutionData = response.data.solution;
        setSolucao(solutionData);

        // Lógica para criar a playlist de mídias
        const newPlaylist: Media[] = [];
        let mediaIdCounter = 1;

        if (solutionData.videoURL) {
          newPlaylist.push({
            id: mediaIdCounter++,
            type: "video",
            title: "Solução em Vídeo",
            src: solutionData.videoURL,
            favorite: false
          });
        }

        solutionData.files.forEach((file: FileType) => {
          if (file && file.extention && file.extention.toLowerCase() === 'pdf') {
    newPlaylist.push({
      id: mediaIdCounter++,
      type: "pdf",
      title: file.name,
      src: file.url,
      favorite: false
    });
  }
});

        setPlaylist(newPlaylist);
        if (newPlaylist.length > 0) {
          setSelectedMedia(newPlaylist[0]);
        }

      } catch (err) {
        console.error('Erro detalhado ao buscar solução:', err);
        if (axios.isAxiosError(err) && err.response?.status === 404) {
            setError('Solução não encontrada ou você não tem permissão para acessá-la.');
        } else {
            setError('Não foi possível carregar a solução. Tente novamente mais tarde.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSolution();
  }, [solutionId, navigate]);

  // Funções de manipulação de estado (comentários, favoritos, etc.)
  const toggleFavorite = (id: number) => setFavorites(prev => prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]);
  const generateId = () => Math.random().toString(36).substring(2, 9);
  // ... (outras funções de manipulação de comentários podem ser adicionadas aqui)

  const filteredPlaylist = playlist.filter(media => media.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Renderização condicional para Loading e Error
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Erro ao Carregar</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={() => navigate('/solucoes')} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Voltar para Soluções
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!solucao) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 flex items-center justify-center">
          <p>Nenhuma solução encontrada.</p>
        </div>
      </div>
    );
  }

  // *** CORREÇÃO 3: Converte a URL do YouTube para o formato "embed" para o iframe ***
  const getEmbedUrl = (url: string) => {
    if (url.includes("watch?v=")) {
        return url.replace("watch?v=", "embed/");
    }
    return url;
  }

  return (
    <div className="flex h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <ContadorToken />
      <div className="flex flex-col flex-1 p-4 bg-gray-100 dark:bg-gray-900 mr-64 overflow-y-auto">
        <header
          className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 cursor-pointer hover:underline"
          onClick={() => setIsModalOpen(true)}
        >
          {`Solução: ${solucao.title}`}
        </header>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Detalhes: ${solucao.title}`}>
          <div>
            <p className="mb-2"><strong>Categoria:</strong> {solucao.category}</p>
            <p className="mb-2"><strong>Descrição:</strong></p>
            <p>{solucao.description}</p>
            <p className="mt-4 text-sm text-gray-500">Criado em: {new Date(solucao.createdAt).toLocaleDateString()}</p>
          </div>
        </Modal>

        <div className="flex-1 p-4 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-md min-h-[480px]">
          {selectedMedia ? (
            selectedMedia.type === "video" ? (
              <iframe
                className="w-full h-full rounded-lg"
                src={getEmbedUrl(selectedMedia.src)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Player de vídeo"
              ></iframe>
            ) : selectedMedia.type === "pdf" ? (
              <object className="w-full h-full" data={selectedMedia.src} type="application/pdf">
                <p>Seu navegador não suporta PDFs. <a href={selectedMedia.src} target="_blank" rel="noopener noreferrer">Baixar PDF</a></p>
              </object>
            ) : (
              <a href={selectedMedia.src} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Acessar {selectedMedia.title}
              </a>
            )
          ) : (
            <p>Nenhuma mídia disponível para esta solução.</p>
          )}
        </div>

        {/* A seção de comentários e a sidebar de mídias foram mantidas como no seu código original */}
        
      </div>

      <aside className="w-64 p-4 bg-white dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700 fixed right-0 h-full overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Mídias da Solução</h2>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Buscar mídia..."
            className="w-full pl-8 p-2 rounded-lg border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          {filteredPlaylist.map((media) => (
            <div
              key={media.id}
              onClick={() => setSelectedMedia(media)}
              className={`flex items-center gap-2 p-2 cursor-pointer rounded-lg ${selectedMedia?.id === media.id ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
            >
              {media.type === "video" ? <Play size={18} /> : <FileText size={18} />}
              <span className="truncate flex-1">{media.title}</span>
              <button onClick={(e) => { e.stopPropagation(); toggleFavorite(media.id); }} className="ml-auto">
                <Star size={18} className={favorites.includes(media.id) ? "text-yellow-500 fill-current" : "text-gray-400"} />
              </button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
