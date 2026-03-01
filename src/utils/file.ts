export function getMimeType(fileName: string): string | undefined {
  const ext = fileName.split(".").pop();
  switch (ext) {
    case "html":
      return "text/html";
    case "css":
      return "text/css";
    case "js":
    case "ts":
      return "text/javascript";
    case "png":
      return "image/png";
    case "jpg":
      return "image/jpeg";
  }
}
