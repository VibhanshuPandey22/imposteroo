import { Card } from "@/components/ui/card";

export function PlayerCard({ player, colors }) {
  return (
    <Card
      className="relative w-72 h-44 cursor-pointer overflow-hidden group"
      style={{ backgroundColor: colors?.bg, color: colors?.fg }}
    >
      {/* Default content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-200 group-hover:opacity-0">
        <p className="font-bold text-xl" style={{ color: colors?.fg }}>
          {player?.name}'s turn
        </p>
        <p className="text-sm" style={{ color: colors?.fg, opacity: 0.7 }}>
          Hover to reveal your word
        </p>
      </div>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ backgroundColor: colors?.bg }}
      >
        {player?.tag === "imposter" ? (
          <>
            <p className="text-sm font-semibold text-red-700 bg-red-50 rounded-lg px-3 py-1">
              {player?.msg}
            </p>
            <p className="text-lg font-bold" style={{ color: colors?.fg }}>
              Hint : {player?.word}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm" style={{ color: colors?.fg, opacity: 0.7 }}>
              {player?.msg}
            </p>
            <p className="text-lg font-bold" style={{ color: colors?.fg }}>
              {player?.word}
            </p>
          </>
        )}
      </div>
    </Card>
  );
}
