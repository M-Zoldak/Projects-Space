import { useState } from "react";
// import { useNavigate } from "react-router-dom";

export default function useToken() {
  // const navigate = useNavigate();

  const getToken = () => {
    let tokenTime = localStorage.getItem("token-created");
    // if (
    //   !tokenTime ||
    //   new Date().getTime() - Number.parseInt(tokenTime) > 86000
    // ) {
    //   localStorage.setItem("token", "");
    //   localStorage.setItem("token-created", "");
    //   navigate("/home");
    //   return "";
    // }
    return localStorage.getItem("token");
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (token: string) => {
    localStorage.setItem("token", token);
    // localStorage.setItem("token-created", new Date().getTime().toString());
    setToken(token);
  };

  return {
    setToken: saveToken,
    token,
  };
}
