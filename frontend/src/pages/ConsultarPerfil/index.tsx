import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header"; // Componente Header
import Sidebar from "../../components/Sidebar"; // Componente Sidebar

// Tipos para os dados do usuário e da empresa, para clareza e segurança
type UserProfile = {
  _id: string;
  type: string;
  name: string;
  lastName: string;
  cpf: string;
  email: string;
  enterpriseId: string;
  isActive: boolean;
};

type EnterpriseProfile = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
};

export default function ConsultarPerfil() {
  // Estados para os dados, tipo de usuário, carregamento e erros
  const [profileData, setProfileData] = useState<UserProfile | EnterpriseProfile | null>(null);
  const [userType, setUserType] = useState<"employee" | "company" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para controlar a visibilidade da Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Inicia aberta por padrão
  


  // Efeito para buscar os dados do perfil quando o componente é montado
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("jwt");
      const enterpriseInfo = localStorage.getItem("enterprise");
      const userInfo = localStorage.getItem("user");

      if (!token) {
        setError("Token de autenticação não encontrado. Faça o login novamente.");
        setIsLoading(false);
        return;
      }

      // Se for uma EMPRESA, os dados já estão no localStorage
      if (enterpriseInfo) {
        setUserType("company");
        setProfileData(JSON.parse(enterpriseInfo));
        setIsLoading(false);
      } 
      // Se for um FUNCIONÁRIO, busca os dados na API com axios
      else if (userInfo) {
        setUserType("employee");
        const parsedUser = JSON.parse(userInfo);
        const userId = parsedUser._id;
        const enterpriseId = parsedUser.enterpriseId;

        try {
          const response = await axios.get(`http://localhost:8080/api/enterprises/${enterpriseId}/users/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` },
          } );
          // A API retorna { user: { ... } }, então acessamos response.data.user
          setProfileData(response.data.user);
        } catch (err) {
          if (axios.isAxiosError(err) && err.response) {
            setError(err.response.data.message || "Falha ao buscar dados do perfil.");
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Ocorreu um erro inesperado.");
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setError("Não foi possível identificar o tipo de usuário. Faça o login novamente.");
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []); // O array vazio [] garante que o useEffect rode apenas uma vez

  // Função para alternar a visibilidade da Sidebar, passada para o Header
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Estrutura de renderização com layout de dashboard
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar: Controlada pelo estado 'isSidebarOpen' */}
      <Sidebar isSidebarOpen={isSidebarOpen} onCloseSidebar={function (): void {
        throw new Error("Function not implemented.");
      } } />

      {/* Área de Conteúdo Principal (Header + Conteúdo da página) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header: Recebe a função para controlar a sidebar */}
        <Header onToggleSidebar={toggleSidebar} />

        {/* Conteúdo da Página (com scroll individual) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Estado de Carregamento */}
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              </div>
            )}

            {/* Estado de Erro */}
            {error && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Meu Perfil</h1>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                  <strong className="font-bold">Erro: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              </div>
            )}

            {/* Conteúdo Carregado com Sucesso */}
            {!isLoading && !error && (
              <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 md:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 border-b pb-3">Meu Perfil</h1>
                
                {/* Formulário para Empresa */}
                {userType === 'company' && profileData && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Nome da Empresa</label>
                      <input
                        type="text"
                        readOnly
                        value={(profileData as EnterpriseProfile).name}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Formulário para Funcionário */}
                {userType === 'employee' && profileData && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
                        <input type="text" readOnly value={(profileData as UserProfile).name} className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Sobrenome</label>
                        <input type="text" readOnly value={(profileData as UserProfile).lastName} className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">E-mail</label>
                      <input type="email" readOnly value={(profileData as UserProfile).email} className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">CPF</label>
                      <input type="text" readOnly value={(profileData as UserProfile).cpf} className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Tipo de Usuário</label>
                      <input type="text" readOnly value={(profileData as UserProfile).type} className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
