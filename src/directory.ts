import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface FileEntry {
  name: string;
  isDirectory: boolean;
}

export class Directory {
  rootPath: string;

  constructor(dirPath = ".") {
    this.rootPath = path.resolve(__dirname, dirPath);
  }

  list(): FileEntry[] {
    const list = fs.readdirSync(this.rootPath, { withFileTypes: true });
    return list.map((f) => ({
      name: f.name,
      isDirectory: f.isDirectory(),
    }));
  }

  readPath(filePath: string): FileEntry[] | string | null {
    const _path = path.resolve(this.rootPath, filePath);
    if (!fs.existsSync(_path)) {
      return null;
    }
    // 读取路径，判断是否是目录
    if (fs.statSync(_path).isDirectory()) {
      const list = fs.readdirSync(_path, {
        withFileTypes: true,
      });
      return list.map((f) => ({
        name: f.name,
        isDirectory: f.isDirectory(),
      }));
    }

    return fs.readFileSync(_path, "utf-8");
  }
}
