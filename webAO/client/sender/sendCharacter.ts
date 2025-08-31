import { client } from "../../client";
import { encode } from './messageEncoder'

/**
 * Requests to play as a specified character.
 * @param {number} character the character ID
 */
export const sendCharacter = (character: number) => {
  if (character === -1 || client.chars[character].name) {
    let message = encode('CC', [client.playerID.toString(), character.toString(), 'web'])
    client.sender.sendServer(message);
  }
};
