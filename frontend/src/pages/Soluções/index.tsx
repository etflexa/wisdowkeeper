import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import axios from 'axios';
import ContadorToken from "../../function/contadorToken";





type Solucao = {
  _id: string;
  titulo: string;
  categoria: string;
 
};


const Solucoes = () => {
  const [isSidebarOpen] = useState(false);
  
  // Aplicando o tipo ao useState
 // const [usuarios, setUsuarios] = useState<Usuario[]>([]); // Agora o estado é um array de User
  const [solucoes, setSolucoes] = useState<Solucao[]>([]); // Agora o estado é um array de User
  const [search, setSearch] = useState("");
  //const [filterRole, setFilterRole] = useState(""); // Novo filtro por função
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Paginação
  const navigate = useNavigate();
  const handleEditarClick = (id: string) => {
    
   
    navigate(`/consultarsolucao`, { state: { id } });
  };
 
  const handleDelete = (_id: string, titulo: string) => {
    const resposta = window.confirm("excluir usuario "+titulo+"?");
    if (resposta) {

        console.log("Usuário confirmou.");
        async function remover(){
          const token = localStorage.getItem('jwt');
      
          const response = await  fetch('https://wisdowkeeper-novatentativa.onrender.com/removerSolucao', {
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                _id : _id
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
            alert("Solução removida!" );
            navigate('/Dashboard')
            
          }
         

        }
        remover();
   
    } 
  };
  // Simulação de usuários
  useEffect(() => {
    const fetchSolucoes = async () => {
    
      
      // Adiciona o evento de clique no botão
     
      const token = localStorage.getItem('jwt');
      const response = await axios.get<Solucao[]>('https://wisdowkeeper-novatentativa.onrender.com/getSolucoes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
     
      setSolucoes(response.data);
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
            placeholder="Buscar usuário..."
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
                <th className="p-3 text-left"></th>               
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
                    <td className="p-3"></td>
                   
                    <td className="p-3 flex gap-2">
                      <button onClick={() => handleEditarClick(user._id)} className="bg-yellow-500 text-white px-3 py-1 rounded-md">Visualizar</button>
                      <button onClick={() => handleDelete(user._id, user.titulo)} className="bg-red-600 text-white px-3 py-1 rounded-md">Excluir</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    Nenhuma solução encontrado
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
