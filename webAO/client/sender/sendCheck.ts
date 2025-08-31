import { client } from "../../client";
import { MessageType } from "./messageEncoder";

/**
 * Sends a keepalive packet.
 */
export const sendCheck = () => {
  client.sender.sendServer(
    MessageType.CH,
    [client.charID.toString()]
  );
};
