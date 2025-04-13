import React from "react";
import { Link } from "react-router-dom"; // Importação para navegação
import logoSideBar from "../assets/logosidebar.png"

interface SidebarProps {
  isSidebarOpen: boolean;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  return (
    <div
      className={`bg-blue-600 text-white w-64 h-screen p-6 transition-transform duration-300 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:relative`}
    >
      
      <img 
  className=" max-w-[400px] mr-auto mb-8 mt-[-80px] ml-[-130px]" 
  src={logoSideBar} 
  alt="Wisdom Keeper Logo"
/>
      <ul className="space-y-4 mt-[-50px]">
        <li>
          <Link to="/dashboard" className="hover:bg-blue-500 p-2 rounded-lg block">
            Início
          </Link>
        </li>
        <li>
          <Link to="/solucoes" className="hover:bg-blue-500 p-2 rounded-lg block">
            Soluções
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="hover:bg-blue-500 p-2 rounded-lg block">
            Monitorar Consultas
          </Link>
        </li>
        <li>
          <Link to="/categorizarsolucoes" className="hover:bg-blue-500 p-2 rounded-lg block">
            Categorizar Soluções
          </Link>
        </li>
        <li>
          <Link to="/usuarios" className="hover:bg-blue-500 p-2 rounded-lg block">
            Usuários
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="hover:bg-blue-500 p-2 rounded-lg block">
            Feedbacks
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;