const $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);


if (!("animationWorklet" in CSS)) {
  $('.warning').style.display = "block";
}

// register animation worklets
Promise.all([ /* CSS.animationWorklet.addModule("worklets/parallax.js") */, CSS.animationWorklet.addModule("worklets/good-night-animation.js")]).then(function(values) {
  pageReady()
});

function pageReady () {
  scrollTimeLine()
  // elements selectors
  const appEl = $("#app");
  const dragEl = $(".action-bar");
  const listviewEl = $(".listview");
  const fakeScrollEl = $(".fake");  
  const trees = getTrees();
  const mtnLow = $(".mtn-low");
  const mtnMiddle = $(".mtn-middle");
  const mtnTop = $(".mtn-top");
  const plane = $(".plane");
  const actionBtn = $(".action-button");
  
  const translateMountainLow = AnimationEngine.translateMountain(mtnLow, 500)
  const translateMountainMiddle = AnimationEngine.translateMountain(mtnMiddle, 900)
  const translateMountainTop = AnimationEngine.translateMountain(mtnTop, 1200)  
  const flyAirPlaneAnimation = AnimationEngine.flyAirPlane(plane)  

  
  let listviewPositionObserver = new AnimationObserver(listviewEl, 'top', listviewEl.getBoundingClientRect().top)
  let planePositionObserver = new AnimationObserver(plane, 'left', listviewEl.getBoundingClientRect().left)
  
  listviewPositionObserver.observe = function(val) {
    let { delta } = val
    updateTree(trees, delta)
  }
  
  planePositionObserver.observe = function(val) {
    let { delta } = val  
    updateTree(trees, delta / 20 )
  }
  
  actionBtn.addEventListener('click', () => {
    planePositionObserver.start();
    flyAirPlaneAnimation.play().then(_ => {
      planePositionObserver.cancel();
      _prevRafDelta = 0;
    })
  })
  
  
  let panResponder = new PanResponder( dragEl, {} );
  
  panResponder.onPanResponderInit = function() {
    listviewPositionObserver.start()
  }
  
  panResponder.onPanResponderMove = function(delta) {
    let absDelta = Math.abs(delta);
    if( absDelta > 200  ) return;
    listviewEl.style.transform = `translateY(${absDelta}px)`;
    //updateTree(trees, delta)
    translateMountainLow.setCurrentTime(delta * -1)
    translateMountainMiddle.setCurrentTime(delta * -1)
    translateMountainTop.setCurrentTime(delta * -1)
  }
  
  panResponder.onPanResponderRelease = function (delta) {
    
    let absDelta = Math.abs(delta);
    AnimationEngine.bounceListView(listviewEl, delta).play().then( animationInstance => {
      console.log('Async: bouncing list view is done')
      animationInstance.cancel();
      listviewEl.style.transform = `translateY(0px)`
      listviewPositionObserver.cancel();
    })
    translateMountainLow.setCurrentTime(0)
    translateMountainMiddle.setCurrentTime(0)
    translateMountainTop.setCurrentTime(0)
  }
}


/**
**
** UTILITY FUNCTIONS
**
**/

// finds tree SVG paths
// returns an array for tree leaves, trunk and tilt direction and refernce to the element
function getTrees() {
  let trees = [];
  for (let i = 1; i <= 5; i++) {
    let trunkElm = $(`#trunk-${i}`);
    let leavesElm = $(`#leaves-${i}`);
    trees.push(trunkElm);
    trees.push(leavesElm);
  }
  return trees;
}


function scrollTimeLine() {
  const scrollSource = $("#app");
  const timeRange = 10;
  const scrollTimeline = new ScrollTimeline({ scrollSource, timeRange });
  
  const header = $(".header")
  
  let animationName = "good-night-animation";
  let animation = AnimationEngine.darkenSky(animationName, header, scrollTimeline, timeRange)
  
  animation.play();
}

function updateTree (trees, delta = 0) {
  
  const INITIAL_VALUES = [309.209, 309.209, 283,  283,  254.505,  254.505,  65.5,  65.5,  40.4525,      40.4525, ]
  const INITIAL_PATHS_FNS = [
    // trunk 1
    (results) => `M310.55 308C310.103 293.694 309.656 279.388 ${results} 265.082C308.762 279.388 308.315 293.471 307.868 307.329`,
    //leaves 1
    (results) => `M309.209 294.588C324.633 294.588 314.574 273.129 ${results} 251C303.844 273.129 293.785 294.588 309.209 294.588Z`,
    
    // trunk 2
    (results) => `M285 306C284.333 284.667 283.667 263.333 ${results} 242C282.333 263.333 281.667 284.333 281 305`,
    // leaves 2
    (results) => `M283 286C306 286 291 254 ${results} 221C275 254 260 286 283 286Z`,
    
    // trunk 3
    (results) => `M256.058 307C255.54 290.435 255.023 273.871 ${results} 257.306C253.988 273.871 253.47 290.176 252.952 306.224`,
    // leaves 3
    (results) => `M254.505 291.471C272.364 291.471 260.717 266.624 ${results} 241C248.293 266.624 236.646 291.471 254.505 291.471Z`,
    
    // trunk 4
    (results) => `M67.3788 299.908C66.7526 279.867 66.1263 259.826 ${results} 239.784C64.8737 259.826 64.2474 279.553 63.6211 298.968`,
    // leaves 4
    (results) => `M65.5 281.119C87.1068 281.119 73.0154 251.058 ${results} 220.056C57.9846 251.058 43.8932 281.119 65.5 281.119Z`,
    
    // trunk 5
    (results) => `M41.8334 306C41.3731 291.27 40.9128 276.54 ${results} 261.81C39.9921 276.54 39.5318 291.04 39.0715 305.31`,
    //leaves 5
    (results) => `M40.4525 292.19C56.3334 292.19 45.9763 270.095 ${results} 248C34.9287 270.095 24.5715 292.19 40.4525 292.19`
  ]

  trees.forEach( (treeELement, index) => {
    let val = delta + INITIAL_VALUES[index]
    treeELement.style.d = `path("${INITIAL_PATHS_FNS[index](val)}")`
  })
  
}