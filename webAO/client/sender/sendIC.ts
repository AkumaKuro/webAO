import { extrafeatures } from "../../client";
import { escapeChat } from "../../encoding";
import { client } from "../../client";
import queryParser from "../../utils/queryParser";
import { MessageType } from "./messageEncoder";
const { mode } = queryParser();

export { Player, FrameMod }

/**
 * Sends an in-character chat message.
 * @param {number} deskmod controls the desk
 * @param {string} speaking who is speaking
 * @param {string} name the name of the current character
 * @param {string} silent whether or not it's silent
 * @param {string} message the message to be sent
 * @param {string} side the name of the side in the background
 * @param {string} sfx_name the name of the sound effect
 * @param {number} emote_modifier whether or not to zoom
 * @param {number} sfx_delay the delay (in milliseconds) to play the sound effect
 * @param {number} objection_modifier the number of the shout to play
 * @param {string} evidence the filename of evidence to show
 * @param {boolean} flip change to 1 to reverse sprite for position changes
 * @param {boolean} realization screen flash effect
 * @param {number} text_color text color
 * @param {string} showname custom name to be displayed (optional)
 * @param {number} other_charid paired character (optional)
 * @param {number} self_offset offset to paired character (optional)
 * @param {number} noninterrupting_preanim play the full preanim (optional)
 */

class Player {
  name: string
  showname: string
  offset_x: number
  offset_y: number
  emote: string
  emote_modifier: number

  constructor(name: string, showname: string, offset_x: number, offset_y: number, emote: string, emote_modifier: number) {
    this.name = name
    this.showname = showname
    this.offset_x = offset_x
    this.offset_y = offset_y
    this.emote = emote
    this.emote_modifier = emote_modifier
  }
}

class FrameMod {
  screenshake: string
  realization: string
  sfx: string

  constructor(screenshake: string, realization: string, sfx: string) {
    this.screenshake = screenshake
    this.realization = realization
    this.sfx = sfx
  }
}


export const sendIC = (
  deskmod: number,
  preanim: string,
  message: string,
  side: string,
  sfx_name: string,
  sfx_delay: number,
  objection_modifier: number,
  evidence: number,
  flip: boolean,
  realization: boolean,
  text_color: number,
  other_charid: string,
  noninterrupting_preanim: boolean,
  looping_sfx: boolean,
  screenshake: boolean,
  additive: boolean,
  effect: string,
  player: Player,
  frame_mod: FrameMod
) => {
  let extra_cccc = "";
  let other_emote = "";
  let other_offset = "";
  let extra_27 = "";
  let extra_28 = "";

  if (extrafeatures.includes("cccc_ic_support")) {
    const self_offset = extrafeatures.includes("y_offset")
      ? `${player.offset_x}<and>${player.offset_y}`
      : player.offset_x; // HACK: this should be an & but client fucked it up and all the servers adopted it
    if (mode === "replay") {
      other_emote = "##";
      other_offset = "#0#0";
    }
    extra_cccc = `${escapeChat(
      player.showname,
    )}#${other_charid}${other_emote}#${self_offset}${other_offset}#${Number(
      noninterrupting_preanim,
    )}#`;

    if (extrafeatures.includes("looping_sfx")) {
      extra_27 = `${Number(looping_sfx)}#${Number(
        screenshake,
      )}#${frame_mod.screenshake}#${frame_mod.realization}#${frame_mod.sfx}#`;
      if (extrafeatures.includes("effects")) {
        extra_28 = `${Number(additive)}#${escapeChat(effect)}#`;
      }
    }
  }

  client.sender.sendServer(
    MessageType.SEND_CHARACTER_MESSAGE, [
      deskmod.toString(),
      escapeChat(preanim),
      escapeChat(player.name),
      escapeChat(player.emote),
      escapeChat(message),
      escapeChat(side),
      escapeChat(sfx_name),
      player.emote_modifier.toString(),
      client.charID.toString(),
      sfx_delay.toString(),
      Number(objection_modifier).toString(),
      Number(evidence).toString(),
      Number(flip).toString(),
      Number(realization).toString(),
      text_color.toString(),
      extra_cccc,
      extra_27,
      extra_28
    ]
  );
  if (mode === "replay") {
    (<HTMLInputElement>document.getElementById("client_ooclog")).value +=
      `wait#${
        (<HTMLInputElement>document.getElementById("client_replaytimer")).value
      }#%\r\n`;
  }
};
