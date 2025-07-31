import http from 'http';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url); // C:\Users\vikto\git-repos\HA-Project\Node_js\nodejs_intro\app.js *bezieht sich auf den direkten path*
const __dirname = path.dirname(__filename);  // C:\Users\vikto\git-repos\HA-Project\Node_js\nodejs_intro  *Bezieht sich auf das verzeichnis*
const configPath = path.join(__dirname, `config.json`);

const config = JSON.parse(await readFile(configPath, 'utf8'));
const { port, hostname } = config;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function getRequestBody(req) {
    return new Promise((resolve, reject) =>{
        let body = "";
        req.on('data', teil => {
            body += teil.toString();

        })
        req.on("end", () => {
            
        })

    });
}

let posts = [
    {id: 1,
    title: "Mein erster Blogbeitrag",
    content: "Das sind die Inhalte von meinem ersten Blogbeitrag.",
    author: "Alice",
    date: "2025-07-29"
    },
    {
        id: 2,
        title: "Node.js Grundlagen",
        content: "In diesem Beitrag beschribe ich die Node.js Grundlagen.",
        author: "Bob",
        date: "2025-07-30"
    }
]

let nextId = posts.length;

const server = http.createServer(async(req, res) => {
    console.log(`Anfrage erhalten: ${req.method} ${req.url}`);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === "OPTIONS") {
        res.writeHead(204); // 204 HTTP - no content, but working
        res.end();
        return;
    }

    
    if (req.method === "GET" && req.url === "/posts") {
        res.writeHead(200, {"Content-Type": "application/json"}); // status OK
        await delay(1500);
        res.end(JSON.stringify(posts)); //make strings out of JSON
    } 

    else if (req.method === "GET" && req.url.match(/^\/posts\/(\d+)$/)) {
        const ID = parseInt(req.url.split("/")[2]); // variable nur für ID der Eintrag
        const post = posts.find(post => post.id === ID);
        
        if (post) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(post));
        } 
        
        else {
            res.writeHead(404, {"Content-Type": "application/json"});
            res.end(JSON.stringify({message: "ID nicht gefunden"}));


        }

   

   
    } else if (req.method === "POST" && req.url === "/posts") {
        // res.writeHead(201, {"Content-Type": "application/json"});
        // await delay(1500);
        // res.end(JSON.stringify({message: "Blogbeitrag Erstellung empfangen (body noch nicht erstellt)"}));
     try {
            const body = await getRequestBody(req);
            const newPost = JSON.parse(body);

            if (!newPost.title || !newPost.author || !newPost.content) {
                res.writeHead(400, {"Content-Type": "application/json"});
                res.end(JSON.stringify({message: "Bad request: Fehlende Felder (title/author/content)"}));
                return;
            }
            newPost.id = ++nextId ;
            newPost.date = new Date().toISOString().split("T")[0];

            posts.push(newPost)
            res.writeHead(201, {"Content-Type": "application/json"});
            res.end(JSON.stringify(newPost));


        } catch (fehler) {
            console.error("Fehler beim parsen JSON", fehler);
            res.writeHead(400, {"Content-Type": "application/json"});
            res.end(JSON.stringify({message: "JSON ungültig"}));

        }
    }
    else {
        res.writeHead(404, {"Content-Type": "application/json"});
        res.end(JSON.stringify({message: "Endpunkt nicht gefunden"}));
    }

});
// create a server that listens on X port, Y hostname
server.listen(port, hostname, () => {
    console.log(`Server gestartet unter http://${hostname}:${port}/`);
    console.log(`Teste den GET /posts Endpunkt unter http://${hostname}:${port}/posts`);
    console.log(`Blogbeitrag 1 Testen: http://${hostname}:${port}/posts/1`);
    console.log(`Nicht existierende Blogbeitrag: http://${hostname}:${port}/posts/99`);
});


