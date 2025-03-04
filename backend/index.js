var express = require('express')
let cors = require("cors")
const { connection } = require('./database')
var app = express()

app.use(express.json())

var whitelist = ['http://localhost:5501', 'http://127.0.0.1:5501']
var corsOptions = {
    method: ["GET", "POST"],    
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
        } else {
        callback(new Error('Not allowed by CORS'))
        }
    }
}


app.use(cors(corsOptions))

app.post("/letras/:letter", async (request, response) => {
    try {
        
        const letter = request.params.letter;
    
        connection.query("SELECT * FROM letras WHERE letra = ?", [letter], (err, result) => {
            if (err) {
                console.log("Error: ", err)
            }
            return response.json(result[0])
        })
    } catch (err) {
        console.log(err)
    }

})

app.listen(3306, (err) => {
    if (err) {

    }
    console.log("Servidor ejecutandose en el puerto", 3306)
})
