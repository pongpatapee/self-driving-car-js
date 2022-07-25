class Car {
    constructor(x, y, width, height, controleType, maxSpeed=3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        this.speed = 0;
        this.acc = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damage = false;        

        if(controleType != "DUMMY") {
            this.sensor = new Sensor(this);
        }
        this.controls = new Controls(controleType);
    }

    draw(ctx, color) {
        if(this.damage) {
            ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        
        if(this.sensor) {
            this.sensor.draw(ctx);
        }
    }

    update(roadBorders, traffic) {
        if(!this.damage) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damage = this.#assessDamage(roadBorders, traffic);
        }
        if(this.sensor) {
            this.sensor.update(roadBorders, traffic);
        }
    }

    #assessDamage(roadBorders, traffic) {
        for(let i = 0; i < roadBorders.length; i++) {
            if(polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }    

        for(let i = 0; i < traffic.length; i++) {
            if(polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }

        return false;
    }

    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2; // distance from middle of car to any of the corners
        const alpha = Math.atan2(this.width, this.height); // angle from middle of the car to any of the corners

        //top right corner
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad,
        });

        //top left corner
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad,
        });

        //bottom right corner
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
        });

        //bottom left corner
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
        });

        return points;
    }

    #move() {

        if (this.controls.forward) {
            this.speed += this.acc;
        }
        if (this.controls.reverse) {
            this.speed -= this.acc;
        }
        if(this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if(this.speed < -this.maxSpeed/2) {
            this.speed = -this.maxSpeed/2;
        }
        if(this.speed > 0) {
            this.speed -= this.friction;
        }
        if(this.speed < 0) {
            this.speed += this.friction;
        }
        if(Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1: -1;
            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }
}