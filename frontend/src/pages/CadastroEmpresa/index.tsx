import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoLogin from "../../assets/login_logo.png";

// Tipo para erros da API
type ApiError = {
  message: string;
};

function CompanyRegister() {
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    cnpj?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const navigate = useNavigate();

  const formatCnpj = (value: string) => {
    const digits = value.replace(/\D/g, "");
    
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCnpj(e.target.value);
    setCnpj(formattedValue);
  };

  const validateCnpj = (cnpj: string) => {
    const cleanedCnpj = cnpj.replace(/\D/g, '');
    return cleanedCnpj.length === 14;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRegisterError("");

    // Validação dos campos
    const newErrors: typeof errors = {};
    
    if (!name) newErrors.name = "A razão social é obrigatória.";
    else if (name.length < 3) newErrors.name = "A razão social deve ter pelo menos 3 caracteres.";
    
    if (!cnpj) newErrors.cnpj = "O CNPJ é obrigatório.";
    else if (!validateCnpj(cnpj)) newErrors.cnpj = "Insira um CNPJ válido.";
    
    if (!email) newErrors.email = "O e-mail é obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Insira um e-mail válido.";
    
    if (!password) newErrors.password = "A senha é obrigatória.";
    else if (password.length < 6) newErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    
    if (password !== confirmPassword) newErrors.confirmPassword = "As senhas não coincidem.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const requestBody = { 
        name, 
        cnpj: cnpj.replace(/\D/g, ''), // Envia apenas os dígitos
        email, 
        password 
      };

      console.log('Enviando dados para cadastro:', requestBody);

      const response = await fetch("http://localhost:8080/api/enterprises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log('Resposta da API:', response);

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        console.error('Erro na resposta:', errorData);
        throw new Error(errorData.message || "Erro ao cadastrar empresa");
      }

      const responseData = await response.json();
      console.log('Cadastro realizado com sucesso:', responseData);
      
      // Redireciona para a página de login com mensagem de sucesso
      navigate("/login", { state: { registrationSuccess: true, message: "Cadastro realizado com sucesso!" } });
    } catch (error) {
      console.error("Erro no cadastro:", error);
      if (error instanceof Error) {
        setRegisterError(error.message);
      } else {
        setRegisterError("Ocorreu um erro inesperado durante o cadastro");
      }
    } finally {
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
              width: "auto",
              height: "auto",
              maxWidth: "100%",
              maxHeight: "80vh"
            }}
          />
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Cadastro da Empresa</h1>
            <p className="text-gray-600">Preencha os dados da sua empresa</p>
          </div>

          <div className="animate-fade-in">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Voltar
            </button>
            
            {registerError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {registerError}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome da sua empresa"
                  className={`w-full px-4 py-3 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  disabled={isLoading}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={handleCnpjChange}
                  placeholder="00.000.000/0000-00"
                  className={`w-full px-4 py-3 border ${errors.cnpj ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  disabled={isLoading}
                  maxLength={18}
                />
                {errors.cnpj && <p className="text-red-500 text-sm mt-1">{errors.cnpj}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="empresa@email.com"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirme a Senha</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  disabled={isLoading}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors flex items-center justify-center"
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
                  "Cadastrar Empresa"
                )}
              </button>
            </form>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <a href="/login" className="text-green-600 hover:text-green-800 hover:underline">
                  Faça login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyRegister;