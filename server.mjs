// server.js
import express from 'express';
import path from 'path';
import serveStatic from 'serve-static';

const __dirname = import.meta.dirname;

const app = express();
app.use(serveStatic(__dirname + "\\dist"));
var port = process.env.PORT || 5000;
var hostname = '127.0.0.1';

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});