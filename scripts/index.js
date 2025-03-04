
function openTab(evt, tabName) {
    // Ocultar todas las secciones de contenido
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remover la clase "active" de todos los botones
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Mostrar la pestaña actual y agregar la clase "active" al botón que la abrió
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    // Cambiar el título según la pestaña seleccionada
    var title = document.querySelector(".top-box h1");
    switch(tabName) {
        case 'home':
            title.textContent = "SilentEcho";
            break;
        case 'about-us':
            title.textContent = "Sobre Nosotros";
            break;
        case 'translate':
            title.textContent = "Traductor";
            break;
        case 'cursos':
            title.textContent = "Cursos";
            break;
        case 'app':
            title.textContent = "Aplicación";
            break;
        default:
            title.textContent = "SilentEcho";
    }
}

// Mostrar por defecto la primera pestaña
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("home").style.display = "block";

    const popup = document.getElementById('popup');

    // Solo mostrar el popup si no ha sido mostrado antes en esta sesión
    if (!sessionStorage.getItem('popupShown')) {
        popup.classList.add('show'); 
        // Al hacer clic en cualquier parte de la pantalla, ocultar el popup
        document.addEventListener('click', function() {
            popup.classList.remove('show');
        });

        // Guardar en sessionStorage que ya se mostró el popup
        sessionStorage.setItem('popupShown', 'true');
    }

    const video = document.getElementById('camera');
    const startButton = document.querySelector('.camera-button');
    let stream = null;

    startButton.addEventListener('click', async () => {
        if (stream) {
            // Apagar la cámara
            stream.getTracks().forEach(track => track.stop()); // Detener todas las pistas del stream
            stream = null; // Reiniciar la variable del stream
            video.pause(); // Pausar el video
            video.srcObject = null; // Eliminar el stream del video
            video.style.visibility = 'hidden'; // Ocultar el video para evitar que se muestre el último fotograma
            video.style.backgroundColor = '#000'; // Establecer fondo negro para evitar mostrar el último fotograma
            startButton.textContent = 'Encender Cámara'; // Cambiar el texto del botón
        } else {
            try {
                // Encender la cámara
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                video.play(); // Reproducir el video
                video.style.visibility = 'visible'; // Mostrar el video
                video.style.backgroundColor = 'transparent'; // Remover fondo negro cuando la cámara está encendida
                startButton.textContent = 'Apagar Cámara'; // Cambiar el texto del botón
            } catch (error) {
                console.error('Error al acceder a la cámara:', error);
            }
        }
    });
});
// Cambiar entre modos "Escribir" y "Traducir"
document.getElementById("mode-selector").addEventListener("change", function() {
    const selectedMode = this.value;
    const writeMode = document.getElementById("write-mode");
    const translateMode = document.getElementById("translate-mode");

    if (selectedMode === "write") {
        writeMode.style.display = "block";
        translateMode.style.display = "none";
    } else if (selectedMode === "translate") {
        writeMode.style.display = "none";
        translateMode.style.display = "block";
    }
});

// Función para ejecutar la conversión de letras al presionar Enter
document.getElementById("letter-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("convert-button").click();
    }
});

// Función de conversión al hacer clic en "Convertir"
document.getElementById("convert-button").addEventListener("click", function() {
    const letter = document.getElementById("letter-input").value.toUpperCase();
    const imageContainer = document.getElementById("image-sing-container");

    if (letter.match(/^[A-Z]$/)) {
        // Lógica para asignar la imagen correspondiente a la letra ingresada
        imageContainer.innerHTML = `<img src="ruta_de_imagen/${letter}.png" alt="Letra ${letter}" />`;
    } else {
        imageContainer.innerHTML = '<p>Por favor ingresa una letra válida.</p>';
    }
});

// Variables globales
let mediaRecorder;
let recordedChunks = [];

// Funcionalidad para activar la cámara y grabar
document.getElementById("start-recording").addEventListener("click", function() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            document.getElementById("camera-feed").srcObject = stream;
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.ondataavailable = function(event) {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            document.getElementById("stop-recording").disabled = false;
            document.getElementById("start-recording").disabled = true;
        })
        .catch(error => {
            console.error("Error al acceder a la cámara: ", error);
        });
});

// Funcionalidad para detener la grabación
document.getElementById("stop-recording").addEventListener("click", function() {
    mediaRecorder.stop();

    mediaRecorder.onstop = function() {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);
        console.log("Video grabado: ", videoURL); // Aquí puedes manejar el archivo grabado como necesites

        // Resetea la grabación para la próxima vez
        recordedChunks = [];
    };

    document.getElementById("start-recording").disabled = false;
    document.getElementById("stop-recording").disabled = true;

    // Detener el flujo de la cámara
    const stream = document.getElementById("camera-feed").srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop()); // Detiene los tracks de video
    document.getElementById("camera-feed").srcObject = null; // Limpia el video
});

// Efecto de hover para cambiar color de la lista desplegable (modo-selector)
const modeSelector = document.getElementById("mode-selector");

modeSelector.addEventListener("mouseover", function() {
    this.style.backgroundColor = "#3E016A";
    this.style.color = "white";
});

