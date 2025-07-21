import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import ContadorToken from "../../function/contadorToken";
import axios from "axios";

const Cadastro = () => {
  const [isSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 60000
  });

  const getAuthData = () => {
    try {
      const enterpriseData = JSON.parse(localStorage.getItem('enterprise') || '{}');
      return {
        enterpriseId: enterpriseData?._id,
        token: localStorage.getItem('jwt')
      };
    } catch (error) {
      console.error("Erro ao ler localStorage:", error);
      return { enterpriseId: null, token: null };
    }
  };

  const { enterpriseId, token } = getAuthData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    cpf: "",
    type: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const userTypes = ["Estagiário", "Desenvolvedor", "Supervisor", "Administrador"];

  useEffect(() => {
    if (!token || !enterpriseId) {
      setSubmitError("Autenticação necessária. Redirecionando para login...");
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [token, enterpriseId, navigate]);

  const validateCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf[10]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
    setSubmitError("");
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.lastName.trim()) newErrors.lastName = "Sobrenome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "E-mail é obrigatório";
    if (!formData.cpf.trim()) newErrors.cpf = "CPF é obrigatório";
    if (!formData.type) newErrors.type = "Selecione um tipo de usuário";

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }
    if (formData.cpf && !validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const { enterpriseId: currentEnterpriseId, token: currentToken } = getAuthData();
    
    if (!currentEnterpriseId || !currentToken) {
      setSubmitError("Empresa não identificada. Redirecionando...");
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // 1. Register user
      const response = await api.post(`/enterprises/${currentEnterpriseId}/users`, {
        type: formData.type,
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ""),
      }, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json"
        }
      });

      console.log("Full registration response:", response);
      
      // Try multiple possible ID paths in the response
      const userId = response.data?._id || 
                    response.data?.user?._id || 
                    response.data?.data?._id ||
                    response.data?.id;

      if (!userId) {
        throw new Error("API response does not contain user ID. Full response: " + JSON.stringify(response.data));
      }

      console.log("Extracted user ID:", userId);
      
      // 2. Send credentials
      try {
        const emailResponse = await api.post(
          `/enterprises/${currentEnterpriseId}/users/credentials`,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
              "Content-Type": "application/json"
            }
          }
        );
        
        console.log("Credentials email response:", emailResponse.data);
        setSubmitSuccess(true);
        setSubmitError("");
        setFormData({ name: "", lastName: "", email: "", cpf: "", type: "" });
      } catch (emailError: any) {
        console.error("Email sending error:", {
          error: emailError,
          response: emailError.response?.data,
          status: emailError.response?.status
        });
        
        setSubmitSuccess(true);
        setSubmitError("Usuário cadastrado com sucesso, mas o envio de credenciais falhou. " + 
                      (emailError.response?.data?.message || ""));
        setFormData({ name: "", lastName: "", email: "", cpf: "", type: "" });
      }
    } catch (error: any) {
      console.error("Registration error:", {
        error,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response) {
        if (error.response.status === 401) {
          localStorage.removeItem('jwt');
          localStorage.removeItem('enterprise');
          setSubmitError("Sessão expirada. Redirecionando...");
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        setSubmitError(error.response.data?.message || 
                      error.response.data?.error || 
                      "Erro ao cadastrar usuário");
      } else if (error.request) {
        setSubmitError("Sem resposta do servidor. Verifique sua conexão.");
      } else {
        setSubmitError(error.message || "Erro ao processar a requisição");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token || !enterpriseId) {
    return (
      <div className="min-h-screen flex bg-gray-100">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 flex justify-center items-center">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Acesso não autorizado
            </h2>
            <p className="mb-4">{submitError || "Você precisa fazer login para acessar esta página"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <ContadorToken/>

      <div className="flex-1 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Cadastro de Usuário</h1>

          {submitError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {submitError}
            </div>
          )}

          {submitSuccess && !submitError && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              Usuário cadastrado com sucesso! As credenciais de acesso foram enviadas para o email informado.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg mt-1 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Digite o nome"
                />
              </label>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sobrenome *
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg mt-1 ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Digite o sobrenome"
                />
              </label>
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail *
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg mt-1 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="exemplo@empresa.com"
                />
              </label>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF *
                <input
                  name="cpf"
                  type="text"
                  value={formData.cpf}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg mt-1 ${
                    errors.cpf ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="000.000.000-00"
                />
              </label>
              {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Usuário *
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg mt-1 ${
                    errors.type ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Selecione...</option>
                  {userTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-6 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium ${
              isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cadastrando...
              </>
            ) : "Cadastrar Usuário"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;