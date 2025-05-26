export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; // exp is in seconds
    const currentTime = Date.now();

    return currentTime >= expiryTime;
  } catch (error) {
    console.error("JWT decode error:", error.message); // optional
    return true; // treat as expired
  }
};
