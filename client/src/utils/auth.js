  export const isTokenExpired = (token) => {
  if (!token || typeof token !== "string") return true;

  try {
    const base64Url = token.split(".")[1]; // JWT payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const { exp } = JSON.parse(jsonPayload);
    const currentTime = Date.now() / 1000; // seconds

    console.log("Now:     ", new Date(currentTime * 1000));
    console.log("Expires: ", new Date(exp * 1000));

    return exp < currentTime;
  } catch (error) {
    console.error("Token decode error:", error);
    return true;
  }
};

