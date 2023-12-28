class Ball{
    constructor(){
        // ball initial position
        this.x = canvas.width/2;
        this.y = canvas.height-30;
        // ball radius
        this.ballRadius = 10
        // additional radius for the gradient filling
        this.innerRadius = 1;
        this.outerRadius = 15;
    }
  
    draw(){
        this.gradient = c.createRadialGradient(this.x, this.y, this.innerRadius, this.x+5, this.y-10, this.outerRadius);
        this.gradient.addColorStop(0, 'white');
        this.gradient.addColorStop(1, 'grey');
        c.beginPath();
        c.arc(this.x, this.y, this.ballRadius, 0, Math.PI*2);
        c.fillStyle = this.gradient;
        c.fill();
        c.closePath();
    }
  
    update(){
        // Update ball position with the correct speed direction and gameSpeed
        this.x += speedX * gameSpeed;
        this.y += speedY * gameSpeed;
        this.draw();
    }
  }