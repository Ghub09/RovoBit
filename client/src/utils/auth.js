import jwtDecode from "jwt-decode";
export const isTokenExpired = (token) => {
  if (!token || typeof token !== "string" || token.split('.').length !== 3) {
    console.warn("Token is missing or malformed");
    return true;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now()
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Failed to decode token:", error.message);
    return true;
  }
};
