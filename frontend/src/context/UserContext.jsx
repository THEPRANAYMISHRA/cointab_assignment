import { createContext, useState } from "react";

export const UserContext = createContext("");

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [currentUser, setCurrentUser] = useState(1);

  return (
    <UserContext.Provider
      value={{ data, setData, currentUser, setCurrentUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
