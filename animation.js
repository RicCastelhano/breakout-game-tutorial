// Reference to `canvas` tag and set proper 2D context
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Game area dimension
canvas.width = 800;
canvas.height = 600;

// game speed default reference
const defaultGameSpeed = 3;
// game speed variable -> it will change during the game
let gameSpeed = defaultGameSpeed;
// speed direction of the ball
let speedX = 1;
let speedY = -1;
// speed of the paddle movement
let paddleSpeed = 10;

// instances of the class Ball and class Paddle
let ball = new Ball();
let paddle = new Paddle();

// Define Brick Wall size
let brickColumnNumber = 9;
let brickRowNumber = 5;
let brickWidth = 75;
let brickHeight = 20;
let gamePadding = 5; // padding area around the screen
let brickOffset = 40; // space between bricks
let brickWall = []; // to keep reference of all the Brick instances

/** 
 * We have 5 different Brick Types:
 * level1TypeBricks Array has the ammount of each brick types we want to populate our wall
 * brickTypeCount Array will be used to assist on the process
 * */ 
let level1TypeBricks = [10, 10, 10, 5, 10];
let brickTypeCount = [0, 0, 0, 0, 0];

// We will have a special brick to expand the paddle temporarily. This variable will keep track if the timer is running or not
let timerRunningRunning = false;

// Keep track of the key press status
const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    }
}

/**
 * Create the Brick Wall
 */
for ( let i = 0; i < brickRowNumber; i++){
    // store the bricks in a bidimensional array
    brickWall[i] = [];
    for ( let j = 0; j < brickColumnNumber; j++){

        // Randomly define the brick type
        let type = Math.round( Math.random() * (level1TypeBricks.length-1) );

        /**
         * If the brick type exceeds the brick type defined in the array level1TypeBricks
         * we keep randomly defining a new brick type
         * */ 
        while(brickTypeCount[type] >= level1TypeBricks[type]){
            type = Math.round( Math.random() * (level1TypeBricks.length-1) );
        }

        // Each time a brick is successfully created, we keep track of its type
        brickTypeCount[type] += 1;

        // Create an instance of Brick class
        let brick = new Brick(j * (brickWidth + gamePadding) + brickOffset, i * (brickHeight + gamePadding) + brickOffset, 75, 20, type);
        // keep track of the instance. To be used for collision detection
        brickWall[i][j] = brick;
    }
}


/**
 * Collision detection logic between Ball and the game area limits - "walls"
 */
function wallCollisionDetection(){
    //collision left and right walls - when hit, invert X speed
    if( (ball.x + ball.ballRadius) >= canvas.width || (ball.x - ball.ballRadius) <= 0 ){
        speedX *= -1;
    } 
    
    //collision ceilling - when hit, invert Y speed
    if( (ball.y - ball.ballRadius) <= 0 ){
        speedY *= -1;
    } 

    //collision floor - when hit, gameover
    if( (ball.y + ball.ballRadius) >= canvas.height){
        speedX = 0;
        speedY = 0;
    } 
}

/**
 * Collision detection logic between all the Bricks and Ball
 * When a brick is hit, its "hit" status changes to "true"
 * We will skip detection logic in all bricks whose "hit" status is already "true"
 * 
 * When the ball hits a specific Brick type, if enhances the game properties: 
 * Type 0: double the ball speed
 * Type 1: return to normal speed
 * Type 2: enlarges the paddle width to double its normal size. This is a temporary enhancement, that will last for 25 seconds
 * Type 3: unbreakable bricks
 */
function brickCollisionDetection(){
    for ( let i = 0; i < brickRowNumber; i++){
        for ( let j = 0; j < brickColumnNumber; j++){
            brick = brickWall[i][j];
            if(brick.hit) continue;
            if(ball.x + ball.ballRadius > brick.x && 
                ball.x - ball.ballRadius < brick.x + brick.width &&
                ball.y - ball.ballRadius < brick.y + brick.height &&
                ball.y + ball.ballRadius > brick.y){
                
                    speedY = -speedY;
                    switch(brick.type){
                        case 0:
                            gameSpeed = 2 * defaultGameSpeed;
                            break;
                        case 1:
                            gameSpeed = defaultGameSpeed;
                            break;
                        case 2:
                            if(!timerRunning){
                                
                                // Keep track of the key press statustimer = true;
                                paddle.width *= 2;
                                myTimeout = setTimeout((()=>{
                                    paddle.width = 75;
                                    clearTimeout(myTimeout);
                                    timer = false;
                                }), 25000);
                            }
                            break;
                    }
                    if(brick.type != 3){
                        brick.hit = true;
                        
                    }
            }
        }
    }
}

/**
 * Collision detection logic between Ball and Paddle
 */
function paddleCollisionDetection(){
    // if hit, invert Y speed
    if(ball.x > paddle.position && ball.x < paddle.position + paddle.width && ball.y + ball.ballRadius >= paddle.y){
        speedY = -speedY;
    }
}

/**
 * Keyboard controller logic, for a smooth movement of the paddle
 */
function keyboardController(){
    //in each iteration, reset the paddle's X velocity to zero
    paddle.velocity = 0;

    //if "left" or "right" key is being pressed, update paddle's X velocity
    if(keys.a.pressed) paddle.velocity = -1 * paddleSpeed;
    else if(keys.d.pressed) paddle.velocity = paddleSpeed;
}

// Game Loop
function animate(){
    //The window.requestAnimationFrame() method tells the browser you wish to perform an animation
    window.requestAnimationFrame(animate);

    // Per each refresh cycle, we will "clean" the entire canvas, painting it with black.
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    // Render all the bricks
    for ( let i = 0; i < brickRowNumber; i++){
        for ( let j = 0; j < brickColumnNumber; j++){
            brick = brickWall[i][j];
            brick.update();
        }
    }

    // Collision detection between Wall and Ball
    wallCollisionDetection();
    // Collision detection between Brick and Ball
    brickCollisionDetection();
    // Collision detection between Paddle and Ball
    paddleCollisionDetection();

    ball.update();
    paddle.update();
    keyboardController();
}

animate();

// If "d" or "a" key is pressed, we change its "pressed" status
window.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true;
        break
      case 'a':
        keys.a.pressed = true;
        break
    }
});

// If "d" or "a" key is released, we change its "pressed" status
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
          keys.d.pressed = false;
          break
        case 'a':
          keys.a.pressed = false;
          break
      }
});