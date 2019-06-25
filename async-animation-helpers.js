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


class AnimationObserver {
  constructor(element, property = 'top', initial = 0) {
    // the element we are observing
    this.element = element;
    // what rect property we are wanting to observe: right, left, top, bottom, width, height 
    this.property = property;
    // initial value of property we observing so we can report "delta"
    this.initial = initial;
    // keeping a refrence of raf timer so we can cancel it
    this.raf = null;
    
    //**
    // The callback that represents our timeline
    // functions hooked into this get "value" and "delta" of the property on element we are observing
    //**
    this.observe = null;
  }
  
  start() {
    this.raf = window.requestAnimationFrame(this.calculate.bind(this));
  }
  
  calculate() {
    if( this.observe !== null ) {
      let value = this.element.getBoundingClientRect()[ this.property ]
      let delta = value - this.initial
      this.observe({ value, delta })
    }
    this.raf = window.requestAnimationFrame(this.calculate.bind(this))
  }
  
  // cancel \ detach the observer when not needed
  cancel() {
    window.cancelAnimationFrame(this.raf)
  }
  
}