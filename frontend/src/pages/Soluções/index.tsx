import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import axios from 'axios';
import ContadorToken from "../../function/contadorToken";

type Solucao = {
  _id: string;
  titulo: string;
  categoria: string;
  ativo?: boolean; // Adicionado como opcional para não quebrar o código existente
};

const Solucoes = () => {
  const [isSidebarOpen] = useState(false);
  const [solucoes, setSolucoes] = useState<Solucao[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const handleEditarClick = (id: string) => {
    navigate(`/consultarsolucao`, { state: { id } });
  };

  // Função para alternar o status localmente
  const toggleStatus = (_id: string) => {
    setSolucoes(solucoes.map(solucao => 
      solucao._id === _id 
        ? { ...solucao, ativo: !solucao.ativo } 
        : solucao
    ));
  };

  // Simulação de usuários
  useEffect(() => {
    const fetchSolucoes = async () => {
      const token = localStorage.getItem('jwt');
      const response = await axios.get<Solucao[]>('https://wisdowkeeper-novatentativa.onrender.com/getSolucoes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Inicializa o status ativo como true para todas as soluções
      const solucoesComStatus = response.data.map(solucao => ({
        ...solucao,
        ativo: solucao.ativo !== undefined ? solucao.ativo : true
      }));
      
      setSolucoes(solucoesComStatus);
    };
    fetchSolucoes();
  }, []);

  // Filtrando usuários por nome, email ou função
  const filteredUsuarios = solucoes.filter(
    (user) =>
      (user.titulo.toLowerCase().includes(search.toLowerCase()) ||
        user.categoria.toLowerCase().includes(search.toLowerCase()))
  );

  // Paginação
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const paginatedUsuarios = filteredUsuarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <ContadorToken/>

      {/* Conteúdo principal */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-blue-600">Soluções</h1>
          <button
            onClick={() => navigate("/CadastrarSolucao")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Cadastrar Solução
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar solução..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tabela de usuários */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Titulo</th>
                <th className="p-3 text-left">Categoria</th>   
                <th className="p-3 text-left">Status</th>               
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsuarios.length > 0 ? (
                paginatedUsuarios.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-100">
                    <td className="p-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        {user.titulo.charAt(0)}
                      </div>
                      {user.titulo}
                    </td>
                    <td className="p-3">{user.categoria}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button 
                        onClick={() => handleEditarClick(user._id)} 
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                      >
                        Visualizar
                      </button>
                      <button 
                        onClick={() => toggleStatus(user._id)}
                        className={`px-3 py-1 rounded-md ${
                          user.ativo ? 'bg-green-600 text-white' : 'bg-gray-400 text-gray-800'
                        }`}
                      >
                        {user.ativo ? 'Desativar' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    Nenhuma solução encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-3 py-1 mx-1">{currentPage} / {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Solucoes;