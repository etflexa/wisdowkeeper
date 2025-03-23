import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ContadorToken = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const navigate = useNavigate();

  // Função para decodificar o JWT e obter a data de expiração
  const getTokenExpiration = (token: string): number | null => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000; // exp está em segundos, converte para milissegundos
    } catch (error) {
      console.error("Erro ao decodificar o token", error);
      return null;
    }
  };

  // Verifica se o token está prestes a expirar
  const checkTokenExpiration = () => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const expirationTime = getTokenExpiration(token);
    if (!expirationTime) return;

    const currentTime = Date.now();
    const timeLeft = expirationTime - currentTime;

    if (timeLeft <= 120 * 1000 && timeLeft > 0) {
      // Se estiver a 2 minutos de expirar
      setDialogVisible(true);
    } else if (timeLeft <= 0) {
      // O token já expirou
      localStorage.removeItem("jwt");
      navigate("/");
    }
  };

  // Atualiza o token
  const handleStayLoggedIn = async () => {
    const token = localStorage.getItem("jwt");
    try {
      const response = await fetch("https://wisdowkeeper-novatentativa.onrender.com/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("jwt", data.token); // Armazena o novo token
        setDialogVisible(false); // Fecha o diálogo
      } else {
        alert("Sessão expirada");
        navigate("/");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  // Faz logout
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setDialogVisible(false);
    navigate("/");
  };

  // Inicia o intervalo de verificação
  useEffect(() => {
    const intervalId = setInterval(checkTokenExpiration, 30000); // Verifica a cada 30 segundos
    return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar
  }, []);

  return (
    <>
      {dialogVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Sessão expirando</h2>
            <p className="mb-4">Sua sessão está prestes a expirar. Deseja continuar logado?</p>
            <div className="flex gap-2">
              <button
                onClick={handleStayLoggedIn}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Continuar logado
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContadorToken;