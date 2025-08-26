import React from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import logoSideBar from "../assets/logosidebar.png";

interface SidebarProps {
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, onCloseSidebar }) => {
  // Verifica se é empresa ou usuário
  const isEnterprise = !!localStorage.getItem("enterprise");
  const userData = localStorage.getItem("user");
  const userProfile = userData ? JSON.parse(userData).type : null;

  // Define quais links devem ser mostrados
  const shouldShowAdminOptions = isEnterprise || userProfile === "Admin";

  return (
    <>
      {/* Overlay para mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onCloseSidebar}
        ></div>
      )}
      
      <div
        className={`bg-blue-600 text-white w-64 h-screen p-6 transition-all duration-300 fixed lg:relative z-30 ${
          isSidebarOpen ? "left-0" : "-left-64"
        } lg:left-0 top-0 overflow-y-auto flex flex-col`}
      >
        {/* Header da Sidebar - 100% de largura */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-center w-full">
              <img
                className="max-w-[180px]"
                src={logoSideBar}
                alt="Wisdom Keeper Logo"
              />
            </div>
            
            {/* Botão fechar para mobile */}
            <button 
              className="text-white lg:hidden"
              onClick={onCloseSidebar}
              aria-label="Fechar menu"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* Conteúdo da Sidebar */}
        <div className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className="hover:bg-blue-500 p-3 rounded-lg block transition-colors duration-200 w-full"
                onClick={() => window.innerWidth < 1024 && onCloseSidebar()}
              >
                Início
              </Link>
            </li>
            <li>
              <Link
                to="/solucoes"
                className="hover:bg-blue-500 p-3 rounded-lg block transition-colors duration-200 w-full"
                onClick={() => window.innerWidth < 1024 && onCloseSidebar()}
              >
                Soluções
              </Link>
            </li>
            
            {shouldShowAdminOptions && (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:bg-blue-500 p-3 rounded-lg block transition-colors duration-200 w-full"
                    onClick={() => window.innerWidth < 1024 && onCloseSidebar()}
                  >
                    Monitorar Consultas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categorizarsolucoes"
                    className="hover:bg-blue-500 p-3 rounded-lg block transition-colors duration-200 w-full"
                    onClick={() => window.innerWidth < 1024 && onCloseSidebar()}
                  >
                    Categorizar Soluções
                  </Link>
                </li>
                <li>
                  <Link
                    to="/usuarios"
                    className="hover:bg-blue-500 p-3 rounded-lg block transition-colors duration-200 w-full"
                    onClick={() => window.innerWidth < 1024 && onCloseSidebar()}
                  >
                    Usuários
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;