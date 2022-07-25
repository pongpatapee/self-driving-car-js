// self-driving car tutorial from Radu in freecodecamp: 
// https://www.youtube.com/watch?v=Rs_rAxEsAvI&t=1s

const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 500;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
];
animate();

function animate(time) {
    for(let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    car.update(road.borders, traffic);
    //this line refreshes the frame as well as setting the height
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -car.y + carCanvas.height * 0.7);
    for(let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "gray");
    }
    road.draw(carCtx);
    car.draw(carCtx, "blue");

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, car.brain);
    requestAnimationFrame(animate);
}