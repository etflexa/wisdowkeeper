import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoLogin from "../../assets/login_logo.png";
import { Link } from "react-router-dom";

// Tipo para os dados de resposta da API
type LoginResponse = {
  token: string;
  refreshToken: string;
  enterprise: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
  };
};

type UserLoginResponse = {
  token: string;
  refreshToken: string;
  user: {
    _id: string;
    type: string;
    name: string;
    lastName: string;
    cpf: string;
    email: string;
    enterpriseId: string;
    inActive: boolean;
  };
};

type AuthResponse = LoginResponse | UserLoginResponse;

// Tipo para erros da API
type ApiError = {
  message: string;
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"employee" | "company" | null>(null);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    // Validação dos campos
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "O e-mail é obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Insira um e-mail válido.";

    if (!password) newErrors.password = "A senha é obrigatória.";
    else if (password.length < 6)
      newErrors.password = "A senha deve ter pelo menos 6 caracteres.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/${
          userType === "company" ? "enterprises" : "users"
        }/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Erro ao realizar login");
      }

      const data: AuthResponse = await response.json();
      // Armazenamento dos tokens e dados da empresa
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      if (userType === "company") {
        const enterpriseData = (data as LoginResponse).enterprise;
        localStorage.setItem("enterprise", JSON.stringify(enterpriseData));
      } else {
        const userData = (data as UserLoginResponse).user;
        localStorage.setItem("user", JSON.stringify(userData));
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
      // Tratamento seguro do erro
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError("Ocorreu um erro inesperado durante o login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ... (restante do código permanece igual)

  const handleUserTypeSelect = (type: "employee" | "company") => {
    setUserType(type);
    setEmail("");
    setPassword("");
    setErrors({});
    setLoginError("");
  };

  const handleBackToSelection = () => {
    setUserType(null);
    setEmail("");
    setPassword("");
    setErrors({});
    setLoginError("");
  };

  return (
    <div className='flex h-screen bg-white-50'>
      {/* Lado esquerdo - Logo */}
      <div className='hidden md:flex md:w-1/2 bg-white-50 items-center justify-center p-8 ml-6'>
        <div className='max-w-full max-h-full flex items-center justify-center'>
          <img
            src={logoLogin}
            alt='Logo Wisdom Keeper'
            className='object-contain w-auto h-auto max-w-full max-h-[80vh]'
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "100%",
              maxHeight: "80vh",
            }}
          />
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className='w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8'>
        <div className='w-full max-w-md'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>
              Acesso ao WisdomKeeper
            </h1>
            <p className='text-gray-600'>Gestão de Conhecimento Integrada</p>
          </div>

          {!userType ? (
            <div className='space-y-6 animate-fade-in'>
              <div className='text-center mb-6'>
                <p className='text-gray-700 mb-4'>
                  Selecione o tipo de acesso:
                </p>
              </div>

              <div className='flex flex-col space-y-4'>
                <button
                  onClick={() => handleUserTypeSelect("employee")}
                  className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
                >
                  Para o funcionário
                </button>

                <button
                  onClick={() => handleUserTypeSelect("company")}
                  className='w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors'
                >
                  Para a empresa
                </button>
              </div>
            </div>
          ) : (
            <div className='animate-fade-in'>
              <button
                onClick={handleBackToSelection}
                className='mb-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 mr-1'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
                    clipRule='evenodd'
                  />
                </svg>
                Voltar
              </button>

              <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                {userType === "employee"
                  ? "Acesso do Funcionário"
                  : "Acesso da Empresa"}
              </h2>

              {loginError && (
                <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-lg'>
                  {loginError}
                </div>
              )}

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    E-mail
                  </label>
                  <input
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder='seu@email.com'
                    className={`w-full px-4 py-3 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Senha
                  </label>
                  <input
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder='••••••••'
                    className={`w-full px-4 py-3 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type='submit'
                  className={`w-full ${
                    userType === "employee"
                      ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                      : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  } text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors flex items-center justify-center`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Carregando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </button>

                <div className='text-center pt-2'>
                  {userType === "company" && (
                    <div className='mt-2'>
                      <a
                        href='/cadastro-empresa'
                        className='text-sm text-green-600 hover:text-green-800 hover:underline'
                      >
                        <Link to='/cadastroempresa'>
                          Cadastre a sua empresa
                        </Link>
                      </a>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
