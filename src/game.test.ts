// import { describe, expect, it } from "@jest/globals";

// describe("game", () => {
//   it("isSpare", () => {
//     expect(isSpare({ shots: [10], score: 10, bonus: 0 })).toBe(false);
//   });
// });
import { describe, expect, test } from "vitest";
import { Game, getFrameScore, isSpare, isStrike, lastShots } from "./game";

describe("utility methods", () => {
  describe("isSpare", () => {
    test("two shots totaling 10 is a spare", () => {
      expect(isSpare({ shots: [10, 0], score: 10, bonus: 0 })).toBe(true);
      expect(isSpare({ shots: [2, 8], score: 10, bonus: 0 })).toBe(true);
    });
    test("strike is not a spare", () => {
      expect(isSpare({ shots: [10], score: 10, bonus: 0 })).toBe(false);
    });
    test("single shot is not a spare", () => {
      expect(isSpare({ shots: [5], score: 5, bonus: 0 })).toBe(false);
    });
  });

  describe("isStrike", () => {
    test("two shots totaling 10 is a not a strike", () => {
      expect(isStrike({ shots: [10, 0], score: 10, bonus: 0 })).toBe(false);
      expect(isStrike({ shots: [2, 8], score: 10, bonus: 0 })).toBe(false);
    });
    test("strike is successful", () => {
      expect(isStrike({ shots: [10], score: 10, bonus: 0 })).toBe(true);
    });
    test("single shot is not a strike", () => {
      expect(isStrike({ shots: [5], score: 5, bonus: 0 })).toBe(false);
    });
  });

  describe("getFrameScore", () => {
    test("sums the shots values", () => {
      expect(getFrameScore({ shots: [10, 0], score: 10, bonus: 0 })).toBe(10);
      expect(getFrameScore({ shots: [2, 8], score: 10, bonus: 0 })).toBe(10);
      expect(getFrameScore({ shots: [2], score: 2, bonus: 0 })).toBe(2);
      expect(getFrameScore({ shots: [10, 3, 4], score: 17, bonus: 0 })).toBe(
        17
      );
      expect(getFrameScore({ shots: [0, 0], score: 0, bonus: 0 })).toBe(0);

      expect(getFrameScore({ shots: [0], score: 0, bonus: 0 })).toBe(0);
    });
  });

  describe("game", () => {
    test("perfect game (12 strikes)", () => {
      let game = new Game();

      // perfect game, 12 strikes
      const rolls = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
      for (const roll of rolls) {
        game.roll(roll);
      }

      expect(
        game.scoreByFrame.map((f, i) => ({ frame: i + 1, ...f }))
      ).toStrictEqual([
        {
          bonus: 20,
          frame: 1,
          score: 10,
          shots: [10],
        },
        {
          bonus: 20,
          frame: 2,
          score: 10,
          shots: [10],
        },
        {
          bonus: 20,
          frame: 3,
          score: 10,
          shots: [10],
        },
        {
          bonus: 20,
          frame: 4,
          score: 10,
          shots: [10],
        },
        {
          bonus: 20,
          frame: 5,
          score: 10,
          shots: [10],
        },
        {
          bonus: 20,
          frame: 6,
          score: 10,
          shots: [10],
        },
        {
          bonus: 20,
          frame: 7,
          score: 10,
          shots: [10],
        },
        {
          bonus: 20,
          frame: 8,
          score: 10,
          shots: [10],
        },
        {
          bonus: 20,
          frame: 9,
          score: 10,
          shots: [10],
        },
        {
          bonus: 20,
          frame: 10,
          score: 10,
          shots: [10, 10, 10],
        },
      ]);
      expect(game.finalScore()).toBe(300);
    });
  });

  describe("game", () => {
    test("short game sums the shots values", () => {
      let game = new Game();

      // perfect game
      const rolls = [10, 10, 10];
      for (const roll of rolls) {
        game.roll(roll);
      }

      expect(game.scoreByFrame).toStrictEqual([
        {
          bonus: 20,
          score: 10,
          shots: [10],
        },
        {
          bonus: 10,
          score: 10,
          shots: [10],
        },
        {
          bonus: 0,
          score: 10,
          shots: [10],
        },
        {
          bonus: 0,
          score: 0,
          shots: [],
        },
      ]);
      expect(game.finalScore()).toBe(60);
    });
  });

  describe("game", () => {
    test("normal short game", () => {
      let game = new Game();

      // perfect game
      const rolls = [2, 3, 4, 5];
      for (const roll of rolls) {
        game.roll(roll);
      }
      expect(game.scoreByFrame).toStrictEqual([
        {
          bonus: 0,
          score: 5,
          shots: [2, 3],
        },
        {
          bonus: 0,
          score: 9,
          shots: [4, 5],
        },
        {
          bonus: 0,
          score: 0,
          shots: [],
        },
      ]);
      expect(game.finalScore()).toStrictEqual(14);
    });
  });

  describe("game", () => {
    test("scoring a spare", () => {
      let game = new Game();

      // perfect game
      const rolls = [2, 8, 4, 5];
      for (const roll of rolls) {
        game.roll(roll);
      }
      expect(game.scoreByFrame).toStrictEqual([
        {
          bonus: 4,
          score: 10,
          shots: [2, 8],
        },
        {
          bonus: 0,
          score: 9,
          shots: [4, 5],
        },
        {
          bonus: 0,
          score: 0,
          shots: [],
        },
      ]);
      expect(game.finalScore()).toStrictEqual(23);
    });
  });

  describe("lastShots", () => {
    test("shows all the shots", () => {
      expect(
        lastShots(
          [
            {
              bonus: 0,
              score: 5,
              shots: [2, 3],
            },
            {
              bonus: 0,
              score: 9,
              shots: [4, 5],
            },
          ],
          3
        )
      ).toStrictEqual([3, 4, 5]);

      expect(
        lastShots(
          [
            {
              bonus: 0,
              score: 10,
              shots: [10],
            },
            {
              bonus: 0,
              score: 10,
              shots: [10],
            },
            {
              bonus: 0,
              score: 10,
              shots: [10],
            },
          ],
          3
        )
      ).toStrictEqual([10, 10, 10]);
    });
  });
});
