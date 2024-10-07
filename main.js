//Inicializacion

let tarjetasDestapadas = 0
let tarjeta1 = null, tarjeta2 = null;
let primerResultado = null, segundoResultado = null;
let movimientos = 0;
let movimientosMostrar = document.getElementById('movimientos');
let aciertos = 0;
let aciertosMostrar = document.getElementById('aciertos');
let temporizador = false;
let timer = 30;
let tiempoRestanteMostrar = document.getElementById('t-restante');
let tiempoRegresivoIdInterval = null;

let numeros = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
numeros = shuffleArray(numeros);

//Audios

let audioWin = new Audio('./sounds/win.wav');
let audioRight = new Audio('./sounds/right.wav');
let audioClick = new Audio('./sounds/click.wav');
let audioWrong = new Audio('./sounds/wrong.wav');
let audioLose = new Audio('./sounds/lose.wav');

//Funciones

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambia elementos
    }
    return array;
}

function bloquearTarjetas() {
    for (let i = 0; i <= 15; i++) {
        let tarjetaActual = document.getElementById(i);
        tarjetaActual.innerHTML = `<img src="./img/${numeros[i]}.png"/>`;
        tarjetaActual.disabled = true;
    }
}

function contarTiempo() {
    //console.log("Contar tiempo")
    tiempoRegresivoIdInterval = setInterval(() => {
        //console.log("Timer: ", timer)
        timer--;
        tiempoRestanteMostrar.innerText = `Tiempo: ${timer} segundos`;
        if (timer == 0) {
            //Perdió
            bloquearTarjetas();
            audioLose.play();
            clearInterval(tiempoRegresivoIdInterval);
        }
    }, 1000);
}

function destapar(id) {
    //console.log("Destapar temporizador", id, temporizador)
    if (temporizador == false) {
        contarTiempo();
        temporizador = true;
    }

    tarjetasDestapadas++;
    if (tarjetasDestapadas == 1) {
        //Mostrar el primer numero
        tarjeta1 = document.getElementById(id);
        primerResultado = numeros[id];
        audioClick.play();
        tarjeta1.innerHTML = `<img src="./img/${primerResultado}.png"/>`;

        //Deshabilitar boton
        tarjeta1.disabled = true;
    } else if (tarjetasDestapadas == 2) {
        //Mostrar segundo numero
        tarjeta2 = document.getElementById(id);
        segundoResultado = numeros[id];
        tarjeta2.innerHTML = `<img src="./img/${segundoResultado}.png"/>`;

        //Deshabilitar boton
        tarjeta2.disabled = true;

        //Incrementar contador de movimientos
        movimientos++;
        movimientosMostrar.innerText = `Movimientos: ${movimientos}`;

        if (primerResultado == segundoResultado) {
            tarjetasDestapadas = 0;

            aciertos++;
            aciertosMostrar.innerText = `Aciertos: ${aciertos}`;

            audioRight.play();

            if (aciertos == 8) {
                //Ganó
                clearInterval(tiempoRegresivoIdInterval);
                audioWin.play();
            }
        } else {
            audioWrong.play();
            setTimeout(() => {
                tarjeta1.innerText = '';
                tarjeta2.innerText = '';
                tarjeta1.disabled = false;
                tarjeta2.disabled = false;
                tarjetasDestapadas = 0;
            }, 500)
        }
    }
}