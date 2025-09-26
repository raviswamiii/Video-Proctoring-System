import {jwtDecode} from "jwt-decode";

export const checkTokenExpiration = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem("token");
      window.location.href = "/logIn";
      return true;
    }
  } catch (error) {
    console.error("Invalid token", error);
    localStorage.removeItem("token");
    return true;
  }
  return false;
};
