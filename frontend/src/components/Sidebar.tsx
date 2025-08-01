import React from "react";
import { Link } from "react-router-dom";
import logoSideBar from "../assets/logosidebar.png";

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  // Verifica se é empresa ou usuário
  const isEnterprise = !!localStorage.getItem("enterprise");
  const userData = localStorage.getItem("user");
  const userProfile = userData ? JSON.parse(userData).type : null;

  // Define quais links devem ser mostrados
  const shouldShowAdminOptions = isEnterprise || userProfile === "Admin";

  return (
    <div
      className={`bg-blue-600 text-white w-64 h-screen p-6 transition-transform duration-300 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:relative z-10`}
    >
      <img
        className="max-w-[400px] mr-auto mb-8 mt-[-80px] ml-[-130px]"
        src={logoSideBar}
        alt="Wisdom Keeper Logo"
      />

      <ul className="space-y-4 mt-[-50px]">
        <li>
          <Link
            to="/dashboard"
            className="hover:bg-blue-500 p-2 rounded-lg block transition-colors duration-200"
          >
            Início
          </Link>
        </li>
        <li>
          <Link
            to="/solucoes"
            className="hover:bg-blue-500 p-2 rounded-lg block transition-colors duration-200"
          >
            Soluções
          </Link>
        </li>
        
        {shouldShowAdminOptions && (
          <>
            <li>
              <Link
                to="/monitorar-consultas"
                className="hover:bg-blue-500 p-2 rounded-lg block transition-colors duration-200"
              >
                Monitorar Consultas
              </Link>
            </li>
            <li>
              <Link
                to="/categorizarsolucoes"
                className="hover:bg-blue-500 p-2 rounded-lg block transition-colors duration-200"
              >
                Categorizar Soluções
              </Link>
            </li>
            <li>
              <Link
                to="/usuarios"
                className="hover:bg-blue-500 p-2 rounded-lg block transition-colors duration-200"
              >
                Usuários
              </Link>
            </li>
          </>
        )}

        <li>
          <Link
            to="/feedbacks"
            className="hover:bg-blue-500 p-2 rounded-lg block transition-colors duration-200"
          >
            Feedbacks
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;