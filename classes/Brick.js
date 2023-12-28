class Brick{
    constructor( x, y, width, height, type ){
        this.innerRadius = 1;
        this.outerRadius = 60;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;

        this.hit = false;

        if(this.type == 0) this.color = 'red'; // ball speed x 2
        if(this.type == 1) this.color = 'green'; // returns to normal
        if(this.type == 2) this.color = 'blue'; // expands paddle x2
        if(this.type == 3) this.color = '#FFB833'; // can't destroy
        if(this.type == 4) this.color = '#CCCCCC'; // can't destroy
    }

    draw(){
        
        this.gradient = c.createRadialGradient(this.x + this.width - 20, this.y, this.innerRadius, this.x + this.width, this.y-30, this.outerRadius);
        this.gradient.addColorStop(0, 'white');
        this.gradient.addColorStop(1, this.color);
        c.beginPath();
        c.rect(this.x, this.y, this.width, this.height);
        c.fillStyle = this.gradient;
        c.fill();
        c.closePath();
    }

    update(){
        // only draw bricks that were not hit yet
        if(!this.hit) this.draw();
    }
}