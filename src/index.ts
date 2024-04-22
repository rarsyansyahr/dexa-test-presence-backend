import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {
  AppRouter,
  AuthRouter,
  FileRouter,
  PositionRouter,
  PresenceeRouter,
} from "./routes";
import { EmployeeRouter } from "./routes/employee";
import { JwtAuth } from "./middlewares";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dotenv.config();

dayjs.extend(utc);
dayjs.extend(timezone);

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", AppRouter);
app.use("/auth", AuthRouter);
app.use("/employees", JwtAuth, EmployeeRouter);
app.use("/positions", JwtAuth, PositionRouter);
app.use("/presences", JwtAuth, PresenceeRouter);
app.use("/files", FileRouter);

app.get("/", (req, res) => {
  return res.json({
    name: "Presence Backend App",
    status: "running",
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
