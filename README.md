Demo Pull to Refresh
=================

Demo URL: [https://pull-to-refresh.glitch.me](https://pull-to-refresh.glitch.me)


## Current Observe Implementation

#### Base Observer Class

```js
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
```

#### Observing Paper Plane element animation

```js

let paperPlaneElement = document.querySelector('.paperplane');

let paperPlaneMoveObserver = new AnimationObserver(paperPlaneElement, 'left', 0)

// what would you like to do when the plane is moving?
paperPlaneMoveObserver.observe = function ( { value, delta } ) {
  
  if( value > 200 ) {
    tiltTrees(...)
  } else {
    doSomething(...)
  }
  
}

paperPlaneMoveObserver.start();

//when finished
paperPlaneMoveObserver.cancel();

```