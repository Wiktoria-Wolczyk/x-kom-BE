import * as jwt from "jsonwebtoken";

export const tokenVerification = (request, response, next) => {
  try {
    if (request.method === "POST" && request.originalUrl === "/orders") {
      return next();
    }
    const authorizationString = request.headers.authorization;
    const token = authorizationString?.split(" ")[1];
    const verification = jwt.verify(token, process.env.JWT_SECRET);
    if (verification) {
      const decodedToken = jwt.decode(token) as jwt.JwtPayload;

      request.user = {
        id: decodedToken.id,
        email: decodedToken.email,
      };
      next();
    }
  } catch (error) {
    console.error(error);
    response.status(404).json({
      status: "failed",
      message: "authorization failed",
    });
  }
};
