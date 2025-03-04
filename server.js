const express = require('express'); // Importa Express
const app = express(); // Crea una instancia de Express
const port = 3080; // Define el puerto que deseas usar (puedes cambiarlo si quieres)

// Sirve los archivos estáticos desde la carpeta donde está tu index.html (ej: raíz del proyecto)
app.use(express.static(__dirname)); // `__dirname` representa la carpeta actual

// Define una ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Asegúrate de tener index.html en la raíz
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
