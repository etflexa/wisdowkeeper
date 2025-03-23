import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import ContadorToken from "../../function/contadorToken";

const CategorizarSolucoes = () => {
  // Estado para armazenar a lista de categorias
  const [categorias, setCategorias] = useState([
    { id: 1, nome: "Erro 404" },
    { id: 2, nome: "Erro 500" },
    { id: 3, nome: "Configuração" },
  ]);

  // Estado para o nome da nova categoria
  const [novaCategoria, setNovaCategoria] = useState("");

  // Estado para controlar a edição de uma categoria
  const [editandoCategoria, setEditandoCategoria] = useState<{ id: number | null; nome: string }>({
    id: null,
    nome: "",
  });

  // Função para adicionar uma nova categoria
  const adicionarCategoria = () => {
    if (novaCategoria.trim() === "") {
      alert("O nome da categoria não pode estar vazio.");
      return;
    }
    const novaCategoriaObj = {
      id: categorias.length + 1, // Gera um ID único (pode ser substituído por um UUID em produção)
      nome: novaCategoria,
    };
    setCategorias([...categorias, novaCategoriaObj]);
    setNovaCategoria(""); // Limpa o campo de input
  };

  // Função para iniciar a edição de uma categoria
  const iniciarEdicao = (id: number, nome: string) => {
    setEditandoCategoria({ id, nome });
  };

  // Função para salvar a edição de uma categoria
  const salvarEdicao = () => {
    if (editandoCategoria.nome.trim() === "") {
      alert("O nome da categoria não pode estar vazio.");
      return;
    }
    const categoriasAtualizadas = categorias.map((cat) =>
      cat.id === editandoCategoria.id ? { ...cat, nome: editandoCategoria.nome } : cat
    );
    setCategorias(categoriasAtualizadas);
    setEditandoCategoria({ id: null, nome: "" }); // Finaliza a edição
  };

  // Função para excluir uma categoria
  const excluirCategoria = (id: number) => {
    const categoriasFiltradas = categorias.filter((cat) => cat.id !== id);
    setCategorias(categoriasFiltradas);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={true} />
      <ContadorToken />

      {/* Conteúdo principal */}
      <div className="flex-1 p-6">
        <div className="bg-white h-full shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Categorizar Soluções</h2>

          {/* Formulário para adicionar nova categoria */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Adicionar Nova Categoria</h3>
            <div className="flex gap-2">
              <input
                type="text"
                className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-300"
                placeholder="Nome da categoria"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
              />
              <button
                onClick={adicionarCategoria}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Adicionar
              </button>
            </div>
          </div>

          {/* Lista de categorias */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categorias Existentes</h3>
            <ul className="space-y-2">
              {categorias.map((cat) => (
                <li key={cat.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  {editandoCategoria.id === cat.id ? (
                    // Modo de edição
                    <div className="flex gap-2 w-full">
                      <input
                        type="text"
                        className="border p-1 rounded w-full focus:ring-2 focus:ring-blue-300"
                        value={editandoCategoria.nome}
                        onChange={(e) =>
                          setEditandoCategoria({ ...editandoCategoria, nome: e.target.value })
                        }
                      />
                      <button
                        onClick={salvarEdicao}
                        className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      >
                        Salvar
                      </button>
                    </div>
                  ) : (
                    // Modo de visualização
                    <>
                      <span>{cat.nome}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => iniciarEdicao(cat.id, cat.nome)}
                          className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => excluirCategoria(cat.id)}
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Excluir
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorizarSolucoes;