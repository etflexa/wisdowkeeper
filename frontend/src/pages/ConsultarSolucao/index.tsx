import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Play, FileText, Star, Search, Image as ImageIcon, MessageCircle, ThumbsUp, Send, User } from "lucide-react";
import Modal from "../../components/Modal/ModalConsultaSolucao";
import ContadorToken from "../../function/contadorToken";
import Header from "../../components/Header";

// Interfaces
interface Media {
  id: number;
  type: "video" | "pdf" | "image" | "link";
  title: string;
  src: string;
  favorite: boolean;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  likes: number;
  createdAt: string;
  isLiked?: boolean;
  replies?: Comment[];
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

axios.defaults.baseURL = 'http://localhost:8080';

export default function ConsultarSolucao() {
  const { id: solutionId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [solucao, setSolucao] = useState<Solucao | null>(null);
  const [playlist, setPlaylist] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isCommentsLoading, setIsCommentsLoading] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 1024);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(!isMobileView);

  // Detectar mudanças no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobileView(mobile);
      setShowPlaylist(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        if (!token) { navigate('/login'); return; }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const enterpriseStr = localStorage.getItem('enterprise');
        const userStr = localStorage.getItem('user');
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
        if (!authId || !enterpriseId) throw new Error('Dados de autenticação inválidos.');

        const apiUrl = `/api/solutions/${solutionId}/auth/${authId}/enterprises/${enterpriseId}`;
        const response = await axios.get<{ solution: Solucao }>(apiUrl);
        const solutionData = response.data.solution;
        setSolucao(solutionData);

        // Lógica da playlist corrigida para incluir vídeos upados
        const newPlaylist: Media[] = [];
        let mediaIdCounter = 1;

        // 1. Adiciona o vídeo do YouTube, se existir
        if (solutionData.videoURL) {
          newPlaylist.push({
            id: mediaIdCounter++,
            type: "video",
            title: "Vídeo (YouTube)",
            src: solutionData.videoURL,
            favorite: false
          });
        }

        // 2. Itera sobre os arquivos e adiciona à playlist conforme a extensão
        solutionData.files?.forEach((file: FileType) => {
          if (!file || !file.extention) return;
          const ext = file.extention.toLowerCase();
          
          if (['mp4', 'webm', 'mov', 'ogg'].includes(ext)) {
            newPlaylist.push({ id: mediaIdCounter++, type: "video", title: file.name, src: file.url, favorite: false });
          } 
          else if (ext === 'pdf') {
            newPlaylist.push({ id: mediaIdCounter++, type: "pdf", title: file.name, src: file.url, favorite: false });
          } 
          else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
            newPlaylist.push({ id: mediaIdCounter++, type: "image", title: file.name, src: file.url, favorite: false });
          }
        });

        setPlaylist(newPlaylist);
        if (newPlaylist.length > 0) {
          setSelectedMedia(newPlaylist[0]);
        }

        // Carregar comentários
        await fetchComments(solutionId);

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

  // Função para carregar comentários
  const fetchComments = async (_solutionId: string) => {
    setIsCommentsLoading(true);
    try {
      // Simulação de dados de comentários (substitua pela sua API real)
      const mockComments: Comment[] = [
        {
          id: "1",
          userId: "user1",
          userName: "João Silva",
          text: "Excelente solução! Me ajudou muito com o problema que estava enfrentando.",
          likes: 5,
          createdAt: "2023-10-15T14:30:00Z",
          isLiked: false,
          replies: [
            {
              id: "1-1",
              userId: "user2",
              userName: "Maria Santos",
              text: "Também achei muito útil, principalmente a parte sobre configuração.",
              likes: 2,
              createdAt: "2023-10-15T16:45:00Z",
              isLiked: true
            }
          ]
        },
        {
          id: "2",
          userId: "user3",
          userName: "Pedro Almeida",
          text: "Gostaria de mais detalhes sobre a implementação na etapa 3.",
          likes: 1,
          createdAt: "2023-10-16T09:15:00Z",
          isLiked: false
        }
      ];
      
      setComments(mockComments);
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    } finally {
      setIsCommentsLoading(false);
    }
  };

