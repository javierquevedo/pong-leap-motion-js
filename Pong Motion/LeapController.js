
/*
* LeapController
* September 2013. Copyright Javier Quevedo-Fernández.
* Twitter: senc01a
* Github: http://github.com/senc01a
*
* License Information
*
* 
*/

var leapDidUpdateEvent = 'leapDidUpdate';
var paused;
// Leap Motion constants
var leapMaxYDistance = 400; 
var leapMinYDistance = 10;
var _leapController; // Pointer to the leap controller required to be able to access it inside the Leap main loop

/**
* Constructs the LeapController object
* @class LeapController
* @memberof Jqf
* @classdesc
* Provides the distance of the leftmost and rightmost hands to the sensor
* whenever the Leap Motion provides an (frame) update.
* This controller dispatches the event leapDidUpdateEvent that client code 
* can buscribe to, in order to receive the updates
* The LeapController object provides two values, leftHandYPos and rightHandYPos
* that contain the normalized value (0 .. 1) of the left and right hands.
*
**/
function LeapController(){
	// 
	//Normalized distance of the hand 0 .. 1
	this.leftHandYPos = 0.0; 
	this.rightHandYPos = 0.0;
  _leapController = this;
  this.leftHandAvailable = false;
  this.rightHandAvailable = false;
	
}

/**
 *  Initiallizes the main loop of the Leap Motion 
**/

LeapController.prototype.start = function() {

	var controllerOptions = {enableGestures: false};

  	Leap.loop(controllerOptions, function(frame) {
    	if (paused) {
      		return; // Skip this update
    	}
    	// Selects the top most left hand and top most right hand
    	var leftHand;
    	var rightHand;

    	if (frame.hands.length > 0) {
    		leftHand = frame.hands[0];
    		for (var i = 0; i < frame.hands.length; i++) {
      			var hand = frame.hands[i];
      			if (leftHand.palmPosition[0] > hand.palmPosition[0]){
      				leftHand = hand;
      			}
      		}

        if (leftHand && leftHand.palmPosition){
            if (leftHand.palmPosition[0] < 0){
              _leapController.leftHandAvailable = true;
              _leapController.leftHandYPos = (leftHand.palmPosition[1] - leapMinYDistance) / leapMaxYDistance;
            }else{
              _leapController.leftHandAvailable = false;
            }
        }
        
      	rightHand = frame.hands[0];
    		for (var i = 0; i < frame.hands.length; i++) {
      			 var hand = frame.hands[i];
      			 if (rightHand.palmPosition[0] < hand.palmPosition[0]){
      				  rightHand = hand;
      			 }
      	 }
        if (rightHand && rightHand.palmPosition){
          if (rightHand.palmPosition[0] > 0){
            _leapController.rightHandAvailable = true;
            _leapController.rightHandYPos = (rightHand.palmPosition[1] - leapMinYDistance) / leapMaxYDistance;
          }else{
              _leapController.rightHandAvailable = false;
          }
        }
        var leapUpdateEvent = new Event(leapDidUpdateEvent);
        leapUpdateEvent.currentTarget = _leapController;
        dispatchEvent(leapUpdateEvent);
      }
    }
  )
}
