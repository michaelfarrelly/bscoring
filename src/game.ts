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

export class Game {
  frame: number = 0;
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
    const currentFrame = this.scoreByFrame[this.frame];
    const currentShot = this.scoreByFrame[this.frame].shots.length;
    currentFrame.shots.push(pins);
    console.log(
      `${this.frame}/${currentShot}: [${currentFrame.shots.join(",")}]`
    );

    // when previous frame is a a strike, add pins to its bonus
    if (this.frame > 0 && isStrike(this.scoreByFrame[this.frame - 1])) {
      // previous frame was a strike
      // console.log(`${this.frame}: prev was strike`);
      this.scoreByFrame[this.frame - 1].bonus += pins;
    }

    // TODO check the previous shots, not just frame status.
    if (
      this.frame > 1 &&
      isStrike(this.scoreByFrame[this.frame - 2]) &&
      isStrike(this.scoreByFrame[this.frame - 1])
    ) {
      // console.log(`${this.frame}: prev 2x was strike`);
      this.scoreByFrame[this.frame - 2].bonus += pins;
    }

    if (
      this.frame > 0 &&
      currentShot == 0 &&
      isSpare(this.scoreByFrame[this.frame - 1])
    ) {
      // previous frame was a spare
      this.scoreByFrame[this.frame - 1].bonus += pins;
    }

    // strike
    if (isStrike(this.scoreByFrame[this.frame])) {
      // this.scoreByFrame[this.frame].isStrike = true;
      // set score
      // this.scoreByFrame[this.frame].score = 10;
      this.advanceFrame();
      return;
    }

    // spare
    if (
      currentShot == 1 &&
      this.frame < 10 &&
      isSpare(this.scoreByFrame[this.frame])
    ) {
      //   this.scoreByFrame[this.frame].isSpare = true;
      // set score of the frame.
      // this.scoreByFrame[this.frame].score = getFrameScore(
      //   this.scoreByFrame[this.frame]
      // );
      this.advanceFrame();
      return;
    }
    if (
      this.frame == 10 &&
      getFrameScore(this.scoreByFrame[this.frame]) === 10
    ) {
      // this.scoreByFrame[this.frame].bonus += pins;
      // set score of the frame.
      // this.scoreByFrame[this.frame].score = this.scoreByFrame[this.frame].shot1 + (this.scoreByFrame[this.frame].shot2 ?? 0)
      // this.shot++;

      // allow more shots
      return;
    }

    // normally only allow 2 shots
    if (currentShot == 1) {
      this.advanceFrame();
    }
  }

  advanceFrame(): void {
    console.log(`advance frame`);
    // write the score
    this.scoreByFrame[this.frame].score = getFrameScore(
      this.scoreByFrame[this.frame]
    );

    this.frame++;
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
