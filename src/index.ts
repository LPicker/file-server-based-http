import Server from "./server.js";

const server = new Server(8080, process.cwd()).start();
