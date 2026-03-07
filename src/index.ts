import Server from "./server.js";

const port = 8080;

const server = new Server(port, process.cwd()).start();

console.log(`Server running at http://localhost:${port}/`);
