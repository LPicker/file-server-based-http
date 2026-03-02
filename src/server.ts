import * as http from "node:http";
import { Directory, type FileEntry } from "./directory.js";
import { getMimeType } from "./utils/file.js";

export default class Server {
  port: number;
  directory: Directory;

  constructor(port: number, dir = ".") {
    this.port = port;
    this.directory = new Directory(dir);
  }

  start(): void {
    http.createServer((req, res) => this.handleRequest(req, res)).listen(this.port);
    console.log(`Server running at http://localhost:${this.port}/`);
  }

  handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    if (!req.url || req.url === "/") {
      const rootList = this.directory.list();
      const directoryViews = this.getDirectoryViews(rootList);

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(directoryViews);
    } else {
      const result = this.directory.readPath(req.url.replace("/", ""));

      if (Array.isArray(result)) {
        res.writeHead(200, { "Content-Type": "text/html" });
        const directoryViews = this.getDirectoryViews(result);
        res.end(directoryViews);
      } else {
        if (result === null) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Not Found");
        } else {
          // Content-Type 应该对应请求文件的 mimetype
          res.writeHead(200, { "Content-Type": getMimeType(req.url) + "; charset=utf-8" });
          res.end(result);
        }
      }
    }
  }

  getFileItemView(file: FileEntry): string {
    return `
      <li class="${file.isDirectory ? "folder" : ""}">
        <a href="./${file.name}${file.isDirectory ? "/" : ""}">${file.name}${file.isDirectory ? "/" : ""}</a>
      </li>
    `;
  }

  getDirectoryViews(list: FileEntry[]): string {
    return `
      <ul>
        ${list.map((file) => this.getFileItemView(file)).join("")}
      </ul>
    `;
  }
}
