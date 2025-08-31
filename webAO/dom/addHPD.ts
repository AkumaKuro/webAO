import { client } from "../client";

/**
 * Increment defense health point.
 */
export function addHPD() {
  client.sender.sendHP(1, client.hp[0] + 1);
}
(globalThis as any).addHPD = addHPD;
