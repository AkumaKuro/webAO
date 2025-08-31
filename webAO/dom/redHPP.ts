import { client } from "../client";

/**
 * Decrement prosecution health point.
 */
export function redHPP() {
  client.sender.sendHP(2, client.hp[1] - 1);
}
(globalThis as any).redHPP = redHPP;
