import { useState } from "react";
import { AiOutlineLink } from "react-icons/ai";
import Sidebar from "../../components/Sidebar";
import ContadorToken from "../../function/contadorToken";

const CriacaoSolucao = () => {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState(""); // Estado para a categoria selecionada
  const [url, setUrl] = useState(""); // Estado para a URL
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSidebarOpen] = useState(false);

  // Opções de categoria
  const categorias = [
    { value: "erro-404", label: "Erro 404" },
    { value: "erro-500", label: "Erro 500" },
    { value: "configuracao", label: "Configuração" },
    { value: "desempenho", label: "Desempenho" },
    { value: "seguranca", label: "Segurança" },
  ];

  const handleSubmit = () => {
    if (!titulo || !descricao || !categoria || !url) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("Solução cadastrada com sucesso!");
      setTitulo("");
      setDescricao("");
      setCategoria("");
      setUrl("");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <ContadorToken />
      <div className="flex-1 p-6">
        <div className="bg-white h-full shadow-lg rounded-lg max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Criar Nova Solução</h2>
          {successMessage && <p className="text-green-500 text-center mb-3">{successMessage}</p>}

          {/* Campo de Título */}
          <input
            className="border p-3 mb-3 rounded w-full focus:ring-2 focus:ring-blue-300"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          {/* Campo de Descrição */}
          <textarea
            className="border p-3 mb-3 rounded w-full h-24 focus:ring-2 focus:ring-blue-300"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          {/* Campo de Categoria (Select) */}
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

          {/* Campo de URL */}
          <div className="flex items-center gap-2 bg-gray-100 p-3 rounded mb-3 w-full hover:bg-gray-200 transition">
            <AiOutlineLink className="text-blue-500" />
            <input
              type="text"
              className="flex-1 bg-transparent focus:outline-none"
              placeholder="URL do vídeo, site ou PDF"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          {/* Botão de Salvar */}
          <button
            className={`p-3 rounded w-full transition ${
              titulo && descricao && categoria && url
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            onClick={handleSubmit}
            disabled={!titulo || !descricao || !categoria || !url || loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CriacaoSolucao;