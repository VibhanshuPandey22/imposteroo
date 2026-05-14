"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useState } from "react";
import { X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { CATEGORIES } from "@/data/categories";

const formSchema = z.object({
  playerName: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(20, "Name must be at most 20 characters."),
});

export function Form() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [players, setPlayers] = useState([]);

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { playerName: "" },
  });

  const allSelected = selectedCategories.length === CATEGORIES.length;

  function toggleCategory(id) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(CATEGORIES.map((c) => c.id));
    }
  }

  function addPlayer(data) {
    if (players.includes(data.playerName.trim())) {
      form.setError("playerName", { message: "Player already added." });
      return;
    }
    setPlayers((prev) => [...prev, data.playerName.trim()]);
    form.reset();
  }

  function removePlayer(name) {
    setPlayers((prev) => prev.filter((p) => p !== name));
  }

  async function onSubmit() {
    if (players.length < 3) {
      toast.error("Add at least 3 players to start.");
      return;
    }
    console.log("players frontend: ", players);
    console.log(
      "categories frontend: ",
      allSelected ? ["all"] : selectedCategories,
    );
    try {
      const response = await fetch("/api/game/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          players, // ["Alice", "Bob", "Charlie"]
          categories: allSelected ? ["all"] : selectedCategories, // [1, 3, 5]
        }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      console.log("data :", data);

      // Navigate and pass data via state
      navigate("/play", {
        state: {
          playerWordArray: data.playerWordArray,
          startingPlayer: data.startingPlayer,
        },
      });
      toast.success("Game started!");
    } catch (err) {
      toast.error("Failed to start game. Try again.", err);
    }
  }

  return (
    <Card className="w-full sm:max-w-md bg-slate-50">
      <CardHeader>
        <CardTitle>New Game</CardTitle>
        <CardDescription>Choose categories and add players.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Categories</p>
            <button
              type="button"
              onClick={toggleAll}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                allSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {allSelected ? (
                <>
                  <Check size={11} /> All Selected
                </>
              ) : (
                "Select All"
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className={`relative flex flex-col items-start gap-0.5 rounded-lg border p-3 text-left transition-all hover:border-primary ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check size={10} />
                    </span>
                  )}
                  <span className="text-lg">{category.emoji}</span>
                  <span className="text-sm font-medium">{category.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {category.description}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedCategories.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Select at least one category to continue.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {selectedCategories.length} categor
              {selectedCategories.length !== 1 ? "ies" : "y"} selected.
            </p>
          )}
        </div>

        {/* Players Section */}
        {selectedCategories.length > 0 && (
          <>
            {/* Player Tags */}
            {players.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {players.map((name) => (
                  <span
                    key={name}
                    className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm font-medium"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => removePlayer(name)}
                      className="ml-1 rounded-full p-0.5 hover:bg-destructive hover:text-white transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add Player Form */}
            <form id="add-player-form" onSubmit={form.handleSubmit(addPlayer)}>
              <FieldGroup>
                <Controller
                  name="playerName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="player-name-input">
                        Add Player
                      </FieldLabel>
                      <div className="flex gap-2">
                        <Input
                          {...field}
                          id="player-name-input"
                          placeholder="Enter player name"
                          autoComplete="off"
                          aria-invalid={fieldState.invalid}
                        />
                        <Button type="submit">Add</Button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>

            {/* Player count */}
            {players.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {players.length} player{players.length !== 1 ? "s" : ""} added.{" "}
                {players.length < 3
                  ? `Need at least ${3 - players.length} more.`
                  : "Ready to start!"}
              </p>
            )}
          </>
        )}
      </CardContent>

      <CardFooter>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={selectedCategories.length === 0 || players.length < 3}
          className="w-full"
        >
          Start Game
        </Button>
      </CardFooter>
    </Card>
  );
}
