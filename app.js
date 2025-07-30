import http from 'http';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url); // C:\Users\vikto\git-repos\HA-Project\Node_js\nodejs_intro\app.js *bezieht sich auf den direkten path*
const __dirname = path.dirname(__filename);  // C:\Users\vikto\git-repos\HA-Project\Node_js\nodejs_intro  *Bezieht sich auf das verzeichnis*
const configPath = path.join(__dirname, `config.json`);

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const { port, hostname } = config;


const server = http.createServer((req, res) => {
    console.log(`Anfrage erhalten: ${req.method} ${req.url}`);

    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('Hallo Welt vom Node.js Server.');
})

server.listen(port, hostname, () => {
        console.log(`Server gestartet unter http://${hostname}:${port}/`);

} )