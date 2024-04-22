import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getAll = async (req: Request, res: Response) => {
  const positions = await prisma.position.findMany();

  return res.json({ positions });
};

const create = async (req: Request, res: Response) => {
  const position: { name: string } = req.body;

  await prisma.position.create({ data: position });
};

const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const position: { name: string } = req.body;

  const isAvailablePosition = await prisma.position.findUnique({
    where: {
      id,
    },
  });

  if (!isAvailablePosition) {
    return res.status(404).json({
      message: "Position not found",
    });
  }

  await prisma.position.update({
    data: position,
    where: { id },
  });

  return res.json({
    message: "Position updated",
  });
};

export const PositionController = { getAll, create, update };
