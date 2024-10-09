import { Document, Schema, model } from "mongoose";
export interface IGame extends Document {
  gameName: string;
  gameImage?: string;
  gameDescription?: string;
  reviews: Game[];
}
export interface GameType {
  gameName: string;
  gameImage?: string;
  gameDescription?: string;
  reviews: Game[];
}
export interface Game {
  text: string;
  rating: number;
  username: string;
  email: string;
  latitude?: string;
  longitude?: string;
}
const ReviewSchema: Schema = new Schema(
  {
    gameName: { type: String, required: true },
    gameImage: { type: String, default: "" },
    gameDescription: { type: String, default: "" },
    reviews: [
      {
        text: { type: String, default: "" },
        rating: { type: Number },
        username: { type: String, default: "" },
        email: { type: String, default: "" },
        latitude: { type: String, default: "" },
        longitude: { type: String, default: "" },
        createdAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);
export const GameModel = model<IGame>("game", ReviewSchema);
