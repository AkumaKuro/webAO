/* eslint no-await-in-loop: "warn" */
/* eslint no-restricted-syntax: "off" */
/* TODO: use promises for this */

export {getAnimLength}

import {Caluclators, FileType} from "./calculatorHandler";
import { requestBuffer } from "../services/request";
import { fileExists } from "./filesExists";
/**
 * Gets animation length. If the animation cannot be found, it will
 * silently fail and return 0 instead.
 * @param {string} filename the animation file name
 */

const getAnimLength = async (url: string) => {
  const extensions = [FileType.APNG, FileType.GIF, FileType.WEBP]
  for (const extension of extensions) {
    const urlWithExtension = url + extension;
    const exists = await fileExists(urlWithExtension);
    if (exists) {
      const fileBuffer = await requestBuffer(urlWithExtension);
      const length = Caluclators.get(extension)(fileBuffer);
      return length;
    }
  }
  return 0;
};
export default getAnimLength;
