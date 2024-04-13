const hostname = '127.0.0.1';
const port = 5500;

const http = require('http');
const nStatic = require('node-static');
const fileServer = new nStatic.Server('./');

http.createServer(function (req, res) {
    fileServer.serve(req, res);
}).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});