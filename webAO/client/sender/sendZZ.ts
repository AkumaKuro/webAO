import { client } from "../../client";
import { MessageType } from "./messageEncoder";

/**
 * Sends call mod command.
 * @param {string} msg to mod
 */
export const sendZZ = (msg: string, target: number) => {
  client.sender.sendServer(
    MessageType.MOD_CALL,
    [msg, target.toString()]
  )
};
