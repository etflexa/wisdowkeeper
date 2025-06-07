import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import axios from 'axios';
import ContadorToken from "../../function/contadorToken";

// Definir o tipo do usuário
type Usuario = {
  _id: string;
  nome: string;
  email: string;
  perfil: string;
  ativo: boolean;
};

const Usuarios = () => {
  const [isSidebarOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const handleEditarClick = (email: string, nome: string) => {
    const resposta = window.confirm("Editar usuário " + nome + "?");
    if (resposta) {
      navigate(`/editarcadastro`, { state: { email } });
    }
  };

  // Função reutilizável para buscar usuários
  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.get<Usuario[]>('https://wisdowkeeper-novatentativa.onrender.com/api/usuarios', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data)
      const usuarios = response.data as Usuario[]; // Supondo que 'response.data' seja um array de usuários

      // Mapeando o array de usuários para gerar um novo com 'ativo' como booleano
      const usuariosAtualizados = usuarios.map(usuario => {
        return {
          ...usuario,
          ativo: typeof usuario.ativo === 'boolean' ? usuario.ativo : false,
        };
      });

      setUsuarios(usuariosAtualizados);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      alert("Não foi possível carregar os usuários.");
    }
  };

  // UseEffect que chama o fetch na montagem
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Atualiza status do usuário
  const toggleStatus = async (email: string, status: boolean) => {
    const confirmacao = window.confirm(`Tem certeza que deseja alterar o status do usuário ${email}?`);
    if (!confirmacao) return;

    if(status==true){
      try {
        const token = localStorage.getItem('jwt');
        await axios.post(
          'https://wisdowkeeper-novatentativa.onrender.com/api/removerUsuario',
          { email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        navigate(0);
      } catch (error) {
        console.error("Erro ao alterar status do usuário:", error);
        alert("Ocorreu um erro ao alterar o status do usuário.");
      }

    }else if(status==false){
      try {
        const token = localStorage.getItem('jwt');
        await axios.post(
          'https://wisdowkeeper-novatentativa.onrender.com/api/ativarUsuario',
          { email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        navigate(0);
      } catch (error) {
        console.error("Erro ao alterar status do usuário:", error);
        alert("Ocorreu um erro ao alterar o status do usuário.");
      }

    }
  
    




  };

  // Filtro por nome/email/função
  const filteredUsuarios = usuarios.filter(
    (user) =>
      (user.nome.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())) &&
      (filterRole === "" || user.perfil === filterRole)
  );

  // Paginação
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const paginatedUsuarios = filteredUsuarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <ContadorToken />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-blue-600">Usuários</h1>
          <button
            onClick={() => navigate("/cadastro")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Cadastrar Usuário
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar usuário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="p-2 border rounded-lg shadow-sm"
          >
            <option value="">Todos</option>
            <option value="Admin">Admins</option>
            <option value="Usuário">Usuários</option>
          </select>
        </div>

        {/* Tabela de usuários */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">E-mail</th>
                <th className="p-3 text-left">Função</th>
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
                        {user.nome.charAt(0)}
                      </div>
                      {user.nome}
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.perfil}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEditarClick(user.email, user.nome)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => toggleStatus(user.email, user.ativo)}
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
                    Nenhum usuário encontrado
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

export default Usuarios;
