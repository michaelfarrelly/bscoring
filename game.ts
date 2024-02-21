interface Frame {
  shot1: number;
  shot2: number | undefined;
  score: number;
  bonus: number;
  isStrike: boolean;
  isSpare: boolean;
}

class Game {
  frame: number = 0;
  shot: number = 0;
  scoreByFrame: Frame[];

  /**
   * @param pins number of pings knocked over.
   */
  roll(pins: number): void {
    if (this.shot == 0) {
      this.scoreByFrame.push({
        shot1: pins,
        shot2: undefined,
        score: pins,
        isStrike: pins === 10,
        isSpare: false,
        bonus: 0,
      });
    } else if (this.shot == 1) {
      this.scoreByFrame[this.frame].shot2 = pins;
    } else if (this.frame == 10) {
      // bonus shots on frame 10
      this.scoreByFrame[this.frame].bonus += pins;
    }

    if (this.frame > 0 && this.scoreByFrame[this.frame - 1].isStrike) {
      // previous frame was a strike
      this.scoreByFrame[this.frame - 1].bonus += pins;
    }

    // TODO check the previous shots, not just frame status.
    if (
      this.frame > 1 &&
      this.scoreByFrame[this.frame - 2].isStrike &&
      this.scoreByFrame[this.frame - 1].isStrike
    ) {
      this.scoreByFrame[this.frame - 2].bonus += pins;
    }

    if (
      this.frame > 0 &&
      this.shot == 0 &&
      this.scoreByFrame[this.frame - 1].isSpare
    ) {
      // previous frame was a spare
      this.scoreByFrame[this.frame - 1].bonus += pins;
    }

    // strike
    if (this.shot == 0 && pins === 10) {
      // this.scoreByFrame[this.frame].isStrike = true;
      // set score
      this.scoreByFrame[this.frame].score = 10;
      this.frame++;
      this.shot = 0;
      return;
    }
    // spare
    if (
      this.shot == 1 &&
      this.frame < 10 &&
      this.scoreByFrame[this.frame].shot1 +
        (this.scoreByFrame[this.frame].shot2 ?? 0) ===
        10
    ) {
      this.scoreByFrame[this.frame].isSpare = true;
      // set score of the frame.
      this.scoreByFrame[this.frame].score =
        this.scoreByFrame[this.frame].shot1 +
        (this.scoreByFrame[this.frame].shot2 ?? 0);
      this.frame++;
      this.shot = 0;
    }
    if (
      this.shot == 1 &&
      this.frame == 10 &&
      this.scoreByFrame[this.frame].shot1 +
        (this.scoreByFrame[this.frame].shot2 ?? 0) ===
        10
    ) {
      // this.scoreByFrame[this.frame].bonus += pins;
      // set score of the frame.
      // this.scoreByFrame[this.frame].score = this.scoreByFrame[this.frame].shot1 + (this.scoreByFrame[this.frame].shot2 ?? 0)

      this.shot++;
    }
    //this.shot ++;
  }

  /**
   * @returns total score for the game.
   */
  score(): number {
    return 0;
  }
}
