import { Routes, Route, Navigate } from "react-router-dom";
import Usuarios from './pages/Usuarios';
import Dashboard from './pages/Dashboard/index';
import Cadastro from './pages/Cadastro/index';
import CadastroEmpresa from './pages/CadastroEmpresa/index'
import EditarCadastro from './pages/EditarCadastro/index';
import CadastroSolucao from './pages/CadastroSolucao/index';
import EditarSolucao from './pages/EditarSolucao/index';
import Solucoes from './pages/Soluções/index';
import ConsultarSolucao from './pages/ConsultarSolucao/index';
import CategorizarSolucoes from "./pages/CategorizarSolucoes";
import Login from './pages/Login/index';
import RecuperacaoConta from './pages/recuperarConta/index';


function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/cadastroempresa" element={<CadastroEmpresa />} />
      <Route path="/editarcadastro" element={<EditarCadastro />} />
      <Route path="/+" element={<CadastroSolucao />} />
      <Route path="/editarsolucao" element={<EditarSolucao />} />
      <Route path="/solucoes" element={<Solucoes />} />
      <Route path="/consultarsolucao/:id" element={<ConsultarSolucao />} />
      <Route path="/CadastrarSolucao" element={<CadastroSolucao />} />
      <Route path="/categorizarSolucoes" element={<CategorizarSolucoes />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/recuperarConta" element={<RecuperacaoConta />} />
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
    
  );
}

export default MainRoutes;