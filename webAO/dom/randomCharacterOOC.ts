import { client } from "../client";
/**
 * Random character via OOC.
 */
export function randomCharacterOOC() {
  client.sender.sendOOC(`/randomchar`);
}
(globalThis as any).randomCharacterOOC = randomCharacterOOC;
