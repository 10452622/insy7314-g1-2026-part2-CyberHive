import { createContext, useContext, useState } from 'react';

const RegistrationContext = createContext();

export function RegistrationProvider({ children }) {
  const [registrationData, setRegistrationData] = useState(null);

  const clearRegistrationData = () => {
    setRegistrationData(null);
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrationData,
        setRegistrationData,
        clearRegistrationData
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  return useContext(RegistrationContext);
}