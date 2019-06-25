class PanResponder {
  constructor( recieverElement ) {
    this.panElement = recieverElement;
    this.startY = 0;
    this.endY = 0;
    this.delta = 0;
    this.absDelta = 0;
    this.dragInitiated = false;
    this.onPanResponderInit = null;
    this.onPanResponderMove = null;
    this.onPanResponderRelease = null;
    
    
    this._startDragging = this._startDragging.bind(this);
    this._whileDragging = this._whileDragging.bind(this);
    this._stopDragging = this._stopDragging.bind(this);
    
    this._RegisterStartDragListsners();
    this._RegisterDraggingListeners();
    this._RegisterStopDraggingListeners();
  }

  _RegisterStartDragListsners () {
    this.panElement.addEventListener("mousedown", this._startDragging);
    this.panElement.addEventListener("touchstart", this._startDragging );

  }
  
  _RegisterDraggingListeners() {
    document.addEventListener("touchmove", this._whileDragging);
    document.addEventListener("mousemove", this._whileDragging);
  }
  
  _RegisterStopDraggingListeners() {
    document.addEventListener("touchend", this._stopDragging);
    document.addEventListener("touchcancel", this._stopDragging);
    document.addEventListener("mouseleave", this._stopDragging );
    document.addEventListener("mouseup", this._stopDragging);
  }
  
  _startDragging(e) {
    this.dragInitiated = true
    this.absDelta = 0;
    this.delta = 0;
    this.startY = e.clientY || e.touches[0].clientY;
    if( this.onPanResponderInit ) {
      this.onPanResponderInit ()
    }
  }
  
  _whileDragging(e) {
    if (this.dragInitiated === false) return;
    this.endY = e.clientY || e.touches[0].clientY;
    let delta = this.startY - this.endY;
    let absDelta = Math.abs(delta);
    this.delta = delta
    this.absDelta = absDelta
    if (delta < 0) {  
      if( this.onPanResponderMove ) this.onPanResponderMove (delta)
    }
    
  }
  
  _stopDragging() {
    if (this.dragInitiated === false) return;
    this.dragInitiated = false;
    if( this.absDelta < 10 ) return;
    if( this.onPanResponderRelease ) this.onPanResponderRelease (this.absDelta)
  }
  
}