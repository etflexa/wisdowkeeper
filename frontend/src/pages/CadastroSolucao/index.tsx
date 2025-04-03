import { useState } from "react";
import { AiOutlineLink, AiOutlineClose } from "react-icons/ai";
import Sidebar from "../../components/Sidebar";
import ContadorToken from "../../function/contadorToken";
import { useNavigate } from "react-router-dom";


const CriacaoSolucao = () => {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [currentLink, setCurrentLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Hook para navegação

  const categorias = [
    { value: "erro-404", label: "Erro 404" },
    { value: "erro-500", label: "Erro 500" },
    { value: "configuracao", label: "Configuração" },
    { value: "desempenho", label: "Desempenho" },
    { value: "seguranca", label: "Segurança" },
  ];

  const handleAddLink = (e: { key: string; preventDefault: () => void; }) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (currentLink.trim()) {
        setLinks([...links, currentLink.trim()]);
        setCurrentLink("");
      }
    }
  };

  const removeLink = (indexToRemove: number) => {
    setLinks(links.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = () => {
    if (!titulo || !descricao || !categoria || links.length === 0) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);


      async function enviar(){
        const token = localStorage.getItem('jwt');
      try{
      const response = await  fetch('https://wisdowkeeper-novatentativa.onrender.com/CadastrarSolucao', {
        
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          titulo,descricao,categoria,links
        }   
        
        ) // Converte os dados do formulário em JSON
    })
    const responseData = await response.json();
    console.error("Erro na API:", responseData);
      if (!response.ok) {
      
        if (response.status === 400) {
          alert("Preencha todos os campos " );
        
        } 
        if (response.status === 500) {
          alert("erro ao cadastrar a solução " );
        
        } 
    
        throw new Error(`Erro: ${response.status} - ${response.statusText}`);

      }
      alert("Solução cadastrada com sucesso!" );
     
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao conectar com o servidor.");
    }
      }

















      enviar();

      setSuccessMessage("Solução cadastrada com sucesso!");
      setTitulo("");
      setDescricao("");
      setCategoria("");
      setLinks([]);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <ContadorToken />
      <div className="flex-1 p-6">
        <div className="bg-white h-full shadow-lg rounded-lg max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Criar Nova Solução</h2>
          {successMessage && <p className="text-green-500 text-center mb-3">{successMessage}</p>}

          <input
            className="border p-3 mb-3 rounded w-full focus:ring-2 focus:ring-blue-300"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <textarea
            className="border p-3 mb-3 rounded w-full h-24 focus:ring-2 focus:ring-blue-300"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <select
            className="border p-3 mb-3 rounded w-full focus:ring-2 focus:ring-blue-300 bg-white"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="" disabled>Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Campo de Links modificado */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-2 mb-2">
              {links.map((link, index) => (
                <div key={index} className="flex items-center bg-blue-100 rounded-full px-3 py-1 text-sm">
                  <a href={link.startsWith('http') ? link : `https://${link}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="mr-1 text-blue-600 hover:underline">
                    {link}
                  </a>
                  <button 
                    onClick={() => removeLink(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <AiOutlineClose size={14} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded hover:bg-gray-200 transition">
              <AiOutlineLink className="text-blue-500" />
              <input
                type="text"
                className="flex-1 bg-transparent focus:outline-none h-10"
                placeholder="Cole o link e pressione espaço para adicionar"
                value={currentLink}
                onChange={(e) => setCurrentLink(e.target.value)}
                onKeyDown={handleAddLink}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Pressione espaço para adicionar múltiplos links</p>
          </div>

          <button
            className={`p-3 rounded w-full transition ${
              titulo && descricao && categoria && links.length > 0
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            onClick={handleSubmit}
            disabled={!titulo || !descricao || !categoria || links.length === 0 || loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CriacaoSolucao;