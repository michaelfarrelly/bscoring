export class Game {
  private frameNumber: number = 1; // starting at 1
  scoreByFrame: Frame[] = [
    {
      rolls: [],
      score: 0,
      bonus: 0,
    },
  ];

  /**
   * Set the number of pins knocked, and adjust frame
   * when conditions for strike, spare, or open frame are met.
   *
   * @param pins number of pins knocked over.
   */
  roll(pins: number): void {
    const currentFrameIndex = this.frameNumber - 1;
    const currentFrame = this.scoreByFrame[currentFrameIndex];
    const prevFrame = this.scoreByFrame[currentFrameIndex - 1];
    const twoPrevFrame = this.scoreByFrame[currentFrameIndex - 2];
    const currentRoll = currentFrame.rolls.length + 1;

    if (this.frameNumber == 10 && currentFrame.rolls.length == 3) {
      throw Error("No more rolls allowed!");
    }

    currentFrame.rolls.push(pins);

    // when previous frame is a strike, add pins to its bonus
    if (this.frameNumber > 1 && this.frameNumber < 10 && isStrike(prevFrame)) {
      prevFrame.bonus += pins;
    }

    // when 2-previous frame was a strike, add pins to bonus.
    if (
      this.frameNumber > 2 &&
      this.frameNumber < 10 &&
      isStrike(twoPrevFrame) &&
      currentRoll == 1 &&
      isStrike(prevFrame)
    ) {
      twoPrevFrame.bonus += pins;
    }
    // conditions of the last frame
    if (this.frameNumber == 10) {
      if (currentRoll == 1 && isStrike(twoPrevFrame) && isStrike(prevFrame)) {
        twoPrevFrame.bonus += pins;
      }
      if (currentRoll < 3 && isStrike(prevFrame)) {
        prevFrame.bonus += pins;
      }
      if (currentRoll > 1 && currentRoll < 3 && isStrike(currentFrame)) {
        currentFrame.bonus += pins;
      }
      // from a strike or spare, just add the pin count to the bonus
      if (currentRoll == 3) {
        currentFrame.bonus += pins;
      }
    }

    if (
      this.frameNumber > 1 &&
      this.frameNumber <= 10 &&
      currentRoll == 1 &&
      isSpare(prevFrame)
    ) {
      prevFrame.bonus += pins;
    }

    if (this.frameNumber < 10) {
      // user rolls a strike or spare, or just rolls 2 other pin counts
      if (isStrike(currentFrame) || isSpare(currentFrame) || currentRoll == 2) {
        this.advanceFrame();
      }
    } else if (
      this.frameNumber == 10 &&
      // strike or spare
      (isStrike(currentFrame) || isSpare(currentFrame)) &&
      getFrameScore(currentFrame) === 10
    ) {
      currentFrame.score = getFrameScore(currentFrame);
      // don't advance to the next frame
    }
  }

  private getCurrentFrame(): Frame {
    return this.scoreByFrame[this.frameNumber - 1];
  }

  private advanceFrame(): void {
    // write the score for current frame
    this.getCurrentFrame().score = getFrameScore(this.getCurrentFrame());

    // advanced frame number
    this.frameNumber++;

    // insert the next frame
    this.scoreByFrame.push({
      rolls: [],
      score: 0,
      bonus: 0,
    });
  }

  /**
   * @returns total score for the game.
   */
  finalScore(): number {
    return this.scoreByFrame.reduce((prevFrameScore, currentFrame) => {
      return prevFrameScore + currentFrame.score + currentFrame.bonus;
    }, 0);
  }
}

interface Frame {
  rolls: number[];
  score: number;
  bonus: number;
}

/**
 * Get the roll values
 */
export function getFrameScore(frame: Frame): number {
  // sum up the frame's rolls
  return frame.rolls.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
}

/**
 * Test if the frame is a Strike
 * - at least 1 roll (frame 10 can have more than 1 roll)
 * - first roll is 10.
 */
export function isStrike(frame: Frame): boolean {
  return frame.rolls.length >= 1 && frame.rolls[0] === 10;
}

/**
 * Test if the frame is a Spare
 * - only 2 shot
 * - sum of rolls is 10
 */
export function isSpare(frame: Frame): boolean {
  return (
    frame.rolls.length > 1 &&
    frame.rolls.slice(0, 2).reduce((prev, curr) => {
      return prev + curr;
    }, 0) === 10
  );
}
