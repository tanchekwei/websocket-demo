const http = require("http");
const websocketServer = require("websocket").server;
const fs = require('fs').promises;
let connection;

const requestListener = function (req, res) {
    fs.readFile(__dirname + "/index.html").then(contents => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(contents);
    })
};
const httpserver = http.createServer(requestListener)
const websocket = new websocketServer({
    "httpServer": httpserver
})

websocket.on("request", request => {
    connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("Connection opened"))
    connection.on("close", () => console.log("Connection closed"))
    connection.on("message", message => {
        console.log(`Received message: ${message.utf8Data}`)
        connection.send(`Server echo ${message.utf8Data}`)
    })
})

httpserver.listen(8080, () => {
    console.log("Server listening to 8080")
})