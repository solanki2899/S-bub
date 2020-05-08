const canvas = document.getElementById('canvas')
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight
let bubbles
var d;
var e;
var paused = false
var score = 0;
var initial = 15
let timer = 10
let alreadyin = 0;
var end = 0
let time = 1000
var count = initial;
const colors = ['#2185C5', '#7ECEFD', '#FFF685', '#FF7F66']                                  /*array of colors*/


function Bubble(x, y, radius, color) {                                                         /*constructor function with 4 paramenter*/
    this.x = x
    this.velocity = {
        x: 5 * (Math.random() - 0.5),
        y: 5 * (Math.random() - 0.5)
    }
    this.y = y
    this.radius = radius
    this.color = color
    this.mass = Math.floor(Math.pow(this.radius, 3))

    this.update = bubbles => {                                            /*update function for bubbles to change their paramenters for animation*/
        
        
        this.draw()
        for (let i = 0; i < bubbles.length; i++) {
            if (this === bubbles[i]) {
                continue
            }
            if (distance(this.x, this.y, bubbles[i].x, bubbles[i].y) - (this.radius + bubbles[i].radius) < 0) {
                resolveCollision(this, bubbles[i])                                              /*calling function to resolve collision b/w any 2 bubbles*/
            }
        }
        if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
            this.velocity.x = -this.velocity.x
        }
        if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
            this.velocity.y = -this.velocity.y
        }
        this.x += this.velocity.x
        this.y += this.velocity.y



    }

    this.draw = () => {
                                                                                            /*function for drawing bubbles to the canvas*/
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.closePath()

        c.beginPath()
        c.arc(this.x + this.radius / 2, this.y + this.radius / 2, this.radius / 10, 0, Math.PI * 2, false)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()

        c.beginPath()
        c.arc(this.x, this.y, 9 * this.radius / 10, Math.PI, 3 * Math.PI / 2, false)
        c.strokeStyle = 'rgba(256,256,256,0.5)'
        c.lineWidth = 3
        c.stroke()
        c.closePath()
    }
}













function init() {
                                                                                        /*function to initialise the webpage*/
    bubbles = []
    for (let i = 0; i < initial; i++) {
        newbub();                                                                           /*calling funciton to create bubbles on the start of the game*/

    }
}

function newbub() {
                                                                                            /*creating random bubbles*/

    //    clearing timeouts because they were interfering
    if (a) {
        clearTimeout(a);
    }
    if (b) {
        clearTimeout(b);
    }
    if (c) {
        clearTimeout(c);
    }
    if (d) {
        clearTimeout(d);
    }




    radius = randomIntFromRange(30,60)                                                      /*randomising new bubble's radius*/
    x = Math.random() * (canvas.width - 2 * radius) + radius
    y = Math.random() * (canvas.height - 2 * radius) + radius
    if (bubbles[0]) {
        for (k = 0; k < bubbles.length; k++) {
            if (distance(x, y, bubbles[k].x, bubbles[k].y) < radius + bubbles[k].radius) {     /*checking that new bubbles dont overlap with existing ones */
                x = Math.random() * (canvas.width - 2 * radius) + radius
                y = Math.random() * (canvas.height - 2 * radius) + radius
                k = -1;

            }
        }
    }

    count--;

    if (count < 1 && !paused) {

        if (area() > 0.40) {                                    /*slowing down bubble generation if bubbles cover up lamost whole screen */
            var a = setTimeout(newbub, 2000)

        } else {

            if (time >= 300) {
                time -= 10
            }
            var b = setTimeout(newbub, time)
        }
    }
    if (area() < 0.36) {                                        /*to reset timer if bubbles no more cover up enough area*/
        timer = 10
        alreadyin = 0
    }
    if (area() > 0.36 && !alreadyin) {                          /*starting countdown if bubbles cover up specified area of the screen*/

        countdown()
    }

    bubbles.push(new Bubble(x, y, radius, randomColor(colors)))             /*pushing new bubble to array*/
}


function countdown() {                                                      /*function to countdown from 10 to 0*/

    alreadyin = 1

    if (timer == 0) {                                                        /*ends game when timer reaches 0*/
        ends()
    }
    if (area() > 0.36 && !paused) {
        e = setTimeout(countdown, 1000)
    }
    if (timer) {
        timer--
    }
}


