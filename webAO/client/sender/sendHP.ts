import { client } from "../../client";
import { MessageType } from "./messageEncoder";

/**
 * Sends health point command.
 * @param {number} side the position
 * @param {number} hp the health point
 */
export const sendHP = (side: number, hp: number) => {
  client.sender.sendServer(
    MessageType.HP,
    [side.toString(), hp.toString()]
  );
};
