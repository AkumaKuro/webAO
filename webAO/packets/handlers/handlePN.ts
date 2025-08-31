import { client } from "../../client";
import { MessageType } from "../../client/sender/messageEncoder";

/**
 * Indicates how many users are on this server
 * @param {Array} args packet arguments
 */
export const handlePN = (_args: string[]) => {
  client.sender.sendServer(
    MessageType.ASK_CHARACTER, []
  )
};
