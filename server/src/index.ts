import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ConnectMongoDB } from "./auth/mongoDbConnection";
import { AuthRoutes } from "./auth/authRoutes";
import { GameRoutes } from "./game/gameRoutes";
import "./seed";
class Server {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
    ConnectMongoDB();
    this.routes();
  }
  public config(): void {
    this.app.set("port", process.env.PORT || 8000);
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(morgan("tiny"));
    this.app.use(express.static("public"));
    this.app.use(
      cors({
        origin: ["http://localhost:5173/", "http://'127.0.0.1:8081/"],
        methods: "GET,POST,PUT,DELETE,OPTIONS",
      })
    );
    this.app.use(express.json());
  }
  public routes(): void {
    this.app.use("/api/auth", new AuthRoutes().router);
    this.app.use(`/api/review`, new GameRoutes().router);

    this.app.get("/*", (req, res) => {
      res.status(400);
    });
  }
  public start(): void {
    this.app.listen(this.app.get("port"), () => {
      console.log(`Server Running at http://localhost:${this.app.get("port")}`);
    });
  }
}
export const server = new Server();
server.start();
