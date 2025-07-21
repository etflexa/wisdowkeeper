import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import ContadorToken from "../../function/contadorToken";
import axios from "axios";

type User = {
  _id: string;
  type: string;
  name: string;
  lastName: string;
  cpf: string;
  email: string;
  enterpriseId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const EditarCadastro = () => {
  const [isSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json"
    }
  });

  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  // Get enterprise data from localStorage
  const enterpriseData = JSON.parse(localStorage.getItem("enterprise") || "null");
  const enterpriseId = enterpriseData?._id;
  const token = localStorage.getItem("jwt");

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    cpf: "",
    type: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const userTypes = ["Estagiário", "Desenvolvedor", "Supervisor", "Administrador"];

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!enterpriseId || !token || !userId) {
          throw new Error("Missing required parameters");
        }

        const response = await api.get<{ user: User }>(
          `/enterprises/${enterpriseId}/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const { name, lastName, email, cpf, type } = response.data.user;
        setFormData({ name, lastName, email, cpf, type });
      } catch (error: any) {
        handleApiError(error, "Erro ao carregar dados do usuário");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userId, enterpriseId, token]);

  const handleApiError = (error: any, defaultMessage: string) => {
    console.error("API Error:", error);
    
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("enterprise");
        setSubmitError("Sessão expirada - redirecionando para login...");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
      setSubmitError(error.response.data?.message || defaultMessage);
    } else if (error.request) {
      setSubmitError("Sem resposta do servidor. Verifique sua conexão.");
    } else {
      setSubmitError(error.message || defaultMessage);
    }
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
    if (!formData.type) newErrors.type = "Selecione um tipo de usuário";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await api.put(
        `/enterprises/${enterpriseId}/users`,
        {
          userId,
          type: formData.type,
          name: formData.name,
          lastName: formData.lastName
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSubmitSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error: any) {
      handleApiError(error, "Erro ao atualizar usuário");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token || !enterpriseId || !userId) {
    return (
      <div className="min-h-screen flex bg-gray-100">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 flex justify-center items-center">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Acesso não autorizado
            </h2>
            <p className="mb-4">
              {submitError || "Você precisa fazer login para acessar esta página"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-gray-100">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2">Carregando dados do usuário...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <ContadorToken />

      <div className="flex-1 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Editar Usuário</h1>

          {submitError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              Usuário atualizado com sucesso! Redirecionando...
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
                E-mail
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-1"
                  readOnly
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF
                <input
                  name="cpf"
                  type="text"
                  value={formData.cpf}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-1"
                  readOnly
                />
              </label>
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
                Salvando...
              </>
            ) : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarCadastro;