import { client } from "../../client";
import queryParser from "../../utils/queryParser";
import { MessageType } from "./messageEncoder";

export { sendServerRaw }

const { mode } = queryParser();
/**
 * Hook for sending messages to the server
 * @param {string} message the message to send
 */
export const sendServer = (type: MessageType, args: string[]) => {
  const message = encode_message(type, args)
  
  console.debug("C: " + message);
  mode === "replay"
    ? client.sender.sendSelf(message)
    : client.serv.send(message);
};

function sendServerRaw(data: string) : void {
  console.debug("C: " + data);
  mode === "replay"
    ? client.sender.sendSelf(data)
    : client.serv.send(data);
}

function encode_message(type: MessageType, args: string[]) : string {
  return type + '#' + args.join('#') + '%'
}