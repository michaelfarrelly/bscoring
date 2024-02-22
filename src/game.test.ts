import { describe, expect, test } from "vitest";
import { Game, getFrameScore, isSpare, isStrike } from "./game";

describe("utility methods", () => {
  describe("isSpare", () => {
    test("two shots totaling 10 is a spare", () => {
      expect(isSpare({ rolls: [10, 0], score: 10, bonus: 0 })).toBe(true);
      expect(isSpare({ rolls: [2, 8], score: 10, bonus: 0 })).toBe(true);
    });
    test("strike is not a spare", () => {
      expect(isSpare({ rolls: [10], score: 10, bonus: 0 })).toBe(false);
    });
    test("single shot is not a spare", () => {
      expect(isSpare({ rolls: [5], score: 5, bonus: 0 })).toBe(false);
    });
  });

  describe("isStrike", () => {
    test("two shots totaling 10 is a not a strike", () => {
      expect(isStrike({ rolls: [1, 9], score: 10, bonus: 0 })).toBe(false);
      expect(isStrike({ rolls: [2, 8], score: 10, bonus: 0 })).toBe(false);
    });
    test("strike is successful", () => {
      expect(isStrike({ rolls: [10], score: 10, bonus: 0 })).toBe(true);
    });
    test("single shot is not a strike", () => {
      expect(isStrike({ rolls: [5], score: 5, bonus: 0 })).toBe(false);
    });
  });

  describe("getFrameScore", () => {
    test("sums the shots values", () => {
      expect(getFrameScore({ rolls: [10, 0], score: 10, bonus: 0 })).toBe(10);
      expect(getFrameScore({ rolls: [2, 8], score: 10, bonus: 0 })).toBe(10);
      expect(getFrameScore({ rolls: [2], score: 2, bonus: 0 })).toBe(2);
      expect(getFrameScore({ rolls: [10, 3, 4], score: 17, bonus: 0 })).toBe(
        17
      );
      expect(getFrameScore({ rolls: [0, 0], score: 0, bonus: 0 })).toBe(0);

      expect(getFrameScore({ rolls: [0], score: 0, bonus: 0 })).toBe(0);
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
          rolls: [10],
        },
        {
          bonus: 20,
          frame: 2,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 20,
          frame: 3,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 20,
          frame: 4,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 20,
          frame: 5,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 20,
          frame: 6,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 20,
          frame: 7,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 20,
          frame: 8,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 20,
          frame: 9,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 20,
          frame: 10,
          score: 10,
          rolls: [10, 10, 10],
        },
      ]);
      expect(game.finalScore()).toBe(300);
    });

    test("almost perfect game", () => {
      let game = new Game();

      // almost perfect, spare in frame 10, and a bonus 5
      const rolls = [
        10, 10, 10, 10, 10, 10, 10, 10, 10, /* spare: */ 2, 8,
        /* extra throw: */ 5,
      ];
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
          rolls: [10],
        },
        {
          bonus: 20,
          frame: 2,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 20,
          frame: 3,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 20,
          frame: 4,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 20,
          frame: 5,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 20,
          frame: 6,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 20,
          frame: 7,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 12,
          frame: 8,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 10,
          frame: 9,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 5,
          frame: 10,
          score: 10,
          rolls: [2, 8, 5],
        },
      ]);
      expect(game.finalScore()).toBe(267);
    });

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
          rolls: [10],
        },
        {
          bonus: 10,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 0,
          score: 10,
          rolls: [10],
        },
        {
          bonus: 0,
          score: 0,
          rolls: [],
        },
      ]);
      expect(game.finalScore()).toBe(60);
    });

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
          rolls: [2, 3],
        },
        {
          bonus: 0,
          score: 9,
          rolls: [4, 5],
        },
        {
          bonus: 0,
          score: 0,
          rolls: [],
        },
      ]);
      expect(game.finalScore()).toStrictEqual(14);
    });

    test("scoring a spare", () => {
      let game = new Game();

      // first frame spare, following by a non-spare, non-strike
      const rolls = [2, 8, 4, 5];
      for (const roll of rolls) {
        game.roll(roll);
      }
      expect(game.scoreByFrame).toStrictEqual([
        {
          bonus: 4,
          score: 10,
          rolls: [2, 8],
        },
        {
          bonus: 0,
          score: 9,
          rolls: [4, 5],
        },
        {
          bonus: 0,
          score: 0,
          rolls: [],
        },
      ]);
      expect(game.finalScore()).toStrictEqual(23);
    });

    test("throws error when rolling more than 12 rolls", () => {
      expect(() => {
        let game = new Game();
        const rolls = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
        for (const roll of rolls) {
          game.roll(roll);
        }
      }).toThrowError(/No more rolls allowed/);
    });
  });
});
