var cvs, ctx; // canvas and canvas-context
var cw, ch; //canvas width/height
var currTimeout; // current timer for next screen
var isFS = false; // whether or not site is fullscreen
var trialComplete = false; // whether a trial has been completed this session

// random chances
var halfChance = 0.5; // half or whole trial
var innerChance = 0.5; // if half: focusing on inner or outer
var innerFirstChance = 0.5; // order of questions

var textColor = "white";

// fixation cross formatting
var shouldShowFixationCross = false; // false turns it off, true turns it on
var fixColor = "white";
var fixRadius = 10;

// concentric circle formatting (in pixels)
var innerRadius = 50;
var outerRadius = 100;

// mask formatting
var maskColor = "white";

// colorwheel (cw) formatting
var cwOuterRadius = 100;
var cwInnerRadius = 50;

// 'next' button formatting
var nextButtonW = 100;
var nextButtonH = 50;
var nextButtonXoff = -50 - nextButtonW;
var nextButtonYoff = -50 - nextButtonH;
var nextButtonColor = "#dddddd";
var nextButtonTextColor = "#333333";



/**
 * Placeholder variables:
 * these are what should be used to store data about a given trial. They will
 * contain the events/results of the trial, but do not last for more than one
 * session. I am also adding a function that will activate when a trial finishes
 */
var amHalf; // was a half trial (boolean)
var amInner; // focus on inner (boolean) (only relavent for half trials)
var innerFirst; // asked about inner color first (boolean)
var innerHue; // actual color of inner circle (float in [0, 360))
var outerHue; // actual color of outer circle (float in [0, 360))
var innerGuess; // guessed color of inner circle (float in [0, 360))
var outerGuess; // guessed color of outer circle (float in [0, 360))
var confidence; // confidence of guess
var innerConf; // confidence of inner guess
var outerConf; // confidence of outer guess

// with regards to the confidences, use all three or none for data, I wanted to
// ensure I didn't miss anything. They will be filled with nothing until I
// implement that screen.

// Also feel free to add variables and tell me what to put in them later.

// here is the method that is called when a trial is completed (only the first)
function onTrialComplete() {
  trialComplete = true;
  // do anything you need in this space using the above variables

  // don't change the following line:
  currTimeout = setTimeout(showThanks, 0);
}

// text constants
var line1 = "You are about to see two circles one inside another";
var line2v1 = "Concentrate on the inner circle";
var line2v2 = "Concentrate on the outer circle";
var line2v3 = "Concentrate on both circles";
var line3 = "Click [space] when you are ready";
var prompt = "Try your best to recreate the colors you saw on the wheels below."
var question1 = "Inner color:";
var question2 = "Outer color:";
var nextText = "Next";
var confText0 = "How confident are you about";
var confText1 = "the color of the INNER portion?";
var confText2 = "the color of the OUTER portion?";
var thanksText = "Thank you for participating.";
var exitText = "Press [esc] to exit fullscreen.";

var mouseDown = false;

// initializes webpage
function init() {
  cvs = document.getElementById("canvas");
  ctx = cvs.getContext("2d");

  window.addEventListener("resize", resizeHandler);
  resizeHandler();

  document.addEventListener("fullscreenchange", fullscreenHandler);
  document.addEventListener("webkitfullscreenchange", fullscreenHandler);
  document.addEventListener("mozfullscreenchange", fullscreenHandler);
  document.addEventListener("MSFullscreenChange", fullscreenHandler);

  cvs.onmousedown = function() {
    mouseDown = true;
    // console.log("mouse down", mouseDown);
  }
  cvs.onmouseup = function() {
    mouseDown = false;
    // console.log("mouse up", mouseDown);
  }
}

function main() {
  init();

  showMaximize();
}

function redraw() {
  clearListeners();
  clearCvs();
  if(isFS) {
    if(trialComplete) {
      showThanks();
    } else {
      showInstructions();
    }
  } else {
    showMaximize();
  }
}

function clearCvs() {
  ctx.fillStyle = "#7f7f7f";
  ctx.fillRect(0, 0, cw, ch);
}

function showMaximize() {
  console.log("showMaximize");
  clearCvs();
  ctx.font = "30px Arial";
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Click to Maximize", cw/2, ch/2);

  cvs.addEventListener("click", fullscreen);
}

