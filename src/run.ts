import { Game } from "./game";

const game = new Game();

const argRolls: string = process.argv[2];
const validRolls = JSON.parse(argRolls);

for (const roll of validRolls) {
  game.roll(roll);
}

console.log(`Final score: ${game.finalScore()}`);
