import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

// Helper to extract token from header (for optional unified use)
const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};

// Admin Authentication Middleware
export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.adminToken;

  console.log("Admin Token (cookie):", token);

  if (!token) {
    return next(new ErrorHandler("Admin login required", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded Token:", decoded);

    const user = await User.findById(decoded.id);
    console.log("Fetched User:", user);

    if (!user) {
      return next(new ErrorHandler("User not found", 403));
    }

    if (user.role.toLowerCase() !== "admin") {
      return next(new ErrorHandler(`${user.role} is not authorized as admin`, 403));
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Admin token verification failed:", err);
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});

// User Authentication Middleware
export const isUserAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.userToken;

  console.log("User Token (cookie):", token);

  if (!token) {
    return next(new ErrorHandler("User login required", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded Token:", decoded);

    const user = await User.findById(decoded.id);
    console.log("Fetched User:", user);

    if (!user) {
      return next(new ErrorHandler("User not found", 403));
    }

    if (user.role.toLowerCase() !== "user") {
      return next(new ErrorHandler(`${user.role} is not authorized as user`, 403));
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("User token verification failed:", err);
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});





// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
// import ErrorHandler from "../middlewares/errorMiddleware.js";

// const getTokenFromRequest = (req) => {
//   // Check cookies first
//   const cookieToken = req.cookies.userToken || req.cookies.adminToken;
//   if (cookieToken) return cookieToken;

//   // Check Authorization header
//   const authHeader = req.headers.authorization;
//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     return authHeader.split(" ")[1];
//   }

//   return null;
// };

// export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
//   const token = getTokenFromRequest(req);

//   if (!token) {
//     return next(new ErrorHandler("You need to Sign In First", 503));
//   }

//   try {
//     const decodedTokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     const user = await User.findById(decodedTokenData._id);

//     if (!user) {
//       return next(new ErrorHandler("You Need To Register As Admin First", 403));
//     }

//     req.user = user;
//     if (!user.role === "Admin") {
//       return next(new ErrorHandler(`${req.user.role} Is Not Authorized`, 403));
//     }
//     next();
//   } catch (error) {
//     return next(new ErrorHandler("Invalid or expired token", 401));
//   }
// });

// export const isUserAuthenticated = catchAsyncErrors(async (req, res, next) => {
//   const token = getTokenFromRequest(req);

//   if (!token) {
//     return next(new ErrorHandler("You need to Sign In First", 503));
//   }

//   try {
//     const decodedTokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     const user = await User.findById(decodedTokenData._id);

//     if (!user) {
//       return next(new ErrorHandler("You Need To Register As User First", 403));
//     }

//     req.user = user;
//     if (!user.role === "user") {
//       return next(new ErrorHandler(`${req.user.role} Is Not Authorized`, 403));
//     }
//     next();
//   } catch (error) {
//     return next(new ErrorHandler("Invalid or expired token", 401));
//   }
// });
