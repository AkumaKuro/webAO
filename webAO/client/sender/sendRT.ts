import { client } from "../../client";
import { MessageType } from "./messageEncoder";

/**
 * Sends testimony command.
 * @param {string} testimony type
 */
export const sendRT = (testimony: string) => {
  client.sender.sendServer(
    MessageType.SEND_TESTIMONY,
    [testimony]
  )
};
