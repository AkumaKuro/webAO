import { client } from "../../client";
import { escapeChat } from "../../encoding";
import { MessageType } from "./messageEncoder";

/**
 * Sends add evidence command.
 * @param {string} evidence name
 * @param {string} evidence description
 * @param {string} evidence image filename
 */
export const sendPE = (name: string, desc: string, img: string) => {
  client.sender.sendServer(
    MessageType.CREATE_EVIDENCE, [
      escapeChat(name),
      escapeChat(desc),
      escapeChat(img)
    ]
  )
};
