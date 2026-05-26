export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("无法读取文件内容"));
      }
    };
    reader.onerror = () => reject(new Error("文件读取失败"));
    reader.readAsText(file);
  });
}