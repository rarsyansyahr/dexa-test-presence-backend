import { Presence, Prisma, PrismaClient, UserLevel } from "@prisma/client";
import bcrypt from "bcrypt";
import dayjs from "dayjs";

const prisma = new PrismaClient();

async function main() {
  // * Clear Tables
  async function clearTables() {
    const tables = ["presences", "employees", "users"];
    const query = `truncate table ${tables.join(",")};`;
    await prisma.$executeRaw(Prisma.sql([query]));
  }

  // * Seeding Positions
  async function createPositions() {
    await prisma.position.createMany({
      data: [{ name: "Operator" }, { name: "Packing" }, { name: "Finishing" }],
    });
  }

  // * Seeding HR
  async function createHr() {
    await prisma.user.create({
      data: {
        email: "hr@example.com",
        password: await bcrypt.hash("hr123", 8),
        name: "Rizky Arsyansyah Rinjani",
        level: UserLevel.hr,
      },
    });
  }

  async function createEmployees() {
    const users = [
      {
        email: "operator@example.com",
        password: await bcrypt.hash("operator123", 8),
        name: "Andika Nur Rizky",
        level: UserLevel.employee,
        employee: {
          phone_number: "081311338822",
          photo_path: "male.png",
          position: "Operator",
        },
      },
      {
        email: "packing@example.com",
        password: await bcrypt.hash("packing123", 8),
        name: "Nurkho Vaiq",
        level: UserLevel.employee,
        employee: {
          phone_number: "081311338827",
          photo_path: "male.png",
          position: "Packing",
        },
      },
      {
        email: "finishing@example.com",
        password: await bcrypt.hash("finishing123", 8),
        name: "Evelyn Pricilia",
        level: UserLevel.employee,
        employee: {
          phone_number: "081311337822",
          photo_path: "female.png",
          position: "Finishing",
        },
      },
    ];

    const positions = await prisma.position.findMany();

    users.forEach(async (user) => {
      const { employee, ...partials } = user;

      await prisma.user.create({
        data: {
          ...partials,
          employee: {
            create: {
              phone_number: employee.phone_number,
              photo_path: employee.photo_path,
              position: {
                connect: {
                  id: positions.find(
                    (position) => position.name === employee.position
                  )?.id,
                },
              },
            },
          },
        },
      });
    });
  }

  async function createPresences() {
    const employees = await prisma.employee.findMany();

    const randomNumber = () => Math.floor(Math.random() * 60);

    const presences = employees.map((employee) =>
      Array(5)
        .fill(0)
        .map((_, idx) => {
          const presenceDate = dayjs().subtract(idx, "d");

          const item: Omit<Presence, "id" | "updated_at"> = {
            in_time: presenceDate
              .set("h", 7)
              .set("m", randomNumber())
              .set("s", randomNumber())
              .toDate(),
            out_time: presenceDate
              .set("h", 16)
              .set("m", randomNumber())
              .set("s", randomNumber())
              .toDate(),
            created_at: presenceDate.toDate(),
            employee_id: employee.id,
          };

          return item;
        })
    );

    presences.forEach(
      async (presence) => await prisma.presence.createMany({ data: presence })
    );
  }

  Promise.all([
    await clearTables(),
    console.info("1. Tables clear"),

    await createPositions(),
    console.info("2. Positions seeding"),

    await createHr(),
    console.info("3. HR seeding"),

    await createEmployees(),
    console.info("4. Employees seeding"),

    await createPresences(),
    console.info("5. Presences seeding"),
  ]);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
