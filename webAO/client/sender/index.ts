import { FrameMod, Player, sendIC } from "./sendIC";
import { sendSelf } from "./sendSelf";
import { sendServer, sendServerRaw } from "./sendServer";
import { sendCheck } from "./sendCheck";
import { sendHP } from "./sendHP";
import { sendOOC } from "./sendOOC";
import { sendCharacter } from "./sendCharacter";
import { sendRT } from "./sendRT";
import { sendMusicChange } from "./sendMusicChange";
import { sendZZ } from "./sendZZ";
import { sendEE } from "./sendEE";
import { sendDE } from "./sendDE";
import { sendPE } from "./sendPE";
import { sendMA } from "./sendMA";
import { MessageType } from "./messageEncoder";
export interface ISender {
  sendIC: (
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
  ) => void;
  sendSelf: (message: string) => void;
  sendServer: (message: MessageType, args: string[]) => void;
  sendServerRaw: (data: string) => void
  sendCheck: () => void;
  sendHP: (side: number, hp: number) => void;
  sendOOC: (message: string) => void;
  sendCharacter: (character: number) => void;
  sendRT: (testimony: string) => void;
  sendMusicChange: (track: string) => void;
  sendZZ: (msg: string, target: number) => void;
  sendEE: (id: number, name: string, desc: string, img: string) => void;
  sendDE: (id: number) => void;
  sendPE: (name: string, desc: string, img: string) => void;
  sendMA: (id: number, length: number, reason: string) => void;
}
export const sender: ISender = {
  sendIC,
  sendSelf,
  sendServer,
  sendServerRaw,
  sendCheck,
  sendHP,
  sendOOC,
  sendCharacter,
  sendRT,
  sendMusicChange,
  sendZZ,
  sendEE,
  sendDE,
  sendPE,
  sendMA,
};
