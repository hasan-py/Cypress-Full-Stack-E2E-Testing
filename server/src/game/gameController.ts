import { Request, Response } from "express";
import { GameType, GameModel } from "./game";
export class GameController {
  async gameList(req: Request, res: Response): Promise<void> {
    try {
      const reviews = await GameModel.aggregate([
        {
          $project: {
            _id: 1,
            gameName: 1,
            gameImage: 1,
            gameDescription: 1,
            reviews: 1,
            createdAt: 1,
            updatedAt: 1,
            __v: 1,
            reviewCount: { $size: "$reviews" },
            avgRating: {
              $cond: {
                if: { $gt: [{ $size: "$reviews" }, 0] },
                then: {
                  $divide: [{ $sum: "$reviews.rating" }, { $size: "$reviews" }],
                },
                else: null,
              },
            },
          },
        },
        {
          $addFields: {
            reviewCount: {
              $cond: [{ $isArray: "$reviews" }, { $size: "$reviews" }, 0],
            },
          },
        },
        {
          $project: {
            _id: 1,
            gameName: 1,
            gameImage: 1,
            gameDescription: 1,
            reviews: 1,
            createdAt: 1,
            updatedAt: 1,
            __v: 1,
            reviewCount: 1,
            avgRating: {
              $cond: [{ $gt: ["$reviewCount", 0] }, "$avgRating", null],
            },
          },
        },
      ]).sort({ createdAt: -1 });
      res.json({ data: reviews });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async newGame(req: Request, res: Response): Promise<void> {
    try {
      const { gameName, gameImage, gameDescription } = req.body;
      if (!gameName) {
        res.status(400).json({ error: "gameName is required" });
        return;
      }
      const duplicate = await GameModel.findOne({ gameName });
      if (duplicate) {
        res.status(400).json({ error: "Duplicate game not allowed" });
        return;
      }
      const newReview: GameType = {
        gameName,
        gameImage: gameImage || "",
        gameDescription: gameDescription || "",
        reviews: [],
      };
      const review = new GameModel(newReview);
      await review.save();
      res
        .status(201)
        .json({ data: review, message: "Data created successfully" });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const { gameName, gameImage, gameDescription, review } = req.body;
      const gameId = req.params.id;
      const game = await GameModel.findById(gameId);
      if (!game) {
        res.status(404).json({ error: "Game not found" });
        return;
      }
      if (gameName) {
        game.gameName = gameName;
      }
      if (gameImage) {
        game.gameImage = gameImage;
      }
      if (gameDescription) {
        game.gameDescription = gameDescription;
      }
      if (review) {
        if (
          (!review.email || !review.text || !review.rating) &&
          !review.isDeleted
        ) {
          res
            .status(500)
            .json({ error: "[email, text, rating] are required field!" });
          return;
        }
        const reviewId = review._id?.toString();
        if (reviewId) {
          if (review.isDeleted) {
            const filterData = game?.reviews?.filter(
              (item: any) => item?._id?.toString() !== reviewId
            );
            game.reviews = filterData;
          } else {
            const mappedData = game?.reviews?.map((item: any) => {
              if (item?._id?.toString() === reviewId) {
                return review;
              }
              return item;
            });
            game.reviews = mappedData;
          }
        } else {
          game.reviews.push({ ...review, createdAt: new Date() });
        }
      }
      await game.save();
      res.json({ data: game, message: "Update successfully" });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const review = await GameModel.findByIdAndDelete(id);
      if (!review) {
        res.status(404).json({ error: "Review not found" });
        return;
      }
      res.json({ message: "Review deleted" });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async reviewById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const review = await GameModel.findById(id);

      if (!review) {
        res.status(404).json({ error: "Review not found" });
        return;
      }
      res.json({ data: review });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getMapData(req: Request, res: Response): Promise<void> {
    try {
      const data = await GameModel.aggregate([
        { $unwind: "$reviews" },
        {
          $project: {
            gameName: 1,
            "reviews.username": 1,
            "reviews.rating": 1,
            "reviews.email": 1,
            "reviews.latitude": 1,
            "reviews.longitude": 1,
            _id: 1,
          },
        },
      ]);
      res.json({ data });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
