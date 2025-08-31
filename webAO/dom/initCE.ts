import { client } from "../client";

/**
 * Declare cross examination.
 */
export function initCE() {
  client.sender.sendRT("testimony2");
}
(globalThis as any).initCE = initCE;
