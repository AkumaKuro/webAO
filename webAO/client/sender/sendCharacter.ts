import { client } from "../../client";
import { MessageType } from './messageEncoder'

/**
 * Requests to play as a specified character.
 * @param {number} character the character ID
 */
export const sendCharacter = (character: number) => {
  if (character === -1 || client.chars[character].name) {
    client.sender.sendServer(
      MessageType.CC, [
        client.playerID.toString(),
        character.toString(),
        'web'
      ]
    );
  }
};