function showInstructions() {
  console.log("showInstructions");
  clearCvs();
  amHalf = Math.random() < halfChance ? true : false;
  amInner = Math.random() < innerChance ? true : false;
  innerGuess = null;
  outerGuess = null;
  // console.log("amHalf:", amHalf, "amInner:", amInner);
  ctx.font = "30px Arial";
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(line1, cw/2, ch/2 - 100);
  ctx.font = "bold 30px Arial";
  if(!amHalf) {
    ctx.fillText(line2v3, cw/2, ch/2);
  } else if(amInner) {
    ctx.fillText(line2v1, cw/2, ch/2);
  } else {
    ctx.fillText(line2v2, cw/2, ch/2);
  }
  ctx.font = "30px Arial";
  ctx.fillText(line3, cw/2, ch/2 + 100);
  addEventListener("keypress", instructionsKeypress);
}

function instructionsKeypress(e) {
  console.log("key pressed");
  var keynum;
  if(window.event) { // IE
    keynum = e.keyCode;
  } else if(e.which) { // Netscape/Firefox/Opera
    keynum = e.which;
  }

  if(keynum == 32) { // [space]
    currTimeout = setTimeout(showFixation, 0);
  }
}

function showFixation() {
  removeEventListener("keypress", instructionsKeypress);
  console.log("showFixation");
  clearCvs();
  // hide cursor
  cvs.style.cursor = 'none'
  // show fixation cross (if it should)
  if(shouldShowFixationCross) {
    let fixX = cw/2;
    let fixY = ch/2;
    if(amHalf && !amInner) {
      let angle = Math.random() * 2 * Math.PI;
      let offset = (innerRadius + outerRadius) / 2;
      fixX += offset * Math.cos(angle);
      fixY += offset * Math.sin(angle);
    }
    ctx.strokeStyle = fixColor;
    ctx.beginPath();
    ctx.moveTo(fixX - fixRadius, fixY);
    ctx.lineTo(fixX + fixRadius, fixY);
    ctx.moveTo(fixX, fixY - fixRadius);
    ctx.lineTo(fixX, fixY + fixRadius);
    ctx.stroke();
  }
  // set timeout for circles
  currTimeout = setTimeout(showCircles, 1000);
}

function showCircles() {
  console.log("showCircles");
  clearCvs();
  // select colors
  innerHue = Math.random() * 360;
  outerHue = innerHue + 90 + Math.random() * 180;
  if(outerHue >= 360) {
    outerHue -= 360;
  }
  let innerColor = "hsl(" + innerHue + ",100%, 50%)";
  let outerColor = "hsl(" + outerHue + ",100%, 50%)";
  // draw
  ctx.fillStyle = outerColor;
  ctx.beginPath();
  ctx.arc(cw/2, ch/2, outerRadius, 0, 2*Math.PI);
  ctx.fill();
  ctx.fillStyle = innerColor;
  ctx.beginPath();
  ctx.arc(cw/2, ch/2, innerRadius, 0, 2*Math.PI);
  ctx.fill();
  console.log("showing circles");
  // set timeout for mask
  currTimeout = setTimeout(showMask, 500);
}

function showMask() {
  clearCvs();
  // draw mask
  ctx.fillStyle = maskColor;
  ctx.fillRect(0, 0, cw, ch);
  // set up question variables
  innerFirst = Math.random() < innerFirstChance ? true : false;
  isSecondQ = false;
  selectedHue = null;
  selectedHue2 = null;
  // set timout for questions
  currTimeout = setTimeout(showQuestions, 500);
}

var selectedHue = null;
var selectedHue2 = null;
function showQuestions() {
  console.log("showQuestions");
  clearCvs();
  cvs.style.cursor = ""; // make cursor visible
  // draw question
  ctx.fillStyle = textColor;
  if(innerFirst) {
    ctx.fillText(prompt, cw/2, ch/3 - 100);
    ctx.fillText(question1, cw/3, ch/2 - 50);
    ctx.fillText(question2, 2*cw/3, ch/2 - 50);
  } else {
    ctx.fillText(prompt, cw/2, ch/3 - 100);
    ctx.fillText(question2, cw/3, ch/2 - 50);
    ctx.fillText(question1, 2*cw/3, ch/2 - 50);
  }


  // draw colorwheel
  let imgData = ctx.getImageData(cw/2 - cwOuterRadius, ch/2 + 100 - cwOuterRadius,
      2*cwOuterRadius, 2*cwOuterRadius);
  let data = imgData.data;

  for(let x = -cwOuterRadius; x < cwOuterRadius; x++) {
    for(let y = -cwOuterRadius; y < cwOuterRadius; y++) {
      let r2 = x*x + y*y;
      if(r2 > cwOuterRadius*cwOuterRadius ||
          r2 < cwInnerRadius*cwInnerRadius) {
        continue;
      }
      let theta = Math.atan2(y, x);
      let index = (x + cwOuterRadius + (y + cwOuterRadius)*2*cwOuterRadius) * 4;

      let hue = theta / (2*Math.PI) + .25;
      let rgb = hslToRgb(hue, 1, .5);

      data[index] = rgb[0];
      data[index+1] = rgb[1];
      data[index+2] = rgb[2];
      data[index+3] = 255;

    } // for y
  } // for x


  //ctx.putImageData(imgData, cw/4 - cwOuterRadius, ch/2 + 100 - cwOuterRadius);            //left wheel original
  ctx.putImageData(imgData, cw/3 - cwOuterRadius, ch/2 +100 - cwOuterRadius);                                            //3*cw/8    and 4 down
  ctx.putImageData(imgData, 2*cw/3 - cwOuterRadius, ch/2 +100 - cwOuterRadius);          // right wheel
  // watch for selection
  cvs.addEventListener("mousedown", selectColor);
  cvs.addEventListener("mousemove", selectColor);
  // watch for next button
  cvs.addEventListener("click", nextButton);
}

