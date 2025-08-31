import { client, extrafeatures } from "../../client";
import { MessageType } from "./messageEncoder";

/**
 * Sends call mod command.
 * @param {string} message to mod
 */
export const sendZZ = (msg: string, target: number) => {
  client.sender.sendServer(
    MessageType.ZZ,
    [msg, target.toString()]
  )
};
