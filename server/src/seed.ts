import mongoose from "mongoose";
import { MONGODB_URI_CLOUD, MONGODB_URI_LOCAL } from "./auth/secret";
import { GameModel } from "./game/game";

mongoose.connect(MONGODB_URI_LOCAL || MONGODB_URI_CLOUD);

const db = mongoose.connection;

db.once("open", async () => {
  const existingData = await GameModel.findOne();
  if (existingData) {
    return;
  }

  const exampleGame: any[] = [
    {
      gameName: "Overwatch 2",
      gameImage: "https://www.freetogame.com/g/540/thumbnail.jpg",
      gameDescription:
        "A hero-focused first-person team shooter from Blizzard Entertainment.",
      reviews: [
        {
          text: "Exciting gameplay and diverse characters!",
          rating: 5,
          username: "overwatchfan",
          email: "overwatch@example.com",
          latitude: "40.7128",
          longitude: "-74.0060",
        },
        {
          text: "Could use more content, but still enjoyable.",
          rating: 4,
          username: "gamer123",
          email: "gamer@example.com",
          latitude: "51.5074",
          longitude: "-0.1278",
        },
      ],
    },
    {
      gameName: "Diablo Immortal",
      gameImage: "https://www.freetogame.com/g/521/thumbnail.jpg",
      gameDescription:
        "Built for mobile and also released on PC, Diablo Immortal fills in the gaps between Diablo II and III in an MMOARPG environment.",
      reviews: [
        {
          text: "Addictive gameplay, but could use better optimization.",
          rating: 4,
          username: "diablofan",
          email: "diablo@example.com",
          latitude: "35.6895",
          longitude: "139.6917",
        },
      ],
    },
    {
      gameName: "Lost Ark",
      gameImage: "https://www.freetogame.com/g/517/thumbnail.jpg",
      gameDescription:
        "Smilegate’s free-to-play multiplayer ARPG is a massive adventure filled with lands waiting to be explored, people waiting to be met, and an ancient evil waiting to be destroyed.",
      reviews: [
        {
          text: "Incredible world design and engaging combat!",
          rating: 5,
          username: "arkexplorer",
          email: "lostark@example.com",
          latitude: "37.5665",
          longitude: "126.9780",
        },
        {
          text: "Fun, but too much grinding.",
          rating: 3,
          username: "casualgamer",
          email: "casual@example.com",
          latitude: "40.7128",
          longitude: "-74.0060",
        },
      ],
    },
    {
      gameName: "PUBG: BATTLEGROUNDS",
      gameImage: "https://www.freetogame.com/g/516/thumbnail.jpg",
      gameDescription:
        "Get into the action in one of the longest running battle royale games PUBG Battlegrounds.",
      reviews: [
        {
          text: "Intense matches and satisfying gunplay!",
          rating: 4,
          username: "pubgplayer",
          email: "pubg@example.com",
          latitude: "37.7749",
          longitude: "-122.4194",
        },
      ],
    },
    {
      gameName: "Enlisted",
      gameImage: "https://www.freetogame.com/g/508/thumbnail.jpg",
      gameDescription:
        "Get ready to command your own World War II military squad in Gaijin and Darkflow Software’s MMO squad-based shooter Enlisted.",
      reviews: [
        {
          text: "Realistic and immersive experience!",
          rating: 5,
          username: "historybuff",
          email: "enlisted@example.com",
          latitude: "52.5200",
          longitude: "13.4050",
        },
      ],
    },
    {
      gameName: "Forge of Empires",
      gameImage: "https://www.freetogame.com/g/345/thumbnail.jpg",
      gameDescription:
        "A free to play 2D browser-based online strategy game, become the leader and raise your city.",
      reviews: [
        {
          text: "Addictive city-building gameplay!",
          rating: 4,
          username: "citybuilder",
          email: "forgeofempires@example.com",
          latitude: "51.5074",
          longitude: "-0.1278",
        },
      ],
    },
    {
      gameName: "Genshin Impact",
      gameImage: "https://www.freetogame.com/g/475/thumbnail.jpg",
      gameDescription:
        "If you’ve been looking for a game to scratch that open-world action RPG itch, one with perhaps a bit of Asian flair, then you’re going to want to check out miHoYo’s Genshin Impact.",
      reviews: [
        {
          text: "Stunning visuals and engaging combat!",
          rating: 5,
          username: "adventurer",
          email: "genshin@example.com",
          latitude: "35.6895",
          longitude: "139.6917",
        },
      ],
    },
    {
      gameName: "Fall Guys",
      gameImage: "https://www.freetogame.com/g/523/thumbnail.jpg",
      gameDescription:
        "Play the most competitive massively multiplayer party royale game featuring beans ever for free on a variety of platforms.",
      reviews: [
        {
          text: "Hilarious chaos and addictive gameplay!",
          rating: 5,
          username: "beanlover",
          email: "fallguys@example.com",
          latitude: "51.5074",
          longitude: "-0.1278",
        },
        {
          text: "Great fun with friends, but needs more content.",
          rating: 4,
          username: "partygamer",
          email: "party@example.com",
          latitude: "37.7749",
          longitude: "-122.4194",
        },
      ],
    },
  ];

  try {
    await GameModel.create(exampleGame);
    console.log("Example data inserted successfully.");
  } catch (error) {
    console.error("Error inserting example data:", error);
  } finally {
  }
});

db.on("error", console.error.bind(console, "MongoDB connection error:"));