  // Função para adicionar um novo comentário
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      // Simulação de envio de comentário (substitua pela sua API real)
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        userId: userData._id || "currentUser",
        userName: userData.name || "Usuário",
        text: newComment,
        likes: 0,
        createdAt: new Date().toISOString(),
        isLiked: false
      };
      
      setComments([newCommentObj, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  };

  // Função para curtir um comentário
  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        };
      }
      return comment;
    }));
  };

  // Função para diferenciar URLs do YouTube de links diretos
  const isYoutubeUrl = (url: string) => url.includes("youtube.com") || url.includes("youtu.be");

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    return url;
  };

  const toggleFavorite = (id: number) => setFavorites(prev => prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const togglePlaylist = () => setShowPlaylist(!showPlaylist);

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-gray-100">
        <Sidebar isSidebarOpen={isSidebarOpen} onCloseSidebar={closeSidebar} />
        <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
          <Header onToggleSidebar={toggleSidebar} showWelcome={false}  />
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3">Carregando solução...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex bg-gray-100">
        <Sidebar isSidebarOpen={isSidebarOpen} onCloseSidebar={closeSidebar} />
        <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
          <Header onToggleSidebar={toggleSidebar} showWelcome={false}  />
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Erro ao Carregar</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button onClick={() => navigate('/solucoes')} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Voltar para Soluções
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!solucao) {
    return (
      <div className="min-h-screen flex bg-gray-100">
        <Sidebar isSidebarOpen={isSidebarOpen} onCloseSidebar={closeSidebar} />
        <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
          <Header onToggleSidebar={toggleSidebar} showWelcome={false} />
          <div className="flex-1 flex items-center justify-center p-4">
            <p>Nenhuma solução encontrada.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} onCloseSidebar={closeSidebar} />
      <ContadorToken />
      
      <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
        <Header onToggleSidebar={toggleSidebar} showWelcome={false}  />
        
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {/* Cabeçalho e informações da solução */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
            <h1 
              className="text-xl md:text-2xl font-bold text-blue-600 mb-2 cursor-pointer hover:underline"
              onClick={() => setIsModalOpen(true)}
            >
              {solucao.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4 ">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {solucao.category}
              </span>
              <span>
                Criado em: {new Date(solucao.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            
            <p className="text-gray-700">{solucao.description}</p>
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Detalhes: ${solucao.title}`}>
            <div>
              <p className="mb-2"><strong>Categoria:</strong> {solucao.category}</p>
              <p className="mb-2"><strong>Descrição:</strong></p>
              <p>{solucao.description}</p>
              <p className="mt-4 text-sm text-gray-500">Criado em: {new Date(solucao.createdAt).toLocaleDateString()}</p>
            </div>
          </Modal>

          {/* Container principal com mídia e playlist */}
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            {/* Área de mídia principal */}
            <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="aspect-video bg-black flex items-center justify-center">
                {selectedMedia ? (
                  <>
                    {selectedMedia.type === "video" && (
                      isYoutubeUrl(selectedMedia.src) ? (
                        <iframe
                          className="w-full h-full"
                          src={getEmbedUrl(selectedMedia.src)}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Player de vídeo do YouTube"
                        ></iframe>
                      ) : (
                        <video
                          controls
                          className="w-full h-full"
                          src={selectedMedia.src}
                          title={selectedMedia.title}
                        >
                          Seu navegador não suporta a tag de vídeo.
                        </video>
                      )
                    )}
                    {selectedMedia.type === "pdf" && (
                      <object className="w-full h-full min-h-[400px]" data={selectedMedia.src} type="application/pdf">
                        <div className="flex flex-col items-center justify-center h-full p-4">
                          <FileText size={48} className="text-gray-400 mb-4" />
                          <p className="text-gray-600 mb-4">Seu navegador não suporta visualização de PDF.</p>
                          <a href={selectedMedia.src} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            Baixar PDF
                          </a>
                        </div>
                      </object>
                    )}
                    {selectedMedia.type === "image" && (
                      <div className="flex items-center justify-center h-full">
                        <img src={selectedMedia.src} alt={selectedMedia.title} className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
                    <ImageIcon size={48} className="mb-4" />
                    <p>Nenhuma mídia disponível para esta solução.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Playlist lateral - visível em desktop ou quando aberta em mobile */}
            {(showPlaylist || !isMobileView) && (
              <div className="w-full lg:w-80 bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg">Mídias da Solução</h2>
                  {isMobileView && (
                    <button 
                      onClick={togglePlaylist}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
                
                <div className="relative mb-4">
                  <Search className="absolute left-2 top-2.5 text-gray-500" size={16} />
                  <input
                    type="text"
                    placeholder="Buscar mídia..."
                    className="w-full pl-8 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {playlist.filter(media => media.title.toLowerCase().includes(searchQuery.toLowerCase())).map((media) => (
                    <div
                      key={media.id}
                      onClick={() => setSelectedMedia(media)}
                      className={`flex items-center gap-2 p-2 cursor-pointer rounded-lg ${selectedMedia?.id === media.id ? "bg-blue-100 border border-blue-300" : "hover:bg-gray-100 border border-transparent"}`}
                    >
                      {media.type === "video" && <Play size={16} className="text-blue-500" />}
                      {media.type === "pdf" && <FileText size={16} className="text-red-500" />}
                      {media.type === "image" && <ImageIcon size={16} className="text-green-500" />}
                      
                      <span className="truncate flex-1 text-sm">{media.title}</span>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(media.id); }} 
                        className="ml-auto"
                      >
                        <Star 
                          size={16} 
                          className={favorites.includes(media.id) ? "text-yellow-500 fill-current" : "text-gray-400"} 
                        />
                      </button>
                    </div>
                  ))}
                  
                  {playlist.length === 0 && (
                    <p className="text-center text-gray-500 py-4">Nenhuma mídia encontrada</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Botão para mostrar playlist em mobile */}
          {isMobileView && !showPlaylist && (
            <button 
              onClick={togglePlaylist}
              className="w-full mb-6 bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center hover:bg-blue-600"
            >
              <Play size={18} className="mr-2" />
              Mostrar Lista de Mídias
            </button>
          )}

          {/* Área de Comentários estilo YouTube */}
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="text-blue-500" size={24} />
              <h2 className="text-xl font-semibold">Comentários</h2>
              <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-sm">
                {comments.length}
              </span>
            </div>

            {/* Formulário para novo comentário */}
            <div className="flex gap-3 mb-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-blue-500" />
                </div>
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Adicione um comentário público..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Send size={16} className="mr-2" />
                    Comentar
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de comentários */}
            {isCommentsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={20} className="text-blue-500" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{comment.userName}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-gray-800 mb-2">{comment.text}</p>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleLikeComment(comment.id)}
                            className={`flex items-center gap-1 ${comment.isLiked ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-700`}
                          >
                            <ThumbsUp size={16} />
                            <span>{comment.likes}</span>
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 text-sm">
                            Responder
                          </button>
                        </div>

                        {/* Respostas */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 pl-6 border-l border-gray-200">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="mb-4 last:mb-0">
                                <div className="flex gap-3">
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <User size={16} className="text-blue-500" />
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-sm">{reply.userName}</span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(reply.createdAt).toLocaleDateString('pt-BR')}
                                      </span>
                                    </div>
                                    <p className="text-gray-800 text-sm mb-2">{reply.text}</p>
                                    <div className="flex items-center gap-4">
                                      <button 
                                        onClick={() => handleLikeComment(reply.id)}
                                        className={`flex items-center gap-1 ${reply.isLiked ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-700 text-xs`}
                                      >
                                        <ThumbsUp size={14} />
                                        <span>{reply.likes}</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Seja o primeiro a comentar</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}