function selectColor(e) {
  // console.log("selecting color");
  if(!mouseDown) {
    return;
  }
  /* LEFT CIRCLE */         //MAKE IT OUTER PART
  //let x = e.offsetX - cw/4;                                                   // let x = e.offsetX - cw/2;
  //let y = e.offsetY - ch/2 - 100; 
  let x = e.offsetX - cw/3;                                                   
  let y = e.offsetY - ch/2 - 100;                                               //was ch/2; original left above
  let r2 = x*x + y*y;
  if(r2 < cwOuterRadius*cwOuterRadius && r2 > cwInnerRadius*cwInnerRadius) {    // if(r2 > cwOuterRadius*cwOuterRadius || r2 < cwInnerRadius*cwInnerRadius) {
  //if(r2 > cwOuterRadius*cwOuterRadius || r2 < cwInnerRadius*cwInnerRadius) {
    let theta = Math.atan2(y, x);
    selectedHue = (theta / (2*Math.PI) + 0.25) * 360;
    if(selectedHue < 0) {
      selectedHue += 360;
    }
    if(innerFirst) {                                                            // will prob need to change depending of if inner/outer of color wheel portion
      innerGuess = selectedHue;
    } else {
      outerGuess = selectedHue;
    }
    ctx.fillStyle = "hsl("+selectedHue+",100%,50%)";
    ctx.beginPath();
    //ctx.arc(cw/4, ch/2+100, cwInnerRadius + 2, 0, 2*Math.PI);                  //ctx.arc(cw/2, ch/2+100, cwInnerRadius + 2, 0, 2*Math.PI);
    ctx.arc(4*cw/8, ch/2-50 ,outerRadius, 0, 2*Math.PI);                 //this is for the swatch; can have dif cor than the other two
    ctx.fill();
  }


  if (selectedHue2 == null) {
    // grey mask for the outer ring selection color 
    // will be similar to the lower code for right circle 
    ctx.fillStyle = "#7f7f7f";
    ctx.beginPath();
    ctx.arc(4*cw/8, ch/2-50, cwInnerRadius + 2, 0, 2*Math.PI);
    ctx.fill();
  }

    if (selectedHue2 !== null) {
    //making sure there's no grey mask if someone already selected for the inner 
    ctx.fillStyle = "hsl("+selectedHue2+",100%,50%)";
    ctx.beginPath();
    ctx.arc(4*cw/8, ch/2-50, cwInnerRadius + 2, 0, 2*Math.PI);
    ctx.fill();
  }

  /* RIGHT CIRCLE */        //MAKE IT INNER PART 
  x = e.offsetX - 2*cw/3;                                                       //change for position, probably same as above 
  y = e.offsetY - ch/2 - 100;
  r2 = x*x + y*y;
  if(r2 < cwOuterRadius*cwOuterRadius && r2 > cwInnerRadius*cwInnerRadius) {     //odd condition.. need to see what it's supposed to be?
    theta = Math.atan2(y, x);
    selectedHue2 = (theta / (2*Math.PI) + 0.25) * 360;
    if(selectedHue2 < 0) {
      selectedHue2 += 360;
    }
    if(!innerFirst) {                                                             // change depending on portion
      innerGuess = selectedHue2;
    } else {
      outerGuess = selectedHue2;
    }
    ctx.fillStyle = "hsl("+selectedHue2+",100%,50%)";
    ctx.beginPath();
    //ctx.arc(3*cw/4, ch/2+100, cwInnerRadius + 2, 0, 2*Math.PI);                   //Probably make same as above, but change the var for inner radius 
    ctx.arc(4*cw/8, ch/2-50, cwInnerRadius + 2, 0, 2*Math.PI);
    ctx.fill();
  }



  // draw button
  if(innerGuess !== null && outerGuess !== null) {

    //VH added:
    // const data = {innerGuess,outerGuess};
    // const options = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type':'application/json'
    //   },
    //   body: JSON.stringify(data)
    // };
    // fetch('/api',options);

    ctx.fillStyle = nextButtonColor;
    ctx.fillRect(cw+nextButtonXoff, ch+nextButtonYoff, nextButtonW, nextButtonH);
    ctx.fillStyle = nextButtonTextColor;
    ctx.fillText(nextText, cw+nextButtonXoff + nextButtonW/2, ch+nextButtonYoff + nextButtonH/2);
  }
}

