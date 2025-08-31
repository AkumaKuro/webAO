import { client } from "../client";

/**
 * Declare the defendant not guilty
 */
export function notguilty() {
  client.sender.sendRT("judgeruling#0");
}
(globalThis as any).notguilty = notguilty;
