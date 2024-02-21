interface Frame {
  shots: number[];
  score: number;
  bonus: number;
  //   isStrike: boolean;
  //   isSpare: boolean;
}

/**
 * Get the shot values
 */
export function getFrameScore(frame: Frame): number {
  // sum up the frame's shots
  return frame.shots.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
}

/**
 * Test if the frame is a Strike
 * - only 1 shot
 * - first shot is 10 pins.
 */
export function isStrike(frame: Frame): boolean {
  return frame.shots.length == 1 && frame.shots[0] === 10;
}

/**
 * Test if the frame is a Spare
 * - only 2 shot
 * - sum of shots is 10 pins.
 */
export function isSpare(frame: Frame): boolean {
  return frame.shots.length > 1 && getFrameScore(frame) === 10;
}

export function lastShots(frames: Frame[], num: number = 3): number[] {
  const maxIndex = frames.length - 1;
  const x = frames.reduceRight((prev, curr) => {
    return [...curr.shots, ...prev];
  }, [] as number[]);

  return x.slice(-num);
}

export class Game {
  frameNumber: number = 1; // starting at 1.
  // shot: number = 0;
  scoreByFrame: Frame[] = [
    {
      shots: [],
      score: 0,
      bonus: 0,
    },
  ];

  /**
   * @param pins number of pings knocked over.
   */
  roll(pins: number): void {
    const currentFrameIndex = this.frameNumber - 1;
    const currentFrame = this.scoreByFrame[currentFrameIndex];
    const currentShot = this.scoreByFrame[currentFrameIndex].shots.length + 1; // 1-base numbers
    currentFrame.shots.push(pins);
    console.log(
      `${this.frameNumber}/${currentShot}: [${currentFrame.shots.join(",")}]`
    );

    // when previous frame is a strike, add pins to its bonus
    if (
      this.frameNumber > 1 &&
      (this.frameNumber < 10 || (this.frameNumber == 10 && currentShot == 1)) &&
      isStrike(this.scoreByFrame[currentFrameIndex - 1])
    ) {
      // previous frame was a strike
      // console.log(`${this.frame}: prev was strike`);
      console.log(
        `${this.frameNumber}/${currentShot}/bonus to ${
          currentFrameIndex - 1
        }: ${pins}`
      );
      this.scoreByFrame[currentFrameIndex - 1].bonus += pins;
    }

    // when 2-previous frame was a strike, add pins to bonus.
    if (
      this.frameNumber > 2 &&
      this.frameNumber < 10 &&
      isStrike(this.scoreByFrame[currentFrameIndex - 2]) &&
      isStrike(this.scoreByFrame[currentFrameIndex - 1])
    ) {
      // console.log(`${this.frame}: prev 2x was strike`);
      console.log(
        `${this.frameNumber}/${currentShot}/bonus to ${
          currentFrameIndex - 2
        }: ${pins}`
      );
      this.scoreByFrame[currentFrameIndex - 2].bonus += pins;
    }
    if (
      this.frameNumber == 10 &&
      currentShot == 1 &&
      isStrike(this.scoreByFrame[currentFrameIndex - 2]) &&
      isStrike(this.scoreByFrame[currentFrameIndex - 1])
    ) {
      console.log(
        `${this.frameNumber}/${currentShot}/10 bonus to ${
          currentFrameIndex - 2
        }: ${pins}`
      );
      this.scoreByFrame[currentFrameIndex - 2].bonus += pins;
    }
    if (
      this.frameNumber == 10 &&
      currentShot == 2 &&
      isStrike(this.scoreByFrame[currentFrameIndex - 1])
    ) {
      console.log(
        `${this.frameNumber}/${currentShot}/10 bonus to ${currentFrameIndex}: ${pins}`
      );
      this.scoreByFrame[currentFrameIndex].bonus += pins;
    }
    if (
      this.frameNumber == 10 &&
      currentShot == 3 &&
      this.scoreByFrame[currentFrameIndex].shots[0] == 10
    ) {
      console.log(
        `${this.frameNumber}/${currentShot}/10 bonus to ${currentFrameIndex}: ${pins}`
      );
      this.scoreByFrame[currentFrameIndex].bonus += pins;
    }

    if (
      this.frameNumber > 1 &&
      currentShot == 1 &&
      isSpare(this.scoreByFrame[currentFrameIndex - 1])
    ) {
      // previous frame was a spare
      console.log(
        `${this.frameNumber}/${currentShot}/bonus to ${
          currentFrameIndex - 1
        }: ${pins}`
      );
      this.scoreByFrame[currentFrameIndex - 1].bonus += pins;
    }

    // user rolls a strike
    if (
      currentShot == 1 &&
      this.frameNumber < 10 &&
      isStrike(this.scoreByFrame[currentFrameIndex])
    ) {
      this.advanceFrame();
      return;
    }

    // user rolls a spare
    if (
      currentShot == 2 &&
      this.frameNumber < 10 &&
      isSpare(this.scoreByFrame[currentFrameIndex])
    ) {
      this.advanceFrame();
      return;
    }
    if (
      this.frameNumber == 10 &&
      getFrameScore(this.scoreByFrame[currentFrameIndex]) === 10
    ) {
      this.scoreByFrame[this.frameNumber - 1].score = getFrameScore(
        this.scoreByFrame[this.frameNumber - 1]
      );
      console.log(`allow more shots`);
      // allow more shots
      return;
    }

    // normally only allow 2 shots except on frame 10.
    if (this.frameNumber != 10 && currentShot == 2) {
      this.advanceFrame();
    }
  }

  advanceFrame(): void {
    console.log(`advance frame`);
    // write the score
    this.scoreByFrame[this.frameNumber - 1].score = getFrameScore(
      this.scoreByFrame[this.frameNumber - 1]
    );

    this.frameNumber++;
    this.scoreByFrame.push({
      shots: [],
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
