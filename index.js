// self-driving car tutorial from Radu in freecodecamp: 
// https://www.youtube.com/watch?v=Rs_rAxEsAvI&t=1s

const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 500;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9);

const N = 100;
const cars = getCars(N);
let bestCar = cars[0];
if(localStorage.getItem("BestBrain")) {
    for(let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("BestBrain"));
        if(i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -700, 30, 50, "DUMMY", 2),
];

animate();

function saveBrain() {
    localStorage.setItem("BestBrain", JSON.stringify(bestCar.brain));
}

function discardBrain() {
    localStorage.removeItem("BestBrain"); 
}

function getBestCar(cars) {
    return cars.find(c => c.y == Math.min(...cars.map(c => c.y)));
}

function getCars(N) {
    const cars = [];
    for(let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }

    return cars;
}

function animate(time) {
    for(let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    for(let car of cars) {
        car.update(road.borders, traffic);
    }

    bestCar = getBestCar(cars);

    //this line refreshes the frame as well as setting the height
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
    for(let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "gray");
    }
    road.draw(carCtx);

    carCtx.globalAlpha = 0.2;
    for(let car of cars) {
        car.draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}