const $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

if (!("animationWorklet" in CSS)) {
  $('.warning').style.display = "block";
}


// register animation
Promise.all([ /* CSS.animationWorklet.addModule("worklets/parallax.js") */, CSS.animationWorklet.addModule("worklets/wobble.js")]).then(function(values) {
  pageReady()
});


function pageReady () {
  // elements selectors
  const appEl = $("#app");
  const dragEl = $(".action-bar");
  const listviewEl = $(".listview");
  const fakeScrollEl = $(".fake");  
  const trees = getTrees();
  const mtnLow = $(".mtn-low");
  const mtnMiddle = $(".mtn-middle");
  const mtnTrees = $(".mnt-trees");
  
  // scroll timeline variables 
  // const scrollSource = fakeScrollEl;
  // const timeRange = 10;
  // const scrollTimeline = new ScrollTimeline({ scrollSource, timeRange });
 
  const animationGroupTrees = createParallaxAnimationForTrees(trees);
  const animationGroupMountains = createParallaxAnimationForMountains({mtnLow, mtnMiddle, mtnTrees});
  
  // mouse-drag functionality
  let isDragLocked = true;
  let startY = 0;
  dragEl.addEventListener("mousedown", e => {
    e.preventDefault();
    isDragLocked = false;
    startY = e.clientY;
  });
   dragEl.addEventListener("touchstart", e => {
    e.preventDefault();
    isDragLocked = false;
    startY = e.touches[0].clientY;
  });
  
  document.addEventListener("touchend", _stopDragging);
  document.addEventListener("touchcancel", _stopDragging);
  document.addEventListener("touchmove", _startDragging); 
  
  document.addEventListener("mouseup", _stopDragging);
  document.addEventListener("mousemove", _startDragging);
  appEl.addEventListener("mouseleave", _stopDragging );
  
  function _startDragging(e) {
    if (isDragLocked === true) return;
    let endY = e.clientY || e.touches[0].clientY;
    let delta = startY - endY;
    let absDelta = Math.abs(delta);
    if (delta < 0) {
      
      window.requestAnimationFrame(() => {
        listviewEl.style.transform = `translateY(${absDelta}px)`;
        animationGroupTrees.forEach((worklet) =>{
          worklet.currentTime += 15;
        })
        animationGroupMountains.forEach((worklet) =>{
          worklet.currentTime += 15;
        })
      });
    }
  }
  
  function _stopDragging (e) {
    if (isDragLocked === true) return;
    listviewEl.addEventListener("transitionend", e => {
      listviewEl.style.transition = ``;
      listviewEl.style.transform = ``;
    });
    window.requestAnimationFrame(() => {
      listviewEl.style.transition = `transform 0.15s ease-in-out`;
      listviewEl.style.transform = `translateY(0px)`;
    });
    
    animationGroupTrees.forEach((worklet) =>{
      //worklet.currentTime = 0;
      worklet.cancel();
    })
    animationGroupMountains.forEach((worklet) =>{
      worklet.cancel();
    })
    createWobbleEffectForTrees(trees).forEach( t => {
      t.play();
    })
    isDragLocked = true;
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
  return (val += 30);
    } else {
        return val;
      }
    })
    .join(" ");

  let ep2 = sp
    .map((val, idx) => {
      if (idx === 5) {
        val = Number(val);
        return (val -= 30);
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
      w.push(
        new WorkletAnimation(
          "wobble",
          new KeyframeEffect(
            leaves.elm,
            [
              { d: `path("${leaves.paths[0]}")` },
              {
                d: `path("${leaves.paths[1]}")`
              },
              {
                d: `path("${leaves.paths[0]}")`
              },
              {
                d: `path("${leaves.paths[2]}")`
              }
            ],
            { duration: 10, iterations: 5 }
          ),
          document.timeline
        )
      );
      w.push(
        new WorkletAnimation(
          "wobble",
          new KeyframeEffect(
            trunk.elm,
            [
              { d: `path("${trunk.paths[0]}")` },
              {
                d: `path("${trunk.paths[1]}")`
              },
              {
                d: `path("${trunk.paths[0]}")`
              },
              {
                d: `path("${trunk.paths[2]}")`
              }
            ],
            { duration: 10, iterations: 5 }
          ),
          document.timeline
        )
      );
    });

    return w;
};


function createParallaxAnimationForTrees(trees) {
    let w = [];
    trees.forEach(tree => {
      let { tilt, leaves, trunk } = tree;
      w.push(
        new Animation(
          new KeyframeEffect(
            leaves.elm,
            [
              { d: `path("${leaves.paths[0]}")` },
              {
                d: `path("${
                  tilt === "right" ? leaves.paths[1] : leaves.paths[2]
                }")`
              }
            ],
            { duration: 3000 }
          ),
          document.timeline
        )
      );
      w.push(
        new Animation(
          new KeyframeEffect(
            trunk.elm,
            [
              { d: `path("${trunk.paths[0]}")` },
              {
                d: `path("${
                  tilt === "right" ? trunk.paths[1] : trunk.paths[2]
                }")`
              }
            ],
            { duration: 3000 }
          ),
          document.timeline
        )
      );
    });
    return w;
}


function createParallaxAnimationForMountains (mountains) {
    let { mtnLow, mtnMiddle, mtnTrees } = mountains;
    
    let w = [];

    w.push(
      new Animation(
        new KeyframeEffect(
          mtnLow,
          [{ transform: "translateY(60%)" }, { transform: "translateY(100%)" }],
          { duration: 3000 }
        ),
        document.timeline,
        { rate: 2 }
      )
    );

    w.push(
      new Animation(
        new KeyframeEffect(
          mtnMiddle,
          [{ transform: "translateY(50%)" }, { transform: "translateY(40%)" }],
          { duration: 3000 }
        ),
        document.timeline
      )
    );

    w.push(
      new Animation(
        new KeyframeEffect(
          mtnTrees,
          [{ transform: "translateY(35%)" }, { transform: "translateY(20%)" }],
          { duration: 3000 }
        ),
        document.timeline
      )
    );
    return w;
  };