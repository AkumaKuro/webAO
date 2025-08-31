import { client } from "../../client";
import { escapeChat } from "../../encoding";
import { MessageType } from "./messageEncoder";

/**
 * Sends edit evidence command.
 * @param {number} id id
 * @param {string} name name
 * @param {string} desc description
 * @param {string} img image filename
 */
export const sendEE = (id: number, name: string, desc: string, img: string) => {
  client.sender.sendServer(
    MessageType.EE, [
      id.toString(),
      escapeChat(name),
      escapeChat(desc),
      escapeChat(img)
    ]
  );
};
