import React, { createContext, useState, useContext, ReactNode } from 'react';

type ProyectosContextType = {
  selectedProyectos: ProyectoSeleccionado[];
  toggleProyecto: (proyecto: ProyectoSeleccionado) => void;
  removeProyecto: (id: number) => void;
};

const ProyectosContext = createContext<ProyectosContextType | undefined>(undefined);

interface ProyectosProviderProps {
  children: ReactNode;
}

export const ProyectosProvider: React.FC<ProyectosProviderProps> = ({ children }) => {
  const [selectedProyectos, setSelectedProyectos] = useState<ProyectoSeleccionado[]>([]);

  const toggleProyecto = (proyecto: ProyectoSeleccionado) => {
    setSelectedProyectos(prev => {
      const exists = prev.find(p => p.id === proyecto.id);
      if (exists) {
        return prev.filter(p => p.id !== proyecto.id);
      } else {
        return [...prev, proyecto].slice(0, 5);
      }
    });
  };

  const removeProyecto = (id: number) => {
    setSelectedProyectos(ps => ps.filter(p => p.id !== id));
  };

  return (
    <ProyectosContext.Provider value={{ selectedProyectos, toggleProyecto, removeProyecto }}>
      {children}
    </ProyectosContext.Provider>
  );
};

// Hook para consumirlo
export const useProyectosSelection = () => {
  const ctx = useContext(ProyectosContext);
  if (!ctx) throw new Error('useProyectosSelection must be used within a ProyectosProvider');
  return ctx;
};