function nextButton(e) {
  if(innerGuess !== null && outerGuess !== null &&
      e.offsetX >= cw+nextButtonXoff && e.offsetX <= cw+nextButtonXoff+nextButtonW &&
      e.offsetY >= ch+nextButtonYoff && e.offsetY <= ch+nextButtonYoff+nextButtonH) {
    cvs.removeEventListener('mousedown', selectColor);
    cvs.removeEventListener('mousemove', selectColor);
    cvs.removeEventListener('click', nextButton);
    currTimeout = setTimeout(showConfidence, 0);
  }
}

var confidenceSelected = false;
var slider1;
var slider2;
function showConfidence() {
  slider1 = makeSlider(cw/4 - 200, ch/2 + 100, 400, 10, 1, 100, 50);
  slider1.draw();
  slider2 = makeSlider(3*cw/4 - 200, ch/2 + 100, 400, 10, 1, 100, 50);
  slider2.draw();

  redrawConfidence();

  // watch for slider drag
  cvs.addEventListener('mousedown', handleMouseDown);
  cvs.addEventListener('mouseup', handleMouseUp);
  cvs.addEventListener('mousemove', handleMouseMove);
  // watch for next button
  cvs.addEventListener("click", nextButton2);

  // currTimout = setTimeout(onTrialComplete, 0);
}

function redrawConfidence() {
  clearCvs();
  ctx.font = "30px Arial";
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(confText0, cw/4, ch/2 - 150);
  ctx.fillText(confText0, 3*cw/4, ch/2 - 150);
  if(innerFirst) {
    ctx.fillText(confText1, cw/4, ch/2 - 100);
    ctx.fillText(confText2, 3*cw/4, ch/2 - 100);
  } else {
    ctx.fillText(confText1, cw/4, ch/2 - 100);
    ctx.fillText(confText2, 3*cw/4, ch/2 - 100);
  }

  slider1.draw()
  slider2.draw()

  // draw button
  ctx.fillStyle = nextButtonColor;
  ctx.fillRect(cw+nextButtonXoff, ch+nextButtonYoff, nextButtonW, nextButtonH);
  ctx.fillStyle = nextButtonTextColor;
  ctx.fillText(nextText, cw+nextButtonXoff + nextButtonW/2, ch+nextButtonYoff + nextButtonH/2);
}

function nextButton2(e) {
  if(e.offsetX >= cw+nextButtonXoff && e.offsetX <= cw+nextButtonXoff+nextButtonW &&
      e.offsetY >= ch+nextButtonYoff && e.offsetY <= ch+nextButtonYoff+nextButtonH) {
      cvs.removeEventListener('mousedown', handleMouseDown);
      cvs.removeEventListener('mouseup', handleMouseUp);
      cvs.removeEventListener('mousemove', handleMouseMove);
      cvs.removeEventListener('click', nextButton2);
    if(innerFirst) {
      innerConf = slider1.value;
      outerConf = slider2.value;
    } else {
      innerConf = slider2.value;
      outerConf = slider1.value;
    }
    currTimeout = setTimeout(onTrialComplete, 0);
  }
}

var dragging
function handleMouseDown(e) {
  if(slider1.contains(e.clientX, e.clientY)) {
    confidenceSelected = true;
    dragging = slider1;
    dragging.update(e.clientX, e.clientY);
  }
  if(slider2.contains(e.clientX, e.clientY)) {
    confidenceSelected = true;
    dragging = slider2;
    dragging.update(e.clientX, e.clientY);
  }
}

function handleMouseUp() {
  if(dragging != null) {
    dragging = null;
  }
}

function handleMouseMove(e) {
  if(dragging != null) {
    dragging.update(e.clientX, e.clientY);
  }
}

