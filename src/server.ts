import * as http from "node:http";
import { Directory, type FileEntry } from "./directory.js";
import { getMimeType } from "./utils/file.js";

function getContentTypeStr(mimeType: string): string {
  return `${mimeType}; charset=utf-8`;
}

export default class Server {
  port: number;
  directory: Directory;

  constructor(port: number, dir = ".") {
    this.port = port;
    this.directory = new Directory(dir);
  }

  start(): void {
    http.createServer((req, res) => this.handleRequest(req, res)).listen(this.port);
  }

  handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    if (!req.url || req.url === "/") {
      const rootList = this.directory.list();
      const directoryViews = this.getDirectoryViews(rootList);

      res.writeHead(200, { "Content-Type": getContentTypeStr("text/html") });
      res.end(directoryViews);
    } else {
      const requestPath = decodeURIComponent(req.url).replace("/", "");
      const result = this.directory.readPath(requestPath);

      if (Array.isArray(result)) {
        res.writeHead(200, { "Content-Type": getContentTypeStr("text/html") });
        const directoryViews = this.getDirectoryViews(result);
        res.end(directoryViews);
      } else {
        if (result === null) {
          res.writeHead(404, { "Content-Type": getContentTypeStr("text/plain") });
          res.end("Not Found");
        } else {
          // Content-Type 应该对应请求文件的 mimetype
          res.writeHead(200, { "Content-Type": getContentTypeStr(getMimeType(req.url)) });
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
    if (list.length === 0) {
      return "<p>Empty Directory</p>";
    }

    return `
      <ul>
        ${list.map((file) => this.getFileItemView(file)).join("")}
      </ul>
    `;
  }
}
