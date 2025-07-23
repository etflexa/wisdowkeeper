import { useState } from "react";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onToggleSidebar: () => void;
  showWelcome?: boolean; // Nova prop para controlar a exibição
}

const Header = ({ onToggleSidebar, showWelcome = false }: HeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Obtém os dados do usuário/empresa do localStorage
  const enterpriseData = localStorage.getItem("enterprise");
  const userData = localStorage.getItem("user");
  
  // Define o nome a ser exibido
  let displayName = "Usuário";
  if (enterpriseData) {
    displayName = JSON.parse(enterpriseData).name || "Empresa";
  } else if (userData) {
    const parsedUser = JSON.parse(userData);
    displayName = `${parsedUser.name} ${parsedUser.lastName || ""}`.trim() || "Usuário";
  }

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    // Remove todos os dados de autenticação
    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("enterprise");
    localStorage.removeItem("user");
    localStorage.removeItem("enterpriseDetails");
    
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-md w-full">
      <button onClick={onToggleSidebar} className="lg:hidden text-2xl text-blue-600">
        <FaBars />
      </button>

      {/* Container central flexível */}
      <div className={`flex-1 ${showWelcome ? 'text-center' : 'flex justify-end'}`}>
        {showWelcome ? (
          <h1 className="text-3xl font-semibold text-blue-600">
            Seja Bem-Vindo(a) {displayName}
          </h1>
        ) : (
          <div></div> 
        )}
      </div>

      {/* User Icon */}
      <div className="relative">
        <button onClick={toggleDropdown}>
          <FaUserCircle className="text-3xl text-blue-600" />
        </button>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2">
            <ul>
              <li className="text-blue-600 p-2 hover:bg-blue-50 rounded">Ver Perfil</li>
              <li
                className="text-red-600 p-2 hover:bg-red-50 rounded cursor-pointer"
                onClick={handleLogout}
              >
                Sair
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;