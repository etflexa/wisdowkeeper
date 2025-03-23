import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import axios from 'axios';
import ContadorToken from "../../function/contadorToken";




// Definir o tipo do usuário
type Usuario = {
  id: number;
  nome: string;
  email: string;
  perfil: string
};



const Usuarios = () => {
  const [isSidebarOpen] = useState(false);
  
  // Aplicando o tipo ao useState
  const [usuarios, setUsuarios] = useState<Usuario[]>([]); // Agora o estado é um array de User
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState(""); // Novo filtro por função
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Paginação
  const navigate = useNavigate();

  const handleEditarClick = (email: string, nome: string) => {
    const resposta = window.confirm("Editar usuario "+nome+"?");
    if(resposta){
      navigate(`/editarcadastro`, { state: { email } }); // Redireciona para a página de edição com o ID do usuário

    }
  };


  const handleDelete = (email: string, nome: string) => {
    const resposta = window.confirm("excluir usuario "+nome+"?");
    if (resposta) {

        console.log("Usuário confirmou.");
        async function remover(){
          const token = localStorage.getItem('jwt');
      
          const response = await  fetch('https://wisdowkeeper-novatentativa.onrender.com/removeUser', {
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                email : email
            }) // Converte os dados do formulário em JSON
        })
          if (!response.ok) {
                       
            if (response.status === 400) {
              alert("Faça login para remover usuário" );
              navigate('/usuarios')
            } 
            if (response.status === 404) {
              alert("Usuario não encontrado" );
              
            } 
            
            if (response.status === 500) {
              alert("erro ao remover" );
              
              
            } 
            
        
            throw new Error(`Erro: ${response.status} - ${response.statusText}`);
    
          }
          if(response.ok){
            alert("Usuario removido" );
            navigate('/usuarios')
            
          }
         

        }
        remover();
   
    } 
  };
 

  // Simulação de usuários
  useEffect(() => {
    const fetchUsuarios = async () => {
    
      
      // Adiciona o evento de clique no botão
     
      const token = localStorage.getItem('jwt');
      const response = await axios.get<Usuario[]>('https://wisdowkeeper-novatentativa.onrender.com/getUsers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });



     
      setUsuarios(response.data);
    };
    fetchUsuarios();
  }, []);

  // Filtrando usuários por nome, email ou função
  const filteredUsuarios = usuarios.filter(
    (user) =>
      (user.nome.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()))
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
                  <tr key={user.id} className="border-b hover:bg-gray-100">
                    <td className="p-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        {user.nome.charAt(0)}
                      </div>
                      {user.nome}
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.perfil}</td>
                    <td className="p-3">
                      Ativo
                    </td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => handleEditarClick(user.email, user.nome)} className="bg-yellow-500 text-white px-3 py-1 rounded-md">Editar</button>
                      <button onClick={() => handleDelete(user.email, user.nome)}  className="bg-red-600 text-white px-3 py-1 rounded-md">Excluir</button>
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
