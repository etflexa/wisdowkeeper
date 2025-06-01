import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecuperacaoConta() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [submetido, setSubmetido] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmetido(true);
    setMensagem(`Se o email ${email} estiver correto, você receberá uma nova senha padrão em breve.`);
  };

  const voltarParaLogin = () => {
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10 relative">
      {/* Seta de voltar (mantida conforme solicitado) */}
      <button 
        onClick={voltarParaLogin}
        className="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Recuperação de Conta</h2>
      
      {!submetido ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email da conta:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Digite seu email cadastrado"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          {/* Botão Recuperar Senha centralizado */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full md:w-2/3 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Recuperar Senha
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center p-4 bg-gray-50 rounded-md">
          <p className="text-gray-700 mb-4">{mensagem}</p>
          <button
            onClick={voltarParaLogin}
            className="w-full md:w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out mx-auto"
          >
            Voltar para o Login
          </button>
        </div>
      )}
    </div>
  );
}