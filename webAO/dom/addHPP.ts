import { client } from "../client";

/**
 * Increment prosecution health point.
 */
export function addHPP() {
  client.sender.sendHP(2, client.hp[1] + 1);
}
(globalThis as any).addHPP = addHPP;
