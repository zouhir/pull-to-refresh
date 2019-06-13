registerAnimator(
  "good-night-animation",
  class {
    animate(currentTime, effect) {
      effect.localTime = currentTime;
    }
  }
);
