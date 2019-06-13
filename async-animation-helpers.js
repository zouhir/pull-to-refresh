const promiseRequestAnimationFrame = () => new Promise((resolve) => window.requestAnimationFrame(resolve));

class AsyncAnimation {
  constructor(animation) {
    this.animation = animation;
  }
  
  play () {
    this.animation.play();
    return new Promise((resolve) => {
      this.animation.onfinish = () => {
        resolve(this.animation)
      }
    })
  }
  
  setCurrentTime(t) {
    this.animation.currentTime = t;
  }
  
  cancel () {
    return new Promise((resolve) => {
      this.animation.oncancel = () => {
        resolve(this.animation)
      }
      this.animation.cancel();
    })
  }
  
  finish () {
    return new Promise((resolve) => {
      this.animation.onfinish = () => {
        resolve(this.animation)
      }
      this.animation.finish();
    })
  }
  
  reverse() {
    return new Promise((resolve) => {
      this.animation.onfinish = () => {
        resolve(this.animation)
      }
      this.animation.reverse();
    })
  }
}

class AsyncGroupAnimation {
  constructor(animations) {
    this.animations = animations;
  }
  
  play () {
    let promises = this.animations.map( animation => animation.play() )
    return Promise.all(promises)
  }
  
  setCurrentTime(t) {
    this.animations.forEach( animation => {
      animation.setCurrentTime(t);
    })
  }
  
  cancel () {
    let promises = this.animations.map( animation => animation.cancel())
    return Promise.all(promises)
  }
  
  finish () {
    return new Promise((resolve) => {
      this.animation.onfinish = () => {
        resolve(this.animation)
      }
      this.animation.finish();
    })
  }
  
  reverse() {
    let promises = this.animations.map( animation => animation.reverse() )
    return Promise.all(promises)
  }
}