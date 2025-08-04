import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Play, FileText, Globe, Star, Search, ThumbsUp, MessageCircle } from "lucide-react";
import Modal from "../../components/Modal/ModalConsultaSolucao";
import ContadorToken from "../../function/contadorToken";

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
};

export default function ConsultarSolucao() {
  const { id: solutionId } = useParams();
  const [solucao, setSolucao] = useState<Solucao | null>(null);
  const [mockPlaylist, setMockPlaylist] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [isSidebarOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentUser] = useState<User>({
    id: 'user-1',
    name: 'Eduardo',
    profile: 'Desenvolvedor'
  });

  // Configuração do axios para incluir o token JWT
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Buscar os dados da solução específica
  useEffect(() => {
    const fetchSolution = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Obter IDs do usuário/empresa logado
        const user = localStorage.getItem('user');
        const enterprise = localStorage.getItem('enterprise');
        
        let authId = '';
        let enterpriseId = '';
        
        if (enterprise) {
          const enterpriseData = JSON.parse(enterprise);
          authId = enterpriseData.id;
          enterpriseId = enterpriseData.id;
        } else if (user) {
          const userData = JSON.parse(user);
          authId = userData._id;
          enterpriseId = userData.enterpriseId;
        }

        if (!solutionId || !authId || !enterpriseId) {
          throw new Error('Dados de autenticação incompletos');
        }

        // Fazer a requisição para a API
        const response = await axios.get(
          `http://localhost:8080/api/solutions/${solutionId}/auth/${authId}/enterprises/${enterpriseId}`
        );

        const solutionData = response.data.solution;
        setSolucao(solutionData);

        // Criar a playlist de mídias com base nos dados da solução
        const newPlaylist: Media[] = [];
        
        // Adicionar vídeo se existir
        if (solutionData.videoURL) {
          newPlaylist.push({
            id: 1,
            type: "video",
            title: "Solução em Vídeo",
            src: solutionData.videoURL,
            favorite: false
          });
        }

        // Adicionar arquivos PDF
        solutionData.files.forEach((file: File, index: number) => {
          if (file.extention === 'pdf' || file.extention === 'PDF') {
            newPlaylist.push({
              id: index + 2,
              type: "pdf",
              title: file.name,
              src: file.url,
              favorite: false
            });
          }
        });

        // Adicionar link padrão (opcional)
        newPlaylist.push({
          id: newPlaylist.length + 1,
          type: "link",
          title: "Documentação Relacionada",
          src: "https://example.com/docs",
          favorite: false
        });

        setMockPlaylist(newPlaylist);
        if (newPlaylist.length > 0) {
          setSelectedMedia(newPlaylist[0]);
        }

      } catch (err) {
        console.error('Erro ao buscar solução:', err);
        setError('Erro ao carregar a solução. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    if (solutionId) {
      fetchSolution();
    }
  }, [solutionId]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: generateId(),
        user: currentUser,
        text: newComment,
        likes: 0,
        replies: [],
        showReplyBox: false,
        createdAt: new Date()
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
    }
  };

  const handleAddReply = (commentId: string) => {
    const replyText = replyTexts[commentId];
    if (replyText && replyText.trim()) {
      const newReply: Reply = {
        id: generateId(),
        user: currentUser,
        text: replyText,
        likes: 0,
        createdAt: new Date()
      };

      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
            showReplyBox: false
          };
        }
        return comment;
      }));

      setReplyTexts(prev => ({ ...prev, [commentId]: "" }));
    }
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      return comment;
    }));
  };

  const handleLikeReply = (commentId: string, replyId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === replyId) {
              return { ...reply, likes: reply.likes + 1 };
            }
            return reply;
          })
        };
      }
      return comment;
    }));
  };

  const toggleReplyBox = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, showReplyBox: !comment.showReplyBox };
      }
      return comment;
    }));
  };

  const handleReplyTextChange = (commentId: string, text: string) => {
    setReplyTexts(prev => ({ ...prev, [commentId]: text }));
  };

  const filteredPlaylist = mockPlaylist.filter((media) =>
    media.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <ContadorToken />
        <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando solução...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <ContadorToken />
        <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Erro ao carregar</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!solucao) {
    return (
      <div className="flex h-screen">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <ContadorToken />
        <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">Nenhuma solução encontrada</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <ContadorToken />
      <div className="flex flex-col flex-1 p-4 bg-gray-100 dark:bg-gray-900 mr-64">
        <header
          className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 cursor-pointer hover:underline"
          onClick={() => setIsModalOpen(true)}
        >
          {`Solução: ${solucao.title}`}
        </header>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Solução: ${solucao.title}`}
        >
          <div>
            <p className="mb-2"><strong>Categoria:</strong> {solucao.category}</p>
            <p className="mb-2"><strong>Descrição:</strong></p>
            <p>{solucao.description}</p>
            <p className="mt-4 text-sm text-gray-500">
              Criado em: {new Date(solucao.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Modal>

        <div className="flex-1 p-4 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-md">
          {selectedMedia?.type === "video" ? (
            <iframe
              className="w-full h-full rounded-lg"
              src={selectedMedia.src}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Player de vídeo"
            ></iframe>
          ) : selectedMedia?.type === "pdf" ? (
            <object className="w-full h-full" data={selectedMedia.src} type="application/pdf">
              <p>Seu navegador não suporta PDFs. <a href={selectedMedia.src}>Baixar PDF</a></p>
            </object>
          ) : (
            <a 
              href={selectedMedia?.src} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 underline"
            >
              Acessar {selectedMedia?.title}
            </a>
          )}
        </div>

        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold">Comentários</h2>
          <textarea 
            className="w-full p-2 mt-2 rounded-lg border border-gray-300 dark:border-gray-700" 
            placeholder="Deixe seu comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button 
            onClick={handleAddComment} 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Enviar
          </button>
          
          <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {comment.user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.user.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">• {comment.user.profile}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1">{comment.text}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => handleLikeComment(comment.id)} 
                        className="text-gray-500 hover:text-blue-500 flex items-center gap-1 text-sm"
                      >
                        <ThumbsUp size={14} /> {comment.likes}
                      </button>
                      <button 
                        onClick={() => toggleReplyBox(comment.id)} 
                        className="text-gray-500 hover:text-blue-500 flex items-center gap-1 text-sm"
                      >
                        <MessageCircle size={14} /> Responder
                      </button>
                    </div>
                    
                    {comment.showReplyBox && (
                      <div className="mt-2 ml-4">
                        <textarea
                          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm"
                          placeholder="Escreva sua resposta..."
                          value={replyTexts[comment.id] || ""}
                          onChange={(e) => handleReplyTextChange(comment.id, e.target.value)}
                        ></textarea>
                        <div className="flex gap-2 mt-1">
                          <button 
                            onClick={() => handleAddReply(comment.id)} 
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                          >
                            Enviar
                          </button>
                          <button 
                            onClick={() => toggleReplyBox(comment.id)} 
                            className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded-lg text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {comment.replies.length > 0 && (
                      <div className="mt-2 ml-4 space-y-2">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="p-2 bg-gray-300 dark:bg-gray-600 rounded-lg">
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold">
                                {reply.user.name.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{reply.user.name}</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">• {reply.user.profile}</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                                    {new Date(reply.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm">{reply.text}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <button 
                                    onClick={() => handleLikeReply(comment.id, reply.id)} 
                                    className="text-gray-500 hover:text-blue-500 flex items-center gap-1 text-xs"
                                  >
                                    <ThumbsUp size={12} /> {reply.likes}
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
        </div>
      </div>

      <aside className="w-64 p-4 bg-white dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700 fixed right-0 h-full overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Mídias da Solução</h2>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Buscar mídia..."
            className="w-full pl-8 p-2 rounded-lg border border-gray-300 dark:border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          {filteredPlaylist.map((media) => (
            <div
              key={media.id}
              onClick={() => setSelectedMedia(media)}
              className={`flex items-center gap-2 p-2 cursor-pointer rounded-lg ${
                selectedMedia?.id === media.id ? "bg-blue-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {media.type === "video" ? <Play size={18} /> : media.type === "pdf" ? <FileText size={18} /> : <Globe size={18} />}
              <span>{media.title}</span>
              <button onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(media.id);
              }} className="ml-auto">
                <Star size={18} className={favorites.includes(media.id) ? "text-yellow-500" : "text-gray-400"} />
              </button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}