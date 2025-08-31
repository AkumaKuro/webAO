import { client } from "../../client";
import { MessageType } from "./messageEncoder";

/**
 * Requests to change the music to the specified track.
 * @param {string} track the track ID
 */
export const sendMusicChange = (track: string) => {
  client.sender.sendServer(
    MessageType.MC,
    [track, client.charID.toString()]
  )
};
