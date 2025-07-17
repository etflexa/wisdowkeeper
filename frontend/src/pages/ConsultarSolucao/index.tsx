import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { Play, FileText, Globe, Star, Search, ThumbsUp, MessageCircle } from "lucide-react";
import Modal from "../../components/Modal/ModalConsultaSolucao";
import ContadorToken from "../../function/contadorToken";
import axios from 'axios';
import { useLocation } from "react-router-dom";

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

type Solucao = {
  _id: string
  titulo: String,
  descricao: String,
  categoria: String,
  linkp: String,
  linkv: String
};

export default function ConsultarSolucao() {
  const [solucao, setSolucao] = useState<Solucao | null>(null);
  const location = useLocation();
  const id = location.state?.id;
  const [mockPlaylist, setMockPlaylist] = useState<Media[]>([
    { id: 1, type: "video", title: "Solução em Vídeo", src: "", favorite: false },
    { id: 2, type: "pdf", title: "Documentação PDF", src: "", favorite: false },
    { id: 3, type: "link", title: "StackOverflow", src: "https://stackoverflow.com/questions/29658375/what-is-meaning-of-error-404-not-found", favorite: false },
  ]);
  
  const [selectedMedia, setSelectedMedia] = useState<Media>(mockPlaylist[0]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [isSidebarOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [currentUser] = useState<User>({
  id: 'user-1',
  name: 'Eduardo',
  profile: 'Desenvolvedor'
  });

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

  useEffect(() => {
    const fetchSolucao = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const response = await axios.post<Solucao>('http://localhost:3000/api/solucao', 
          { id },  // Enviando o ID no corpo da requisição
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        setSolucao(response.data);
        
        // Atualiza a playlist com os links da solução
        const updatedPlaylist = mockPlaylist.map(media => {
          if (media.type === "video") {
            return { ...media, src: String(response.data.linkv) };
          } else if (media.type === "pdf") {
            return { ...media, src: String(response.data.linkp) };
          }
          return media;
        });
        
        setMockPlaylist(updatedPlaylist);
        setSelectedMedia(updatedPlaylist[0]);
        
      } catch (err) {
        console.error("Erro ao buscar solução:", err);
        alert("Erro ao carregar a solução. Por favor, tente novamente.");
      }
    };
    
    if (id) {
      fetchSolucao();
    }
  }, [id]);

  return (
  <div className="flex h-screen">
    <Sidebar isSidebarOpen={isSidebarOpen} />
    <ContadorToken />
    <div className="flex flex-col flex-1 p-4 bg-gray-100 dark:bg-gray-900 mr-64">
      <header
        className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 cursor-pointer hover:underline"
        onClick={() => setIsModalOpen(true)}
      >
        {solucao ? `Solução: ${solucao.titulo}` : "Carregando solução..."}
      </header>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={solucao ? `Solução: ${solucao.titulo}` : "Carregando solução..."}
      >
        <p>
          {solucao ? solucao.descricao : "Carregando descrição..."}
        </p>
      </Modal>

      <div className="flex-1 p-4 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-md">
        {selectedMedia.type === "video" ? (
          <iframe
            className="w-full h-full rounded-lg"
            src={selectedMedia.src}
            frameBorder="0"
            allowFullScreen
            title="Player de vídeo"
          ></iframe>
        ) : selectedMedia.type === "pdf" ? (
          <object className="w-full h-full" data={selectedMedia.src} type="application/pdf">
            <p>Seu navegador não suporta PDFs. <a href={selectedMedia.src}>Baixar PDF</a></p>
          </object>
        ) : (
          <a href={selectedMedia.src} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            Acessar {selectedMedia.title}
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
        <button onClick={handleAddComment} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">Enviar</button>
        
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
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
                        >
                          Enviar
                        </button>
                        <button 
                          onClick={() => toggleReplyBox(comment.id)} 
                          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded-lg text-sm"
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
              selectedMedia.id === media.id ? "bg-blue-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"
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