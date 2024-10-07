// Inicialización
let tarjetasDestapadas = 0;
let tarjeta1 = null, tarjeta2 = null;
let primerResultado = null, segundoResultado = null;
let movimientos = 0;
let aciertos = 0;
let temporizador = false;
let timer = 30;
let tiempoRegresivoIdInterval = null;

const movimientosMostrar = document.getElementById('movimientos');
const aciertosMostrar = document.getElementById('aciertos');
const tiempoRestanteMostrar = document.getElementById('t-restante');

// Audios
let audioWin = new Audio('./sounds/win.wav');
let audioRight = new Audio('./sounds/right.wav');
let audioClick = new Audio('./sounds/click.wav');
let audioWrong = new Audio('./sounds/wrong.wav');
let audioLose = new Audio('./sounds/lose.wav');

// Generar la tabla
const totalBotones = 16;
let tablaHTML = '';

for (let i = 0; i < totalBotones; i++) {
    if (i % 4 === 0) {
        tablaHTML += '<tr>'; // Inicia una nueva fila cada 4 botones
    }
    // Remueve el onclick en la generación de botones
    tablaHTML += `<td><button class="card" id="${i}"></button></td>`;
    if (i % 4 === 3) {
        tablaHTML += '</tr>'; // Cierra la fila cada 4 botones
    }
}

// Inserta la tabla generada en el HTML
document.getElementById('tabla-juego').innerHTML = tablaHTML;

// Añade los event listeners después de que los botones han sido creados
for (let i = 0; i < totalBotones; i++) {
    document.getElementById(`${i}`).addEventListener('click', function() {
        destapar(i); // Llama a la función destapar pasando el índice
    });
}

//
document.getElementById('reiniciar-partida').addEventListener('click', reiniciar);

// Números aleatorios para las tarjetas
let numeros = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
numeros = shuffleArray(numeros);

// Función para barajar los números
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambia elementos
    }
    return array;
}

// Función para bloquear todas las tarjetas
function bloquearTarjetas() {
    for (let i = 0; i <= 15; i++) {
        let tarjetaActual = document.getElementById(i);
        tarjetaActual.innerHTML = `<img src="./img/${numeros[i]}.png"/>`;
        tarjetaActual.disabled = true;
    }
}

// Función para contar tiempo
function contarTiempo() {
    tiempoRegresivoIdInterval = setInterval(() => {
        timer--;
        tiempoRestanteMostrar.innerText = `Tiempo: ${timer} segundos`;
        if (timer === 0) {
            // Perdió el juego
            bloquearTarjetas();
            clearInterval(tiempoRegresivoIdInterval);
            audioLose.play();
            mostrarModal('derrota');
        }
    }, 1000);
}

// Función para mostrar el modal adecuado
function mostrarModal(resultado) {
    if (resultado === 'victoria') {
        document.getElementById('modal-victoria').classList.add('show');
        document.getElementById('tiempo-final').innerText = 30 - timer;
    } else {
        document.getElementById('modal-derrota').classList.add('show');
    }
}

// Función para destapar tarjetas
function destapar(id) {
    if (!temporizador) {
        contarTiempo();
        temporizador = true;
    }

    console.log("ID obtenido:", id)

    tarjetasDestapadas++;

    if (tarjetasDestapadas === 1) {
        tarjeta1 = document.getElementById(id);
        primerResultado = numeros[id];
        tarjeta1.innerHTML = `<img src="./img/${primerResultado}.png"/>`;
        tarjeta1.disabled = true;
        audioClick.play();
    } else if (tarjetasDestapadas === 2) {
        tarjeta2 = document.getElementById(id);
        segundoResultado = numeros[id];
        tarjeta2.innerHTML = `<img src="./img/${segundoResultado}.png"/>`;
        tarjeta2.disabled = true;

        movimientos++;
        movimientosMostrar.innerText = `Movimientos: ${movimientos}`;

        if (primerResultado === segundoResultado) {
            tarjetasDestapadas = 0;
            aciertos++;
            aciertosMostrar.innerText = `Aciertos: ${aciertos}`;
            audioRight.play();

            if (aciertos === 8) {
                // Ganó el juego
                clearInterval(tiempoRegresivoIdInterval);
                audioWin.play();
                mostrarModal('victoria');
            }
        } else {
            audioWrong.play();
            setTimeout(() => {
                tarjeta1.innerHTML = '';
                tarjeta2.innerHTML = '';
                tarjeta1.disabled = false;
                tarjeta2.disabled = false;
                tarjetasDestapadas = 0;
            }, 500);
        }
    }
}

// Función para reiniciar el juego
function reiniciar() {
    location.reload();
}
