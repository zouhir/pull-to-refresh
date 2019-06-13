const AnimationEngine = {
}

AnimationEngine.bounceListView = (element, initialY) => {
    let keyframes = [
      {
        transform: `translateY(${initialY}px)`
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
      duration: 500
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


AnimationEngine.bendTree = (element, path1, path2) => {
  
  let keyframes = [
    { d: `path("${path1}")` },
    {
      d: `path("${path2}")`
    }
  ]
  
  let timing = {
    duration: 300
  }
  
  let animationInstance = new Animation(
    new KeyframeEffect(
      element,
      keyframes,
      timing
    )
  )
  
  let bendTreeAsyncAnimation = new AsyncAnimation(animationInstance)
  return bendTreeAsyncAnimation 
}

AnimationEngine.wobbleTree = (element, path1, path2, path3) => {
  
  let keyframes = [
    { 
      d: `path("${path1}")` 
    },
    {
      d: `path("${path2}")`
    },
    {
      d: `path("${path1}")`
    },
    {
      d: `path("${path3}")`
    },
    {
      d: `path("${path1}")`
    }
  ]
  
  let timing = {
    duration: 700
  }
  
  let animationInstance = new Animation(
    new KeyframeEffect(
      element,
      keyframes,
      timing
    )
  )
  
  let wobbleTreeAnimation = new AsyncAnimation(animationInstance)
  return wobbleTreeAnimation 
  
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