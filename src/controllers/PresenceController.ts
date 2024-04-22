import { PrismaClient, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getAll = async (req: Request, res: Response) => {
  const { employee_id } = req.params;
  const { started_at, ended_at } = req.query as {
    started_at: string;
    ended_at: string;
  };

  const query: Prisma.PresenceWhereInput = {
    employee: { id: employee_id },
  };

  if (started_at && ended_at)
    query.created_at = {
      gte: dayjs(started_at).toDate(),
      lte: dayjs(ended_at).toDate(),
    };

  const presences = await prisma.presence.findMany({
    where: query,
  });

  return res.json({
    presences: presences.map((item) => ({
      ...item,
      in_time: dayjs(item.in_time).format("HH:mm:ss"),
      out_time: dayjs(item.out_time).format("HH:mm:ss"),
      created_at: dayjs(item.created_at).format(),
    })),
  });
};

const presence = async (req: Request, res: Response) => {
  //@ts-ignore
  const userId: string = req.user.userId;
  const status: "in" | "out" = req.body.status;
  const isPresenceIn = status === "in";

  const lastPresence = await prisma.presence.findFirst({
    where: { employee: { user: { id: userId } } },
    orderBy: {
      created_at: "desc",
    },
  });

  const isActivePresence =
    lastPresence &&
    dayjs(lastPresence.created_at).format("YYYY-MM-DD") ===
      dayjs().format("YYYY-MM-DD");

  if (isPresenceIn) {
    if (isActivePresence)
      return res.status(404).json({ message: "You have attended today" });

    const employee = await prisma.employee.findFirst({
      where: { user_id: userId },
    });

    await prisma.presence.create({
      data: {
        in_time: new Date(),
        employee: { connect: { id: employee!.id } },
      },
    });
  }

  if (!isPresenceIn) {
    if (!isActivePresence)
      return res.status(404).json({ message: "You're not yet to presence in" });

    if (lastPresence.out_time)
      return res.json({ message: "You have presence today" });

    await prisma.presence.update({
      data: { out_time: new Date() },
      where: { id: lastPresence!.id },
    });
  }

  return res.status(isPresenceIn ? 201 : 200).json({
    status: isPresenceIn ? "in" : "out",
  });
};

const checkPresence = async (req: Request, res: Response) => {
  const { employee_id } = req.params;

  const presence = await prisma.presence.findFirst({
    where: {
      employee_id,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 1,
  });

  if (!presence)
    return res.status(404).json({ message: "You're not yet to presence in" });

  const isPresenceToday =
    dayjs(presence.created_at).format("YYYY-MM-DD") ===
    dayjs().format("YYYY-MM-DD");

  if (!isPresenceToday)
    return res.status(404).json({ message: "You're not yet to presence in" });

  return res.json({
    in_time: dayjs(presence.in_time).format("HH:mm:ss"),
    out_time: dayjs(presence.out_time).format("HH:mm:ss"),
  });
};

export const PresenceController = { getAll, presence, checkPresence };
