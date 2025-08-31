import { client } from "../../client";

/**
 * Sends delete evidence command.
 * @param {number} id id
 */
export const sendDE = (id: number) => {
  client.sender.sendServer(`DE#${id}#%`);
};
