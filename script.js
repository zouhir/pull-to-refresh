const $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);


if (!("animationWorklet" in CSS)) {
  $('.warning').style.display = "block";
}

// register animation
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
  
 
  const animationGroupTrees = createParallaxAnimationForTrees(trees)
  const translateMountainLow = AnimationEngine.translateMountain(mtnLow, 500)
  const translateMountainMiddle = AnimationEngine.translateMountain(mtnMiddle, 900)
  const translateMountainTop = AnimationEngine.translateMountain(mtnTop, 1200)
  const wobbleTrees = createWobbleEffectForTrees(trees)


  let panResponder = new PanResponder( dragEl, {} );
  
  panResponder.onPanResponderMove = function(delta) {
    let absDelta = Math.abs(delta);
    if( absDelta > 200  ) return;
    listviewEl.style.transform = `translateY(${absDelta}px)`;
    animationGroupTrees.setCurrentTime(delta * -1)
    translateMountainLow.setCurrentTime(delta * -1)
    translateMountainMiddle.setCurrentTime(delta * -1)
    translateMountainTop.setCurrentTime(delta * -1)
  }
  
  panResponder.onPanResponderRelease = function (delta) {
    AnimationEngine.bounceListView(listviewEl, delta).play().then( animationInstance => {
      console.log('Async: bouncing list view is done')
      animationInstance.cancel();
      listviewEl.style.transform = `translateY(0px)`
    })
    translateMountainLow.setCurrentTime(0)
    translateMountainMiddle.setCurrentTime(0)
    translateMountainTop.setCurrentTime(0)
    
    animationGroupTrees.reverse().then(expiredAnimation => {
      console.log('Async: trees has been smoothly reversed, you can wobble')
      expiredAnimation.forEach(_ => _.cancel())
      wobbleTrees.play().then( expiredAnimation2 => {
        console.log("Async: wobble effect is done, detach all animations from tree elements")
        expiredAnimation2.forEach(_ => _.cancel())
        
      });
    })
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
    let startPathTrunk = trunkElm.getAttribute("d");
    let startPathLeaves = leavesElm.getAttribute("d");
    let endPathTrunk = _getEndPath(startPathTrunk);
    let endPathLeaves = _getEndPath(startPathLeaves);
    let obj = {
      leaves: { elm: leavesElm, paths: [startPathLeaves, ...endPathLeaves] },
      trunk: { elm: trunkElm, paths: [startPathTrunk, ...endPathTrunk] },
      tilt: i <= 3 ? "right" : "left"
    };
    trees.push(obj);
  }
  return trees;
}

// tilting the SVG tree is done by changing a path value
function _getEndPath (startPath) {
  let sp = startPath.split(" ");

  let ep1 = sp
    .map((val, idx) => {
    if (idx === 5) {
      val = Number(val);
  return (val += 10);
    } else {
        return val;
      }
    })
    .join(" ");

  let ep2 = sp
    .map((val, idx) => {
      if (idx === 5) {
        val = Number(val);
        return (val -= 10);
      } else {
        return val;
      }
    })
    .join(" ");
  
  return [ep1, ep2];
};

function createWobbleEffectForTrees (trees) {
    let w = [];
    trees.forEach(tree => {
      let { leaves, trunk } = tree;
      let a = AnimationEngine.wobbleTree(leaves.elm, leaves.paths[0], leaves.paths[1], leaves.paths[2] );
      let b = AnimationEngine.wobbleTree(trunk.elm, trunk.paths[0], trunk.paths[1], trunk.paths[2] );
      w.push(a)
      w.push(b)
    })

    return new AsyncGroupAnimation(w)
};


function createParallaxAnimationForTrees(trees) {
    
    let w = []
    trees.forEach(tree => {
      let { tilt, leaves, trunk } = tree;
      let a = AnimationEngine.bendTree(leaves.elm, leaves.paths[0], tilt === "right" ? leaves.paths[1] : leaves.paths[2] );
      let b = AnimationEngine.bendTree(trunk.elm, trunk.paths[0], tilt === "right" ? trunk.paths[1] : trunk.paths[2] );
      w.push(a)
      w.push(b)
    })
    
    return new AsyncGroupAnimation(w)
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
