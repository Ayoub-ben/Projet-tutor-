const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let playAnim = false;

let ball = {x:30,y:30,vitesse:0.1,t:0,radius:20}; 
let playBtn = document.getElementById("play-btn");

let slider = document.getElementById("slider"); 
let sliderTxt = document.getElementById("slider-text");
sliderTxt.textContent = slider.value;



slider.oninput = () => {  // recupere et affiche la valeur de la vitesse
    sliderTxt.textContent = slider.value;
    sliderValeur(slider.value)
}



function sliderValeur(sliderValue) { //cree les 10 vitesse de parcours
    let tPercentage = sliderValue / 10;
    tPercentage = tPercentage * 0.1;
    ball.vitesse = tPercentage;
}



let points = [   // coordonnée de la courbe 
    {x:ball.x,y:ball.y}, 
    {x:450,y:200}, 
    {x:500,y:295},
    {x:50,y:500} 
]



function drawBall(){ //dessine la balle
    ctx.beginPath();
    ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI * 2,false);
    ctx.fill();
}



function deplaceBall(){ //deplace la balle sur la courbe
    let [p0, p1, p2, p3] = points;
    let cx = 3 * (p1.x - p0.x);  //calculer les differents coefficients
    let bx = 3 * (p2.x - p1.x) - cx;
    let ax = p3.x - p0.x - cx - bx;

    let cy = 3 * (p1.y - p0.y);
    let by = 3 * (p2.y - p1.y) - cy;
    let ay = p3.y - p0.y - cy -by;

    let t = ball.t;

    ball.t += ball.vitesse;
    let xt = ax*(t*t*t) + bx*(t*t) + cx*t + p0.x;
    let yt = ay*(t*t*t) + by*(t*t) + cy*t + p0.y;

    if(ball.t > 1){
        ball.t=1;
        chronoStop();
    }

    ball.x = xt;
    ball.y = yt;
    drawBall();

}

 

function drawCourbe() { //dessine la courbe
    ctx.beginPath();
    ctx.moveTo(points[0].x,points[0].y);
    ctx.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
    ctx.stroke();
}



function animation(){ ////// lance les animations au bons moments
    requestAnimationFrame(animation); //notifie le navigateur que vous souhaitez exécuter une animation et demande que celui-ci exécute une fonction spécifique de mise à jour de l'animation
    ctx.clearRect(0,0,canvas.width,canvas.height);
    btnText();
    if(!playAnim){
        drawBall(); 
        drawCourbe();

    }else{
        deplaceBall();
        drawCourbe();
        }
}

animation();



function btnText() {  //affiche le recommencer 
    if(ball.x === points[3].x && ball.y === points[3].y){
        playBtn.textContent = "Recommencer";
}
}



playBtn.addEventListener("click",() => { //lance quand on click
    playAnim = true; 
    start = new Date();
    chrono();
    if(ball.x === points[3].x && ball.y === points[3].y ){
        ball.t = 0;
        ball.x = points[0].x;
        ball.y = points[0].y;
        playBtn.textContent = "Play";
        }
        start = new Date();
	    
});



var startTime = 0;
var start = 0;
var end = 0;
var diff = 0;
var timerID = 0;



function chrono(){ //chronometre
	end = new Date();
	diff = end - start;
	diff = new Date(diff);
	var msec = diff.getMilliseconds();
	var sec = diff.getSeconds();
	var min = diff.getMinutes();
	var hr = diff.getHours()-1;
	if (min < 10){
		min = "0" + min;
	}
	if (sec < 10){
		sec = "0" + sec;
	}
	if(msec < 10){
		msec = "00" +msec;
	}
	else if(msec < 100){
		msec = "0" +msec;
	}
	document.getElementById("chronotime").value = hr + ":" + min + ":" + sec + ":" + msec;
	timerID = setTimeout("chrono()", 10);
}



function chronoContinue(){ //continue le chrono
	start = new Date()-diff;
	start = new Date(start);
	chrono();
}


function chronoReset(){  //recommecence le chrono a 0
	document.getElementById("chronotime").value = "0:00:00:000";
	start = new Date();
}


function chronoStopReset(){ //stop et recommecence le chrono a 0
	document.getElementById("chronotime").value = "0:00:00:000";
	document.chronoForm.startstop.onclick = chronoStart;
}


function chronoStop(){
	clearTimeout(timerID);
}