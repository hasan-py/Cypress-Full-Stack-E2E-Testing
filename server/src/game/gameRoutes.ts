import { Router } from "express";
import { GameController } from "./gameController";
export class GameRoutes {
  router: Router;
  public gameController: GameController = new GameController();
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    const {
      gameList,
      newGame,
      updateReview,
      deleteReview,
      reviewById,
      getMapData,
    } = this.gameController;
    this.router.get(`/list-review`, gameList);
    this.router.post("/new-review", newGame);
    this.router.get(`/get-review/:id`, reviewById);
    this.router.put(`/update-review/:id`, updateReview);
    this.router.delete(`/delete-review/:id`, deleteReview);
    this.router.get(`/map-data`, getMapData);
  }
}
