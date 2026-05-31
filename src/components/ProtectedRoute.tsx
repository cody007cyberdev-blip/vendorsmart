import React from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAppStore, Role } from '../store/useAppStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const user = useAppStore((state) => state.user);

  // Se não estiver logado, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se houver restrição de roles e o usuário não tiver permissão
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md border border-gray-200">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar esta área com o perfil <strong>{user.role}</strong>.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
