const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Sirve archivos estáticos (como HTML, CSS, JS)

// Conectar al WebSocket
io.on('connection', (socket) => {
    console.log('Un nuevo usuario se ha conectado');

    // Escuchar eventos enviados por el cliente
    socket.on('seleccionarHerramienta', (data) => {
        // Emitir a todos los demás clientes que se ha seleccionado una herramienta
        socket.broadcast.emit('herramientaSeleccionada', data);
    });

    socket.on('enviarImagen', (data) => {
        socket.broadcast.emit('mostrarImagen', data);
    });

    socket.on('enviarGif', (data) => {
        socket.broadcast.emit('mostrarGif', data);
    });

    socket.on('disconnect', () => {
        console.log('Un usuario se desconectó');
    });
});

// Iniciar el servidor en el puerto 3000
server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
