import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import ContadorToken from "../../function/contadorToken";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Header from "../../components/Header";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <ContadorToken/>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header onToggleSidebar={toggleSidebar} showWelcome={true} />

        {/* Dashboard Content */}
        <div className="p-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visão Geral */}
            <div className="bg-white p-6 rounded-lg shadow-lg col-span-1 lg:col-span-2">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Visão Geral</h2>
              <p className="text-gray-600 mb-6">Resumo das principais atividades e métricas.</p>
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm h-96 mb-4">
                <h3 className="text-lg text-blue-600 font-medium">Acessos Mensais</h3>
                <div className="h-80 mt-4">
                  <Line 
                    data={{
                      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                      datasets: [
                        {
                          label: 'Acessos em 2024',
                          data: [65, 59, 80, 81, 56, 55, 40, 72, 88, 94, 100, 120],
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.5)',
                          tension: 0.3,
                          fill: true
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          mode: 'index',
                          intersect: false,
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Soluções Recentes */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Soluções Recentes</h2>
              <ul className="space-y-2">
                <li className="text-gray-600">Solução 1 - <span className="text-blue-500">01/02/2025</span></li>
                <li className="text-gray-600">Solução 2 - <span className="text-blue-500">28/01/2025</span></li>
              </ul>
            </div>

            {/* Feedbacks */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Feedbacks</h2>
              <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
                <p className="text-gray-600">"O sistema é muito fácil de usar."</p>
                <p className="text-sm text-blue-500">- Usuário 1</p>
              </div>
            </div>

            {/* Favoritos */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Soluções Favoritas</h2>
              <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
                <p className="text-gray-600">"Gostei das melhorias no painel de controle!"</p>
                <p className="text-sm text-blue-500">- Usuário 2</p>
              </div>
            </div>

            {/* Comentários */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Comentários Recentes</h2>
              <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
                <p className="text-gray-600">"Precisa de algumas melhorias, mas é ótimo!"</p>
                <p className="text-sm text-blue-500">- Usuário 3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;