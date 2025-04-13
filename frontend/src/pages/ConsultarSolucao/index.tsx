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

interface Comment {
  text: string;
  likes: number;
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
  const [isSidebarOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { text: newComment, likes: 0 }]);
      setNewComment("");
    }
  };

  const handleLikeComment = (index: number) => {
    const updatedComments = [...comments];
    updatedComments[index].likes += 1;
    setComments(updatedComments);
  };

  const filteredPlaylist = mockPlaylist.filter((media) =>
    media.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchSolucao = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const response = await axios.post<Solucao>('https://wisdowkeeper-novatentativa.onrender.com/getSolucao', 
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
          <h2 className="text-lg font-semibold">Feedbacks</h2>
          <textarea 
            className="w-full p-2 mt-2 rounded-lg border border-gray-300 dark:border-gray-700" 
            placeholder="Deixe seu feedback..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button onClick={handleAddComment} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">Enviar</button>
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
            {comments.map((comment, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <span>{comment.text}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleLikeComment(index)} className="text-gray-500 hover:text-blue-500">
                    <ThumbsUp size={16} /> {comment.likes}
                  </button>
                  <MessageCircle size={16} className="text-gray-500" />
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