import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppConfig } from "../config";
import dayjs from "dayjs";

const prisma = new PrismaClient();

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ message: "User not found" });

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch)
    return res.status(404).json({ message: "User not found" });

  const payload = { userId: user.id, name: user.name, level: user.level };
  const expiration = "1h";
  const token = jwt.sign(payload, AppConfig.JwtSecretKey, {
    expiresIn: expiration,
  });

  res.json({ token });
};

const profile = async (req: Request, res: Response) => {
  // @ts-ignore
  const { userId } = req.user;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      employee: {
        include: { presences: { orderBy: { created_at: "desc" }, take: 1 } },
      },
    },
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.employee) {
    const json = {
      ...user,
      employee: {
        ...user.employee,
        photo_path: `${AppConfig.Hostname}/uploads/${user.employee.photo_path}`,
        presences: {},
      },
    };

    if (user.employee.presences.length > 0) {
      json.employee.presences = {
        ...user.employee.presences[0],
        in_time: dayjs(user.employee.presences[0]?.in_time).format("HH:mm:ss"),
        out_time: dayjs(user.employee.presences[0]?.out_time).format(
          "HH:mm:ss"
        ),
        created_at: dayjs(user.employee.presences[0]?.created_at).format(),
      };
    }

    return res.json(json);
  }

  return res.json(user);
};

export const AuthController = {
  login,
  profile,
};