function makeSlider(x, y, w, h, min, max, start) {
  if(w == 0 || h == 0 || min > max || min > start || start > max) {
    return null;
  }
  return {
    x:x,
    y:y,
    w:w,
    h:10,
    min:min,
    max:max,
    value:start,
    draw:function() {
      ctx.fillStyle = "#333333";
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.fillStyle = "#ffffff";
      handleX = this.x + (this.value - this.min) / (this.max-this.min) * this.w - 7;
      handleY = this.y - 2
      ctx.fillRect(handleX, handleY, 14, 14);

      ctx.font = "30px Arial";
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(Math.floor(this.value), this.x + this.w/2, this.y + this.h/2 + 50);
    },
    contains:function(x2, y2) {
      return this.x-2 < x2 && this.x+this.w+2 > x2 &&
          this.y-2 < y2 && this.y+this.h+2 > y2;
    },
    update:function(x2, y2) {
      this.value = (x2 - x) / w * (max-min) + min;
      if(this.value < min) {
        this.value = min;
      }
      if(this.value > max) {
        this.value = max;
      }
      redrawConfidence();
    }
  }
}

//VH added
// const express = require('express');
// const app = express();
// app.listen(3000, () => console.log('listening at 3000'));
// app.use(express.static('public'));

// app.post('/api', (request,response) => {
//   console.log(request.body);

// });




function showThanks() {
  clearCvs();
  // draw actuals vs. guesses
  let innerX = cw/2
  let outerX = cw/2 - 100
  if(innerFirst) {
    innerX = cw/2 - 100
    outerX = cw/2
  }
  ctx.font = "30px Arial"
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Actual", cw/2, ch/2 - 225);
  ctx.fillStyle = "hsl("+outerHue+",100%,50%)";
  ctx.fillRect(outerX, ch/2-200, 100, 50);
  ctx.fillStyle = "hsl("+innerHue+",100%,50%)";
  ctx.fillRect(innerX, ch/2-200, 100, 50);
  ctx.fillStyle = "hsl("+outerGuess+",100%,50%)";
  ctx.fillRect(outerX, ch/2-150, 100, 50);
  ctx.fillStyle = "hsl("+innerGuess+",100%,50%)";
  ctx.fillRect(innerX, ch/2-150, 100, 50);
  ctx.fillStyle = textColor;
  ctx.fillText("Guess", cw/2, ch/2 - 75);
  // thanks and bye
  ctx.font = "30px Arial";
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(thanksText, cw/2, ch/2);
  ctx.font = "bold 30px Arial";
  ctx.fillText(exitText, cw/2, ch/2 + 100);
  ctx.font = "30px Arial"; // jic
}

function fullscreen() {
  console.log("clicked for fullscreen");
  cvs.removeEventListener("click", fullscreen);
  console.log("removed eventListener");
  elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
    // console.log("requestFullscreen()");
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
    // console.log("moz requestFullscreen()");
  } else if(elem.webkitRequestFullScreen) {
     elem.webkitRequestFullScreen();
     // console.log("webkit requestFullscreen()");
  } else if(elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
    // console.log("ms requestFullscreen()");
  } else {
    // console.log("fullscreen() failed");
    return -1;
  }
}

function fullscreenHandler() {
  console.log("FS event");
  if(document.fullscreenElement || document.webkitFullscreenElement ||
      document.mozFullScreenElement || document.msFullscreenElement) {
    isFS = true;
    if(trialComplete) {
      currTimeout = setTimeout(showThanks, 0);
    } else {
      currTimeout = setTimeout(showInstructions, 0);
    }
  } else {
    isFS = false;
    clearTimeout(currTimeout);
    console.log("timeout cleared");
    clearListeners();

    cvs.addEventListener("click", fullscreen);
    cvs.style.cursor = ""; // ensure cursor visible again
    currTimeout = setTimeout(showMaximize, 0);
  }
}

function resizeHandler() {
  console.log("resize");
  cw = ctx.canvas.width = window.innerWidth;
  ch = ctx.canvas.height = window.innerHeight;
  redraw();
}

function clearListeners() {
  removeEventListener("keypress", instructionsKeypress);
  cvs.removeEventListener("click", nextButton);
  cvs.removeEventListener("click", fullscreen);
  cvs.removeEventListener("mousemove", selectColor);
  cvs.removeEventListener("mousedown", selectColor);
  cvs.removeEventListener('mousedown', handleMouseDown);
  cvs.removeEventListener('mouseup', handleMouseUp);
  cvs.removeEventListener('mousemove', handleMouseMove);
  cvs.removeEventListener("click", nextButton2);
}

window.onload = main

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 * from: https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


