import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppConfig } from "../config";

export const JwtAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token.split(" ")[1], AppConfig.JwtSecretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // @ts-ignore
    req.user = user;
    next();
  });
};
