class Paddle{
    constructor(){
        // Paddle initial dimensions
        this.width = 75;
        this.height = 10;

        // Paddle initial position
        this.x = (canvas.width - this.width)/2;
        this.y = canvas.height - this.height;
        this.velocity = 0;
        this.position = this.x;
    }

    draw(){
        c.beginPath();
        c.roundRect(this.position, this.y - gamePadding , this.width, this.height, 10);
        c.fillStyle = "#A8998A";
        c.fill();
        c.closePath();
    }

    update(){
        // Game area limitations for the paddle to move between left wall and the right wall
        if(this.position < 0 ) {
            this.position = 0;
            this.velocity = 0;
        } else if ( this.position + this.width > canvas.width) {
            this.position = canvas.width - this.width;
            this.velocity = 0;
        }
        this.position += this.velocity;
        this.draw();
    }
}