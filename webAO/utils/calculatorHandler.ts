import calculateGifLength from "./calculateGifLength";
import calculateWebpLength from "./calculateWebpLength";
import calculateApngLength from "./calculateApngLength";

export { FileType, Caluclators}

enum FileType {
  GIF = ".gif",
  WEBP = ".webp",
  APNG = ".apng"
}

const Caluclators: Map<FileType, (file: any) => number> = new Map([
  [FileType.GIF, calculateGifLength],
  [FileType.WEBP, calculateWebpLength],
  [FileType.APNG, calculateApngLength]
])