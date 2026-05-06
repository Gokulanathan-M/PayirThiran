import { createContext, useState } from 'react';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [recommendationHistory, setRecommendationHistory] = useState([]);
  const [suitabilityHistory, setSuitabilityHistory] = useState([]);

  const addRecommendation = (rec) => setRecommendationHistory(prev => [rec, ...prev]);
  const addSuitability = (suit) => setSuitabilityHistory(prev => [suit, ...prev]);

  return (
    <AppContext.Provider value={{
      recommendationHistory,
      suitabilityHistory,
      addRecommendation,
      addSuitability,
    }}>
      {children}
    </AppContext.Provider>
  );
}
