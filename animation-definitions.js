const AnimationEngine = {
}

AnimationEngine.bounceListView = (element, initialY) => {
    let keyframes = [
      {
        transform: `translateY(${initialY}px)`
      },
      {
        transform: `translateY(-47px)`
      },
      {
        transform: `translateY(40px)`
      },
      {
        transform: `translateY(-33px)`
      },
      {
        transform: `translateY(25px)`
      },
      {
        transform: `translateY(-10px)`
      },
      {
        transform: `translateY(5px)`
      },
      {
        transform: `translateY(0px)`
      }
    ]
    
    let timing = {
      duration: 1800
    }
    
    let animationInstance = new Animation(
      new KeyframeEffect(
        element,
        keyframes,
        timing
      )
    )
    
    let bounceAsyncAnimation = new AsyncAnimation(animationInstance)
    return bounceAsyncAnimation
}

AnimationEngine.flyAirPlane = (element) => {
  
  let keyframes = [
      {
        transform: `translate(0, 0) rotate(-30deg) scale(1)`
      },
      {
        transform: `translate(600px, -200px) rotate(-30deg) scale(1)`
      },
      {
        transform: ` translate(800px, -300px) rotate(-160deg) scale(1)`
      },
      {
        transform: ` translate(-600px, -100px) rotate(-180deg) scale(0.7)`
      },
      {
        transform: `rotate(0deg)`
      }
    ]
    
    let timing = {
      duration: 7000
    }
    
    
    let animationInstance = new Animation(
      new KeyframeEffect(
        element,
        keyframes,
        timing
      )
    )
    
    let flyAnimation = new AsyncAnimation(animationInstance)
    return flyAnimation
  
}

AnimationEngine.translateMountain = (element, duration) => {
  
  let keyframes = [
    {
      transform: `translateY(0px)`
    },
    {
      transform: `translateY(180px)`
    }
  ]
  
  let timing = {
    duration: duration
  }
  
  let animationInstance = new Animation(
    new KeyframeEffect(
      element,
      keyframes,
      timing
    )
  )
  
  let translateMountainAnimation = new AsyncAnimation(animationInstance)
  return translateMountainAnimation 
  
}


AnimationEngine.darkenSky = (animationName, element, scrollTimeline, timeRange) => {
  let animation = new WorkletAnimation(
    animationName,
    new KeyframeEffect(
      element,
      [
        { background: `#7bceca` },
        {
          background: `#000`
        }
      ],
      { duration: timeRange }
    ),
    scrollTimeline
  )
  
  return animation; 
}