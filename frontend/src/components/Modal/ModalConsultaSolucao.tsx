import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean; // Controla se o modal está aberto ou fechado
  onClose: () => void; // Função para fechar o modal
  title: string; // Título do modal
  children: React.ReactNode; // Conteúdo do modal
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null; // Não renderiza o modal se não estiver aberto

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 overflow-hidden">
        {/* Cabeçalho do modal com fundo azul */}
        <div className="bg-blue-600 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>

        {/* Corpo do modal */}
        <div className="p-6 text-gray-700 dark:text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
}