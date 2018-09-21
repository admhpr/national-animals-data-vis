/**
 * Stars.js
 * @author Adam Harpur
 * 10/15/2017
 * inspired by https://codepen.io/mi2oon/pen/Egmbxj
 *             http://blog.lunarlogic.io/auroral/
 * @license MIT.
 */

const dblPI = 2 * Math.PI;
/**
 * Star Field Config
 *
 */

// Amount of stars relative to the screen size
const AMOUNT = 500;

//connections of stars
var dist_between_max = 45; // lower to make less connection, checked and recalibrated every resize
// span of connections
const CON_RADIUS = 90;
//rotation of star field
const ROTATION = 0.0001;
const LINE_WIDTH = 0.6;

let canvas = document.getElementById("stars");

if (canvas) {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  let ctx = canvas.getContext("2d");
  ctx.lineWidth = LINE_WIDTH;

  let boundry = {
    top: -10,
    left: -10,
    right: canvas.width + 10,
    bottom: canvas.height + 10
  };

  let centerCanvas = {
    x: Math.floor(canvas.width / 2),
    y: Math.floor(canvas.height / 2)
  };

  let connectArea = {
    destX: 0,
    destY: 0,
    x: centerCanvas.x,
    y: centerCanvas.y
  };

  /**
   * Let's make some stars
   *
   */

  // stars holder
  let stars = [];

  // Star Config

  //constructor
  function Star() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 1.2;

    this.update = () => {
      // make sure it's within bounds
      if (this.y > boundry.bottom) this.y = boundry.top;
      if (this.y < boundry.top) this.y = boundry.bottom;

      // http://stackoverflow.com/a/15109215/3137109
      this.x =
        Math.cos(ROTATION) * (this.x - centerCanvas.x) -
        Math.sin(ROTATION) * (this.y - centerCanvas.y) +
        centerCanvas.x;
      this.y =
        Math.sin(ROTATION) * (this.x - centerCanvas.x) +
        Math.cos(ROTATION) * (this.y - centerCanvas.y) +
        centerCanvas.y;
    };

    this.draw = () => {
      ctx.beginPath();
      ctx.fillStyle = "#fff";
      //void ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
      ctx.arc(this.x, this.y, this.radius, 0, dblPI, false);
      ctx.fill();
    };
  }

  function resize() {
    //called on viewport resize

    // recalculate width and height
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // reset boundries
    boundry.right = canvas.width - 1;
    boundry.bottom = canvas.height - 1;

    centerCanvas = {
      x: Math.floor(canvas.width / 2),
      y: Math.floor(canvas.height / 2)
    };

    // where to join
    connectArea.destX = centerCanvas.x;
    connectArea.destY = centerCanvas.y * 0.1;

    stars.length = 0;

    let total = Math.floor(canvas.width * canvas.height / AMOUNT);
    let counter = 0;
    while (counter < AMOUNT) {
      stars.push(new Star());
      counter += 1;
    }

    let w = window.innerWidth;
    w < 800
      ? (dist_between_max = dist_between_max / 2.5)
      : (dist_between_max = 50);
  }

  resize();
  animateStars();

  /**
   * Utility functions
   *
   */

  function updateConnectArea() {
    let distX = connectArea.destX - connectArea.x;
    let distY = connectArea.destY - connectArea.y;

    if (distX > 5 || distX < 5) {
      connectArea.x += Math.floor(distX / 20);
      connectArea.y += Math.floor(distY / 20);
    }
  }

  function connectStars() {
    for (let i = 0, star1; (star1 = stars[i]); i++) {
      for (let j = i + 1, star2; (star2 = stars[j]); j++) {
        let xDiff = star1.x - star2.x,
          yDiff = star1.y - star2.y,
          // dist from centerCanvas
          xCoreDiff = star1.x - connectArea.x,
          yCoreDiff = star1.y - connectArea.y;

        if (
          xDiff < dist_between_max &&
          xDiff > -dist_between_max &&
          yDiff < dist_between_max &&
          yDiff > -dist_between_max &&
          xCoreDiff < CON_RADIUS &&
          xCoreDiff > -CON_RADIUS &&
          yCoreDiff < CON_RADIUS &&
          yCoreDiff > -CON_RADIUS
        ) {
          ctx.beginPath();
          ctx.strokeStyle = "hsla(0,100%,100%,0.2)";
          ctx.moveTo(star1.x + 0.0, star1.y + 0.0);
          ctx.lineTo(star2.x + 0.0, star2.y + 0.0);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  }

  function animateStars() {
    requestAnimationFrame(animateStars);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateConnectArea();
    for (let i = 0, star; (star = stars[i]); i++) star.update();
    connectStars();
    for (let i = 0, star; (star = stars[i]); i++) star.draw();
  }

  document.body.addEventListener("mousemove", function(e) {
    // e.touches --> https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches
    // e.touches[0] --> https://developer.mozilla.org/en-US/docs/Web/API/Touch/pageX

    connectArea.destX = e.clientX || (e.touches && e.touches[0].pageX);
    connectArea.destY = e.clientY || (e.touches && e.touches[0].pageY);
  });

  document.body.addEventListener("mouseleave", function(e) {
    connectArea.destX = centerCanvas.x;
    connectArea.destY = centerCanvas.y;
  });
  window.addEventListener("resize", resize);
}
