import { client } from "../../client";
import { MessageType } from "./messageEncoder";

/**
 * Sends delete evidence command.
 * @param {number} id id
 */


export const sendDE = (id: number) => {
  client.sender.sendServer(
    MessageType.DE,
    [id.toString()]
  );
};
