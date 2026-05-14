import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { words } from "./data/word_bank.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:5173",
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/wordbank", (req, res) => {
  res.json(words);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/game/start", (req, res) => {
  const { players, categories } = req.body;
  console.log("players : ", players);
  console.log("categories : ", categories);

  // 1. filter the word bank
  const categorySet = new Set(categories.map((c) => c.toLowerCase()));
  const filtered = categorySet.has("all")
    ? words
    : words.filter((w) => categorySet.has(w.category.toLowerCase()));
  console.log("words filtered by category : ", filtered);

  // 2. select a random id form the filtered word bank
  const randomWordId = Math.floor(Math.random() * filtered.length);
  const randomWord = filtered[randomWordId];
  console.log("random word id is ", randomWordId);
  console.log("random word is ", randomWord);

  // 3. select a random id form the players array to decide who is the mposter
  const randomImposterId = Math.floor(Math.random() * players.length);
  const randomImposter = players[randomImposterId];
  console.log("random imposter id is ", randomImposterId);
  console.log("random imposter is ", randomImposter);

  // 4. decide who starts
  const randomStartingPlayerId = Math.floor(Math.random() * players.length);
  const randomStartingPlayer = players[randomStartingPlayerId];
  console.log("random starting player id is ", randomStartingPlayerId);
  console.log("random starting player is ", randomStartingPlayer);

  // 5. map the players with the word/hint
  const playerWordArray = [];
  for (let i = 0; i < players.length; i++) {
    if (i !== randomImposterId) {
      playerWordArray.push({
        name: players[i],
        tag: "player",
        word: randomWord.word,
        msg: "Your word is : ",
      });
    } else {
      playerWordArray.push({
        name: players[i],
        tag: "imposter",
        word: randomWord.hint,
        msg: "You are the imposter. Try to fit in!",
      });
    }
  }

  // const playerWordMap = new Map();
  // for (let i = 0; i < players.length; i++) {
  //   if (i !== randomImposterId) {
  //     playerWordMap.set(players[i], {
  //       tag: "player",
  //       word: randomWord.word,
  //       msg: "Your word is : ",
  //     });
  //   } else {
  //     playerWordMap.set(randomImposter, {
  //       tag: "imposter",
  //       word: randomWord.hint,
  //       msg: "You are the imposter. Try to fit in!",
  //     });
  //   }
  // }

  console.log("final player-word mapping array is : ", playerWordArray);

  res.json({
    success: true,
    playerWordArray: playerWordArray,
    startingPlayer: randomStartingPlayer,
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
