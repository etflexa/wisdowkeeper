import { useState, useEffect } from 'react';

interface User {
  id: string;
  nome: string;
  email: string;
  perfil: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          // Verifica se não está vazio e é um JSON válido
          if (storedUser.trim() && storedUser !== 'undefined') {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user'); // Limpa dados inválidos
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData: User) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    setUser(null);
  };

  return { 
    user, 
    loading,
    login, 
    logout,
    isAuthenticated: !!user
  };
}