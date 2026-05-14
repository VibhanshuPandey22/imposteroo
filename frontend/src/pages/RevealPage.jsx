import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { cardColors } from "@/data/cardColors";

const RevealPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const startingPlayer = state?.startingPlayer ?? "Unknown";
  const players = state?.playerWordArray ?? [];
  const randomColorInd = state?.randomColorInd ?? 0;
  const randomColor = cardColors[randomColorInd];

  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!state) {
      navigate("/");
      return;
    }
  }, [state, navigate]);

  const imposter = players?.find((p) => p.tag === "imposter");
  const word = players?.find((p) => p.tag === "player")?.word;

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-sm mx-auto">
      {!revealed && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            Who goes first?
          </p>
          <Card className="w-full text-center">
            <CardContent className="pt-6 pb-6 space-y-2">
              <p className="text-4xl">🎲</p>
              <p className="text-2xl font-bold">{startingPlayer}</p>
              <p className="text-sm text-muted-foreground">starts the game!</p>
            </CardContent>
          </Card>
        </div>
      )}

      {!revealed ? (
        <Button className="w-full" onClick={() => setRevealed(true)}>
          Reveal Imposter and Word
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-4 w-full ">
          <Card
            style={{ backgroundColor: randomColor?.bg + "1A" }}
            className="w-full text-center"
          >
            <CardContent className="pt-4 pb-4  space-y-2">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
                The Word
              </p>
              <p className="text-3xl font-bold">{word}</p>
            </CardContent>
          </Card>

          <Card className="w-full text-center border-destructive bg-red-50">
            <CardContent className="pt-4 pb-4 space-y-2">
              <p className="text-sm font-bold text-destructive uppercase tracking-wide">
                The Imposter
              </p>
              <p className="text-3xl font-bold">{imposter?.name}</p>
            </CardContent>
          </Card>

          <Button className="w-full" onClick={() => navigate("/")}>
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default RevealPage;
