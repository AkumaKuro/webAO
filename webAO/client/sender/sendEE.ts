import { client } from "../../client";
import { escapeChat } from "../../encoding";

/**
 * Sends edit evidence command.
 * @param {number} id id
 * @param {string} name name
 * @param {string} desc description
 * @param {string} img image filename
 */
export const sendEE = (id: number, name: string, desc: string, img: string) => {
  client.sender.sendServer(
    `EE#${id}#${escapeChat(name)}#${escapeChat(desc)}#${escapeChat(img)}#%`,
  );
};
