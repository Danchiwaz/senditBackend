import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.token as string;
  if (token) {
    jwt.verify(
      token,
      process.env.USER_ACCESS_TOKEN as string,
      (err: any, decodedToken: any) => {
        if (err) {
          return res.status(401).json({
            message: "You are not allowed to access this Page",
          });
        } else {
        //  console.log(decodedToken);
         
          next();
        }
      }
    );
  } else {
    return res.status(401).json({
      message: "You are not allowed to access this Page",
    });
  }
};
