import { Router } from "express";
import { AuthController } from "./auth";
export class AuthRoutes {
  router: Router;
  public authController: AuthController = new AuthController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    const {
      loginController,
      createModeratorIfNotExists,
      checkModeratorCreated,
    } = this.authController;
    this.router.post("/login", loginController);
    this.router.get("/check-moderator", checkModeratorCreated);
    this.router.post(`/create-moderator`, createModeratorIfNotExists);
  }
}
