import bcrypt from "bcrypt";
import { PrismaClient, UserLevel } from "@prisma/client";
import { Request, Response } from "express";
import { AppConfig } from "../config";

const prisma = new PrismaClient();

const getAll = async (req: Request, res: Response) => {
  const employees = await prisma.employee.findMany({ include: { user: true } });

  return res.json({ employees });
};

const getOne = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const employee = await prisma.employee.findUnique({
    where: {
      id,
    },
    include: { user: true },
  });

  const photo_path = `${AppConfig.Hostname}/uploads/${employee!.photo_path}`;

  return res.json({ ...employee, photo_path });
};

const create = async (req: Request, res: Response) => {
  const { name, email, password, position_id, phone_number, photo_path } =
    req.body;

  await prisma.user.create({
    data: {
      email,
      name,
      password,
      level: UserLevel.employee,
      employee: {
        create: {
          phone_number,
          photo_path,
          position_id,
        },
      },
    },
  });

  return res.status(201).json({ message: "Employee created" });
};

const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, position_id, phone_number, photo_path, password } = req.body;

  await prisma.employee.update({
    data: {
      phone_number,
      photo_path,
      position_id,
      user: {
        update: {
          data: {
            name,
            ...(password && { password: await bcrypt.hash(password, 8) }),
          },
        },
      },
    },
    where: { id },
  });

  return res.status(201).json({ message: "Employee updated" });
};

export const EmployeController = { getAll, getOne, create, update };
