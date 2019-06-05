const $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

if (!("animationWorklet" in CSS)) {
  $('.warning').style.display = "block";
}


// register animation
Promise.all([ CSS.animationWorklet.addModule("worklets/parallax.js"), CSS.animationWorklet.addModule("worklets/wobble.js")]).then(function(values) {
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
  const scrollSource = fakeScrollEl;
  const timeRange = 10;
  const scrollTimeline = new ScrollTimeline({ scrollSource, timeRange });
 
  // register worklets to perform parallax when the fakeScroll element scrolls
  createParallaxWorkletForTrees( trees, scrollTimeline, timeRange ).forEach((worklet) =>{
    worklet.play();
  })
  
  createParallaxWorkletForMountains( {  mtnLow, mtnMiddle, mtnTrees}, scrollTimeline, timeRange ).forEach((worklet) =>{
    worklet.play();
  })
  
  // register workletr to perform wobble effect when's pull-to-referesh released
  
  
  let wobbleWorklets = createWobbleEffectForTrees(trees);
  
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
    if (delta < 0) {
      let absDelta = Math.abs(delta);
      window.requestAnimationFrame(() => {
        listviewEl.style.transform = `translateY(${absDelta}px)`;
        fakeScrollEl.scrollTo(0, absDelta);
      });
    }
  }
  
  function _stopDragging (e) {
    console.log('1')
    if (isDragLocked === true) return;
    console.log('2')
    listviewEl.addEventListener("transitionend", e => {
      listviewEl.style.transition = ``;
      listviewEl.style.transform = ``;
    });
    window.requestAnimationFrame(() => {
      listviewEl.style.transition = `transform 0.15s ease-in-out`;
      listviewEl.style.transform = `translateY(0px)`;
      fakeScrollEl.scrollTo(0, 0);
    });
    wobbleWorklets.forEach(w => w.play());
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


function createParallaxWorkletForTrees(trees, scrollTimeline, timeRange) {
    let w = [];
    trees.forEach(tree => {
      let { tilt, leaves, trunk } = tree;
      w.push(
        new WorkletAnimation(
          "parallax",
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
            { duration: timeRange }
          ),
          scrollTimeline,
          { rate: 1 }
        )
      );
      w.push(
        new WorkletAnimation(
          "parallax",
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
            { duration: timeRange }
          ),
          scrollTimeline,
          { rate: 1 }
        )
      );
    });
    return w;
}


function createParallaxWorkletForMountains (mountains, scrollTimeline, timeRange) {
    let { mtnLow, mtnMiddle, mtnTrees } = mountains;
    
    let w = [];

    w.push(
      new WorkletAnimation(
        "parallax",
        new KeyframeEffect(
          mtnLow,
          [{ transform: "translateY(60%)" }, { transform: "translateY(100%)" }],
          { duration: timeRange }
        ),
        scrollTimeline,
        { rate: 2 }
      )
    );

    w.push(
      new WorkletAnimation(
        "parallax",
        new KeyframeEffect(
          mtnMiddle,
          [{ transform: "translateY(50%)" }, { transform: "translateY(40%)" }],
          { duration: timeRange }
        ),
        scrollTimeline,
        { rate: 1 }
      )
    );

    w.push(
      new WorkletAnimation(
        "parallax",
        new KeyframeEffect(
          mtnTrees,
          [{ transform: "translateY(35%)" }, { transform: "translateY(20%)" }],
          { duration: timeRange }
        ),
        scrollTimeline,
        { rate: 0.7 }
      )
    );
    return w;
  };