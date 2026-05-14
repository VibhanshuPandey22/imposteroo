import { PlayerCard } from "@/components/shared/PlayerCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cardColors } from "@/data/cardColors";

const GamePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  //   const [players, setPlayers] = useState(state?.playerWordArray ?? []);
  // useEffect(() => {
  //     console.log("players", players);
  //   }, [players]);
  const players = state?.playerWordArray ?? [];
  const colorsLength = cardColors.length;
  const [colorOffset, _] = useState(() =>
    Math.floor(Math.random() * colorsLength),
  );

  console.log("players : ", players);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!state) {
      navigate("/");
      return;
    }
  }, [state, navigate]);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === players?.length - 1;

  return (
    <div className="flex flex-col items-center gap-5 justify-center">
      <p className="text-sm text-muted-foreground">
        Player {currentIndex + 1} of {players?.length}
      </p>
      <div className="min-w-72">
        <PlayerCard
          player={players[currentIndex]}
          colors={cardColors[(colorOffset + currentIndex) % colorsLength]}
        />
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          disabled={isFirst}
          onClick={() => setCurrentIndex((i) => i - 1)}
        >
          <ChevronLeft size={16} /> Prev
        </Button>
        <Button
          variant="outline"
          disabled={isLast}
          onClick={() => setCurrentIndex((i) => i + 1)}
        >
          Next <ChevronRight size={16} />
        </Button>
      </div>
      <div>
        <Button
          variant="outline"
          disabled={!isLast}
          onClick={() =>
            navigate("/reveal", {
              state: {
                playerWordArray: state.playerWordArray,
                startingPlayer: state.startingPlayer,
                randomColorInd: colorOffset,
              },
            })
          }
        >
          Let's see who starts
        </Button>
      </div>
    </div>
  );
};

export default GamePage;
