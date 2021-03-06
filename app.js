var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var count = 0;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var jump = 10;
var goingUp = true;
var max = 75;
var image = new Image();
image.src = "sprite.png"
var score = 0;
var background = new Image();
background.src = "background.png"
var obstacle = new Image();
obstacle.src = "rock.png"
var titleImage = new Image();
titleImage.src = "title.jpg"
var speed = 40;
var gameActive = false;
var isTitle = true;

var blocks = [{x: 480, y: 285, width: 45, height: 25, updateSpot : function() {
    this.x = this.x - 5;
  }}]

var player = {x: 15, y: 270, width: 50, height: 50, updateSpot : function() {
    this.x = this.x - 5;
  }}

  function draw() {
    if (gameActive) {
        if (count % 5 == 0) {
            score++;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0);
        ctx.font = "18px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Score: " + score, 360, 30);
    
        // update player based on keys
        if (leftPressed && player.x >= 5) {
            player.x -= 8;
        }
        if (rightPressed && player.x <= 430) {
            player.x += 8;
        }
        if (upPressed || jump != 10) {
            if (goingUp) {
                jump--;
                if (jump >= 7) {
                    player.y -= 17;
                } else if (jump >= 4) {
                    player.y -= 12;
                } else {
                    player.y -= 7;
                }
                
                if (jump == 0) {
                    goingUp = false;
                }
            } else if (jump < 10) {
                jump++;
                if (jump >= 7) {
                    player.y += 7;
                } else if (jump >= 4) {
                    player.y += 12;
                } else {
                    player.y += 17;
                }
    
                if (jump == 10) {
                    goingUp = true;
                }
            }
        }
    
        // draw player
        ctx.drawImage(image, player.x, player.y);
    
        // draw blocks
        blocks.forEach(function(element) {
            element.updateSpot();
            if (element.x > -50) {
                ctx.beginPath();
                ctx.drawImage(obstacle, element.x, element.y)
                // ctx.rect(element.x, element.y, element.width, element.height);
                // ctx.fillStyle = "#FF0000";
                // ctx.fill();
                ctx.closePath();
            } else {
                blocks.splice(element,1);
            }
            checkCollision(element);
            
          });
          
        count = count + 1;
        if (count % max == 0) {
            blocks.push({x: 480, y: 285, width: 45, height: 25, updateSpot : function() {
                this.x = this.x - 5;
              }})
        }
        if (count % 100 == 0) {
            if (speed > 0){
                speed -= 5;
            }
        }
        if (count % 150 == 0) {
            if (max > 10) {
                max -= 10;
            }
        }
        console.log("looped");
    } else if (isTitle) {
        ctx.drawImage(titleImage, 0, -20);
        ctx.font = "60px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("JUMP APE", canvas.width / 5, 2 * canvas.height / 3 - 15);
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("( press enter to begin )", canvas.width / 3.5, 3 * canvas.height / 4 - 15);

    }
    
}
var interval = setInterval(draw, speed);

// handle button presses
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    } else if(e.key =="Up" || e.key == "ArrowUp") {
        upPressed = true;
    } else if (e.key == "Enter") {
        gameActive = true;
        isTitle = false;
        score = 0;
        jump = 10;
        speed = 40;
        count = 0;
        blocks = [{x: 480, y: 285, width: 45, height: 25, updateSpot : function() {
            this.x = this.x - 5;
          }}]
        
        player = {x: 15, y: 270, width: 50, height: 50, updateSpot : function() {
            this.x = this.x - 5;
          }}
    }
}

// handle releasing buttons
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    } else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    }
}

function checkCollision(element) {
    // check x
    if (element.x > player.x && element.x < (player.x + 45)) {
        // check y
        if (element.y > player.y && element.y < player.y + 43) {
            gameOver();
        }
    }
    if (element.x + 50 > player.x && element.x + 50 < (player.x + 48)) {
        // check y
        if (element.y > player.y && element.y < player.y + 43) {
            gameOver();
        }
    }
}

function gameOver() {
    gameActive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.font = "60px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Game Over", canvas.width / 5, 2 * canvas.height / 3 - 45);
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, canvas.width / 2.3, 3 * canvas.height / 4 - 35);
    ctx.fillText("( press enter to retry )", canvas.width / 3.3, 3 * canvas.height / 4 - 15);
}