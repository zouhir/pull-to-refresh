registerAnimator(
  "wobble",
  class {
    animate(currentTime, effect) {
      effect.localTime = currentTime / 20;
    }
  }
);
