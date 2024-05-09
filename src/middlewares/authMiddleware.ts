import * as jwt from "jsonwebtoken";

export const tokenVerification = (request, response, next) => {
  try {
    const authorizationString = request.headers.authorization;
    const token = authorizationString.split(" ")[1];
    const verification = jwt.verify(token, process.env.JWT_SECRET);
    if (verification) {
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
