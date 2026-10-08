import { createContext, useContext, useState } from 'react';

const RegistrationContext = createContext();

export function RegistrationProvider({ children }) {
  const [registrationData, setRegistrationData] = useState(null);

  const clearRegistrationData = () => {
    setRegistrationData(null);
  }; /* //(MDN Web Docs, 2026) */

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
} /* //(MDN Web Docs, 2026) */


/* Reference List:
    1. MDN Web Docs, 2026. Resources for Developers, by Developers. [online] Available at: <https://developer.mozilla.org/en-US/> [Accessed 8 October 2026]. */