modeSelector.addEventListener("mouseout", function() {
    this.style.backgroundColor = "";
    this.style.color = "";
});
document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del DOM
    const modeSelector = document.getElementById('mode-selector');
    const writeMode = document.getElementById('write-mode');
    const translateMode = document.getElementById('translate-mode');
    const vozMode = document.getElementById('voz-mode');
    
    // Función para cambiar entre modos
    function switchMode() {
        const selectedMode = modeSelector.value;
        
        // Ocultar todos los modos
        writeMode.style.display = 'none';
        translateMode.style.display = 'none';
        vozMode.style.display = 'none';
        
        // Mostrar el modo seleccionado
        if (selectedMode === 'write') {
            writeMode.style.display = 'block';
        } else if (selectedMode === 'translate') {
            translateMode.style.display = 'block';
        } else if (selectedMode === 'voz') {
            vozMode.style.display = 'block';
        }
    }
    
    // Cambiar de modo al seleccionar una opción del dropdown
    modeSelector.addEventListener('change', switchMode);

    // Modo Texto a Voz
    const textToVoiceButton = document.getElementById('text-to-voice-button');
    const voiceTextInput = document.getElementById('voice-text-input');

    textToVoiceButton.addEventListener('click', function() {
        const texto = voiceTextInput.value;
        if (texto) {
            const voz = new SpeechSynthesisUtterance(texto);
            voz.lang = 'es-ES'; // Español
            window.speechSynthesis.speak(voz);
        } else {
            alert('Por favor, escribe algún texto.');
        }
    });

    // Iniciar con el modo de escribir por defecto
    switchMode();
});

// Seleccionar todas las tarjetas de los modos
document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', function() {
        const mode = this.getAttribute('data-mode');
        
        // Ocultar las tarjetas y mostrar el modo seleccionado
        document.getElementById('mode-cards').style.display = 'none';
        document.getElementById(mode).style.display = 'block';

        // Mostrar el botón de volver
        document.getElementById('back-button').style.display = 'block';

        // Ocultar el input del código de conexión si ya está visible
        document.getElementById('code-section').style.display = 'none';
    });
});

// Funcionalidad del botón de volver
document.getElementById('back-button').addEventListener('click', function() {
    // Mostrar las tarjetas de nuevo
    document.getElementById('mode-cards').style.display = 'flex';
    
    // Ocultar los modos y el botón de volver
    document.querySelectorAll('.mode-content').forEach(mode => {
        mode.style.display = 'none';
    });

    // Volver a mostrar el input del código de conexión
    document.getElementById('code-section').style.display = 'block';
    
    this.style.display = 'none'; // Ocultar el botón de volver
});

// Funcionalidad para conectar usando el código ingresado
document.getElementById('submit-code').addEventListener('click', function() {
    const code = document.getElementById('code-input').value;
    
    if (code) {
        alert('Conectado con éxito utilizando el código: ' + code);
    } else {
        alert('Por favor, ingresa un código.');
    }
});

let index = 0; // Inicializa el índice de la imagen

// Función para mover el carrusel hacia la derecha
function moveCarousel() {
    const images = document.querySelectorAll('.carrusel-imagen');
    const totalImages = images.length;

    // Calcula el nuevo índice
    index = (index + 1) % totalImages; // Aumenta el índice y reinicia al final
    const offset = index * (images[0].clientWidth + 20); // Desplazamiento total (ancho de imagen + margen)

    // Aplica la transformación al carrusel
    document.querySelector('.carrusel').style.transform = `translateX(-${offset}px)`; // Cambia el signo aquí
}

// Mueve el carrusel cada 2 segundos
setInterval(moveCarousel, 2000);


// Selecciona el carrusel
const carrusel = document.querySelector('.carrusel');

// Función para mover el carrusel automáticamente
function scrollCarrusel() {
    const items = document.querySelectorAll('.carrusel-item');
    const firstItem = items[0];
    
    // Mueve el carrusel
    carrusel.appendChild(firstItem); // Mueve el primer elemento al final

    // Ajusta el desplazamiento para mantener el scroll
    carrusel.style.transition = 'none'; // Desactiva la transición
    carrusel.style.transform = `translateX(0)`; // Resetea la posición

    // Fuerza un reflow para reiniciar la animación
    void carrusel.offsetWidth; 

    // Reenactiva la transición y desplaza
    carrusel.style.transition = 'transform 0.5s ease'; // Vuelve a activar la transición
    setTimeout(() => {
        carrusel.style.transform = `translateX(-${firstItem.offsetWidth + 10}px)`; // Desplaza a la izquierda
    }, 50); // Un pequeño retraso para que se aplique el reflow

}

// Inicia el desplazamiento cada 3 segundos
setInterval(scrollCarrusel, 3000);
window.addEventListener('scroll', function() {
    var frase = document.querySelector('.frase');
    var posicion = frase.getBoundingClientRect().top;
    var screenPosition = window.innerHeight / 1.3;

    if (posicion < screenPosition) {
        frase.classList.add('scroll-active');
    }
});
async function buscarGif() {
    const palabra = document.getElementById('palabra').value.toUpperCase();
    const resultado = document.getElementById('resultado');
    
    try {
        const response = await fetch('gifs.json');
        const gifs = await response.json();
        
        console.log(gifs); // Verifica que el JSON se carga correctamente
        console.log(`Palabra buscada: ${palabra}`); // Verifica la palabra buscada
        
        if (gifs[palabra]) {
            resultado.innerHTML = `<img src="${gifs[palabra]}" alt="${palabra}">`;
        } else {
            resultado.innerHTML = `<p>No se encontró un GIF para la palabra: ${palabra}</p>`;
        }
    } catch (error) {
        console.error("Error al cargar el archivo JSON", error);
        resultado.innerHTML = `<p>Error al cargar los gifs.</p>`;
    }
}
