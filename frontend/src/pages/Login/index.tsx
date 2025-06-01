import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoLogin from "../../assets/login_logo.png";
import { jwtDecode } from "jwt-decode"; // ✅ Importação corrigida

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "O e-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Insira um e-mail válido.";
    }

    if (!password) {
      newErrors.password = "A senha é obrigatória.";
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      interface JwtPayload {
        id: string;
        // adicione mais campos conforme necessário
      }

      try {
        const response = await fetch('https://wisdowkeeper-novatentativa.onrender.com/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          const token = data.token;

          localStorage.setItem('jwt', token);
          console.log(token)

          // Decodifica o JWT para obter o ID do usuário
          const decoded: JwtPayload = jwtDecode(token); // ✅ Uso corrigido
          const userId = decoded.id;
       

          // Faz a requisição GET para buscar os dados do usuário
          const userResponse = await fetch(`http://localhost:3000/api/usuario/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // se a API exigir autenticação
            },
          });

          if (userResponse.ok) {
            //userData contem os dados do usuario vinos do backend
            const userData = await userResponse.json();
            console.log("Dados do usuário:", userData);
            navigate('/dashboard');
          } else {
            console.error("Erro ao buscar os dados do usuário.");
          }
        } else {
          alert("Usuário ou senha incorretos");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white-50">
      {/* Lado esquerdo - Logo */}
      <div className="hidden md:flex md:w-1/2 bg-white-50 items-center justify-center p-8 ml-6">
        <div className="max-w-full max-h-full flex items-center justify-center">
          <img
            src={logoLogin}
            alt="Logo Wisdom Keeper"
            className="object-contain w-auto h-auto max-w-full max-h-[80vh]"
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: '100%',
              maxHeight: '80vh'
            }}
          />
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Acesso ao WisdowKeeper</h1>
            <p className="text-gray-600">Gestão de Conhecimento Integrada</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className={`w-full px-4 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={isLoading}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Carregando...
                </>
              ) : (
                "Entrar"
              )}
            </button>

            <div className="text-center pt-2">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                Esqueceu sua senha?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