function animate() {                                                             /*animation loop with RAF*/
    if (!paused) {
        requestAnimationFrame(animate)
        c.clearRect(0, 0, canvas.width, canvas.height)
        if (area() > 0.36) {
            danger()
        }
        bubbles.forEach(bubble => {
            bubble.update(bubbles)                                               /*calling update function of every bubble*/
        })
    }
    if (area() > 0.36) {                                                         /*calling function to draw timer on canvas if screen fills upto specified ratio*/
        danger()
    }
}


function danger() {                                                               /*function to draw timer on the canvas when in danger*/
    c.font = " 70px Arial";
    c.fillStyle = "red";
    c.strokeStyle = "red";
    c.textAlign = "center";
    c.strokeRect(10, 10, 80, 70);
    c.fillText(timer, 50, 70);
}



function pause() {                                                                  /*function to pause the game when pause button is tapped*/

    paused = !paused
    if (paused) {
        document.getElementById("pim").src = "./resume.svg";
    } else {
        document.getElementById("pim").src = "./pause.svg";




        if (area() > 0.40) {                                                        /*restarting bubble generation on game resume*/
            var c = setTimeout(newbub, 2000)
        } else {

            if (time >= 300) {
                time -= 10
            }
            d = setTimeout(newbub, time)

        }
        animate()                                                                   /*restarting animation when game resumes*/





    }
    if (end) {                                                                      /*changing resume button to restart if the game ends*/
        location.reload();
    }

    clearTimeout(e)
    alreadyin = 0


}


function area() {                                                                   /*funtion to return fraction of screen area filled */
    let sum = 0
    for (let i = 0; i < bubbles.length; i++) {
        sum += Math.PI * Math.pow(bubbles[i].radius, 2)
    }
    return sum / (canvas.width * canvas.height)
}

function popped(event) {
                                                                                    /*funtion for popping bubbles on click*/

    for (let i = 0; i < bubbles.length; i++) {
        if (distance(bubbles[i].x, bubbles[i].y, event.clientX, event.clientY) < bubbles[i].radius && !paused) {
            score += (70 - bubbles[i].radius)                                         /*adding 70-radius of popped bubble to the score*/

            bubbles.splice(i, 1)


        }

    }
}

document.addEventListener("click", popped);


function ends() {                                                                      /*function that fires up when the game ends*/
    end = 1
    paused = 1
    document.getElementById("pim").src = "./resume.svg";

    highsc()
    restart = confirm("Score: " + Math.floor(score) + "\nHighscore: " + localStorage.getItem("scores") + "\n\n Restart?")
    if (restart) {

        location.reload();


    }
}



function highsc() {                                                                       /*funciton to store the highscore*/
    if (typeof (Storage) !== "undefined") {
        var scores = false;

        if (localStorage["scores"]) {

            scores = localStorage.getItem("scores")
            if (Math.floor(score) > scores) {
                localStorage.setItem("scores", Math.floor(score))
            }


        } else {

            localStorage.setItem("scores", Math.floor(score))

        }
    }
}


function randomIntFromRange(min, max) {                                                    /*function that returns random integer between 2 numbers*/
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {                                                              /*function that returns random color*/
    return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {                                                         /*function to calculate distance b/w two points*/
    const xDist = x2 - x1
    const yDist = y2 - y1

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}




addEventListener('resize', () => {                                                          /*fto restart game if screen resizes*/
    canvas.width = innerWidth
    canvas.height = innerHeight
    location.reload();

    init()
})






function resolveCollision(particle, otherParticle) {                                        /*function to resolve collision b/w two bubbles*/
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {


        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        const m1 = particle.mass;
        const m2 = otherParticle.mass;


        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);


        const v1 = {
            x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
            y: u1.y
        };
        const v2 = {
            x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2),
            y: u2.y
        };


        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);


        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

function rotate(velocity, angle) {                                              /*for changing direction after colllision b/w bubbles*/
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}




init()                                                                      /*Calling functions to start the game*/
animate()
