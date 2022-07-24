class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI / 2;

        this.rays = [];
    }

    #castRays() {
        this.rays = [];
        for(let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread / 2, // raySpread is the total angle so the left side would have half of this angle and the right side the other half
                - this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;

            const start = {x: this.car.x, y: this.car.y};
            const end = {x: this.car.x - Math.sin(rayAngle) * this.rayLength, 
                y: this.car.y - Math.cos(rayAngle) * this.rayLength};
        
            this.rays.push([start, end]);
        }

    }

    update() {
        this.#castRays();
    }

    draw(ctx) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'yellow';
        for(let i = 0; i < this.rayCount; i++) {
            ctx.beginPath();
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.stroke();
        }
    }
}