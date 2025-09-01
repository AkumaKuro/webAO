import { client } from "../../client";
import { MessageType } from "../../client/sender/messageEncoder";
import { getCharIcon } from "../../client/handleCharacterInfo";
import { updatePlayerAreas } from "../../dom/updatePlayerAreas";
import vanilla_music_arr from "../../constants/music.js";
import vanilla_character_arr from "../../constants/characters.js";

export {handlePN, handle_playerlist_update as handlePU}

/**
 * Indicates how many users are on this server
 * @param {Array} _args packet arguments
 */
function handlePN(_args: string[]) {
  client.sender.sendServer(
    MessageType.ASK_CHARACTER, []
  )
};

/**
 * Handles a playerlist update
 * @param {Array} args packet arguments
 */
function handle_playerlist_update(args: string[]) {
  const playerRow = <HTMLTableElement>(
    document.getElementById(`client_playerlist_entry${Number(args[1])}`)
  );
  const type = Number(args[2]);
  const data = args[3];
  switch (type) {
    case 0:
      const oocName = <HTMLElement>playerRow.childNodes[3];
      oocName.innerText = data;
      break;
    case 1:
      const playerImg = <HTMLImageElement>playerRow.childNodes[0].firstChild;
      getCharIcon(playerImg, data);
      const charName = <HTMLElement>playerRow.childNodes[1];
      charName.innerText = data;
      break;
    case 2:
      const showName = <HTMLElement>playerRow.childNodes[2];
      showName.innerText = data;
      break;
    case 3:
      playerRow.className = `area${data}`;
      updatePlayerAreas(client.area);
    default:
      break;
  }
};

/**
 * we are asking ourselves what characters there are
 * @param {Array} args packet arguments
 */
export const handleRC = (_args: string[]) => {
  client.sender.sendSelf(`SC#${vanilla_character_arr.join("#")}#%`);
};

/**
 * we are asking ourselves what characters there are
 * @param {Array} args packet arguments
 */
export const handleRM = (_args: string[]) => {
  client.sender.sendSelf(`SM#${vanilla_music_arr.join("#")}#%`);
};


/**
 * we are asking ourselves what characters there are
 * @param {Array} args packet arguments
 */
export const handleRD = (_args: string[]) => {
  client.sender.sendSelf("BN#gs4#%");
  client.sender.sendSelf("DONE#%");
  const ooclog = <HTMLInputElement>document.getElementById("client_ooclog");
  ooclog.value = "";
  ooclog.readOnly = false;

  document.getElementById("client_oocinput")!.style.display = "none";
  document.getElementById("client_replaycontrols")!.style.display =
    "inline-block";
};


/* eslint indent: ["error", 2, { "SwitchCase": 1 }] */

import { extrafeatures, UPDATE_INTERVAL } from "../../client";
import { handleCharacterInfo } from "../../client/handleCharacterInfo";
import { resetICParams } from "../../client/resetICParams";
import { prepChat, safeTags } from "../../encoding";
import { handle_ic_speaking } from "../../viewport/utils/handleICSpeaking";
/**
 * Handles an in-character chat message.
 * @param {*} args packet arguments
 */
export const handleMS = (args: string[]) => {
  // duplicate message
  if (args[5] !== client.viewport.getChatmsg().content) {
    const char_id = Number(args[9]);
    const char_name = safeTags(args[3]);

    let msg_nameplate = args[3];
    let msg_blips = "male";
    let char_chatbox = "default";
    let char_muted = false;

    if (char_id < client.char_list_length && char_id >= 0) {
      if (client.chars[char_id].name !== char_name) {
        console.info(
          `${client.chars[char_id].name} is iniediting to ${char_name}`,
        );
        const chargs = (`${char_name}&` + "iniediter").split("&");
        handleCharacterInfo(chargs, char_id);
      }
    }

    try {
      msg_nameplate = client.chars[char_id].showname;
    } catch (e) {
      msg_nameplate = args[3];
    }

    try {
      msg_blips = client.chars[char_id].blips;
    } catch (e) {}

    try {
      char_chatbox = client.chars[char_id].chat;
    } catch (e) {
      char_chatbox = "default";
    }

    try {
      char_muted = client.chars[char_id].muted;
    } catch (e) {
      char_muted = false;
      console.error("we're still missing some character data");
    }

    if (char_muted === false) {
      let chatmsg = {
        deskmod: Number(safeTags(args[1]).toLowerCase()),
        preanim: safeTags(args[2]).toLowerCase(), // get preanim
        nameplate: msg_nameplate,
        chatbox: char_chatbox,
        name: char_name,
        sprite: safeTags(args[4]).toLowerCase(),
        content: prepChat(args[5]), // Escape HTML tags
        side: args[6].toLowerCase(),
        sound: safeTags(args[7]).toLowerCase(),
        blips: safeTags(msg_blips),
        type: Number(args[8]),
        charid: char_id,
        snddelay: Number(args[10]),
        objection: Number(args[11]),
        evidence: Number(safeTags(args[12])),
        flip: Number(args[13]),
        flash: Number(args[14]),
        color: Number(args[15]),
        speed: UPDATE_INTERVAL,
      };

      if (args.length > 16) {
        const extra_cccc = {
          showname: prepChat(args[16]),
          other_charid: Number(args[17]),
          other_name: safeTags(args[18]),
          other_emote: safeTags(args[19]),
          self_offset: args[20].split("<and>"), // HACK: here as well, client is fucked and uses this instead of &
          other_offset: args[21].split("<and>"),
          other_flip: Number(args[22]),
          noninterrupting_preanim: Number(args[23]),
        };
        chatmsg = Object.assign(extra_cccc, chatmsg);

        if (args.length > 24) {
          const extra_27 = {
            looping_sfx: Number(args[24]),
            screenshake: Number(args[25]),
            frame_screenshake: safeTags(args[26]),
            frame_realization: safeTags(args[27]),
            frame_sfx: safeTags(args[28]),
          };
          chatmsg = Object.assign(extra_27, chatmsg);

          if (args.length > 29) {
            const extra_28 = {
              additive: Number(args[29]),
              effects: args[30].split("|"),
            };
            chatmsg = Object.assign(extra_28, chatmsg);
          } else {
            const extra_28 = {
              additive: 0,
              effects: ["", "", ""],
            };
            chatmsg = Object.assign(extra_28, chatmsg);
          }
        } else {
          const extra_27 = {
            looping_sfx: 0,
            screenshake: 0,
            frame_screenshake: "",
            frame_realization: "",
            frame_sfx: "",
          };
          chatmsg = Object.assign(extra_27, chatmsg);
          const extra_28 = {
            additive: 0,
            effects: ["", "", ""],
          };
          chatmsg = Object.assign(extra_28, chatmsg);
        }
      } else {
        const extra_cccc = {
          showname: "",
          other_charid: 0,
          other_name: "",
          other_emote: "",
          self_offset: [0, 0],
          other_offset: [0, 0],
          other_flip: 0,
          noninterrupting_preanim: 0,
        };
        chatmsg = Object.assign(extra_cccc, chatmsg);
        const extra_27 = {
          looping_sfx: 0,
          screenshake: 0,
          frame_screenshake: "",
          frame_realization: "",
          frame_sfx: "",
        };
        chatmsg = Object.assign(extra_27, chatmsg);
        const extra_28 = {
          additive: 0,
          effects: ["", "", ""],
        };
        chatmsg = Object.assign(extra_28, chatmsg);
      }

      if (chatmsg.content.trim() === "") {
        //blankpost
        chatmsg.content = "";
        // empty string as chatbox means hide it
        chatmsg.chatbox = "";
      }

      // our own message appeared, reset the buttons
      if (chatmsg.charid === client.charID) {
        resetICParams();
      }

      handle_ic_speaking(chatmsg); // no await
    }
  }
};


import fileExists from "../../utils/fileExists";
import { updateActionCommands } from "../../dom/updateActionCommands";
import { pickEmotion } from "../../dom/pickEmotion";


function addEmoteButton(i: number, imgurl: string, desc: string) {
  const emotesList = document.getElementById("client_emo");
  const emote_item = new Image();
  emote_item.id = "emo_" + i;
  emote_item.className = "emote_button";
  emote_item.src = imgurl;
  emote_item.alt = desc;
  emote_item.title = desc;
  emote_item.onclick = () => {
    window.pickEmotion(i);
  };
  emotesList.appendChild(emote_item);
}

/**
 * Handles the server's assignment of a character for the player to use.
 * PV # playerID (unused) # CID # character ID
 * @param {Array} args packet arguments
 */
export const handlePV = async (args: string[]) => {
  client.charID = Number(args[3]);
  document.getElementById("client_waiting")!.style.display = "none";
  document.getElementById("client_charselect")!.style.display = "none";

  const me = client.chars[client.charID];
  client.selectedEmote = -1;
  const { emotes } = client;
  const emotesList = document.getElementById("client_emo");
  emotesList.style.display = "";
  emotesList.innerHTML = ""; // Clear emote box
  const ini = me.inifile;
  me.side = ini.options.side;
  updateActionCommands(me.side);
  if (ini.emotions.number === 0) {
    emotesList.innerHTML = `<span
					id="emo_0"
					alt="unavailable"
					class="emote_button">No emotes available</span>`;
  } else {
    for (let i = 1; i <= ini.emotions.number; i++) {
      try {
        const emoteinfo = ini.emotions[i].split("#");
        let esfx;
        let esfxd;
        try {
          esfx = ini.soundn[i] || "0";
          esfxd = Number(ini.soundt[i]) || 0;
        } catch (e) {
          console.warn("ini sound is completly missing");
          esfx = "0";
          esfxd = 0;
        }
        // Make sure the asset server is case insensitive, or that everything on it is lowercase

        const extensionsMap = [".png", ".webp"];
        let url;
        for (const extension of extensionsMap) {
          url = `${AO_HOST}characters/${encodeURI(
            me.name.toLowerCase(),
          )}/emotions/button${i}_off${extension}`;

          const exists = await fileExists(url);

          if (exists) {
            break;
          }
        }

        emotes[i] = {
          desc: emoteinfo[0].toLowerCase(),
          preanim: emoteinfo[1].toLowerCase(),
          emote: emoteinfo[2].toLowerCase(),
          zoom: Number(emoteinfo[3]) || 0,
          deskmod: Number(emoteinfo[4]) || 1,
          sfx: esfx.toLowerCase(),
          sfxdelay: esfxd,
          frame_screenshake: "",
          frame_realization: "",
          frame_sfx: "",
          button: url,
        };

        addEmoteButton(i, url, emotes[i].desc);

        if (i === 1) pickEmotion(1);
      } catch (e) {
        console.error(`missing emote ${i}`);
      }
    }
  }

  if (
    await fileExists(
      `${AO_HOST}characters/${encodeURI(me.name.toLowerCase())}/custom.gif`,
    )
  ) {
    document.getElementById("button_4")!.style.display = "";
  } else {
    document.getElementById("button_4")!.style.display = "none";
  }
};



import { kickPlayer, banPlayer } from "../../dom/banPlayer";

function addPlayer(playerID: number) {
  const list = <HTMLTableElement>document.getElementById("client_playerlist");
  const playerRow = list.insertRow();
  playerRow.id = `client_playerlist_entry${playerID}`;
  playerRow.className = `area0`;

  const imgCell = playerRow.insertCell(0);
  imgCell.style.width = "64px";
  const img = document.createElement("img");
  imgCell.appendChild(img);

  const name = document.createTextNode("Unknown");

  const charNameCell = playerRow.insertCell(1);
  charNameCell.appendChild(name);
  const showNameCell = playerRow.insertCell(2);
  showNameCell.appendChild(name);
  const oocNameCell = playerRow.insertCell(3);
  oocNameCell.appendChild(name);

  const kickCell = playerRow.insertCell(4);
  kickCell.style.width = "64px";
  const kick = <HTMLButtonElement>document.createElement("button");
  kick.innerText = "Kick";
  kick.onclick = () => {
    (globalThis as any).kickPlayer(playerID);
  };
  kickCell.appendChild(kick);

  const banCell = playerRow.insertCell(5);
  banCell.style.width = "64px";
  const ban = <HTMLButtonElement>document.createElement("button");
  ban.innerText = "Ban";
  ban.onclick = () => {
    (globalThis as any).banPlayer(playerID);
  };
  banCell.appendChild(ban);
}

function removePlayer(playerID: number) {
  const playerRow = <HTMLTableElement>(
    document.getElementById(`client_playerlist_entry${playerID}`)
  );
  playerRow.remove();
}

/**
 * Handles a player joining or leaving
 * @param {Array} args packet arguments
 */
export const handlePR = (args: string[]) => {
  const playerID = Number(args[1]);
  if (Number(args[2]) === 0) addPlayer(playerID);
  else if (Number(args[2]) === 1) removePlayer(playerID);
};





/**
 * Handles the kicked packet
 * @param {Array} args kick reason
 */
export const handleKK = (args: string[]) => {
  client.banned = true;
  handleBans("Kicked", args[1]);
};



// TODO BUG:
// this.viewport.music is an array. Therefore you must access elements
/**
 * Handles a music change to an arbitrary resource, with an offset in seconds.
 * @param {Array} args packet arguments
 */
export const handleRMC = (args: string[]) => {
  client.viewport.music.pause();
  const { music } = client.viewport;
  // Music offset + drift from song loading
  music.totime = args[1];
  music.offset = new Date().getTime() / 1000;
  music.addEventListener(
    "loadedmetadata",
    () => {
      music.currentTime += parseFloat(
        music.totime + (new Date().getTime() / 1000 - music.offset),
      ).toFixed(3);
      music.play();
    },
    false,
  );
};

import { appendICLog } from "../../client/appendICLog";

/**
 * Handles a music change to an arbitrary resource.
 * @param {Array} args packet arguments
 */
export const handleMC = (args: string[]) => {
  const track = prepChat(args[1]);
  let charID = Number(args[2]);
  const showname = args[3] || "";
  const looping = Boolean(args[4]);
  const channel = Number(args[5]) || 0;
  // const fading = Number(args[6]) || 0; // unused in web

  const music = client.viewport.music[channel];
  let musicname;
  music.pause();
  if (track.startsWith("http")) {
    music.src = track;
  } else {
    music.src = `${AO_HOST}sounds/music/${encodeURI(track.toLowerCase())}`;
  }
  music.loop = looping;
  music.play();

  try {
    musicname = client.chars[charID].name;
  } catch (e) {
    charID = -1;
  }

  if (charID >= 0) {
    musicname = client.chars[charID].name;
    appendICLog(`${musicname} changed music to ${track}`);
  } else {
    appendICLog(`The music was changed to ${track}`);
  }

  document.getElementById("client_trackstatustext")!.innerText = track;
};


/**
 * Handles the "MusicMode" packet
 * @param {Array} args packet arguments
 */
export const handleMM = (_args: string[]) => {
    // It's unused nowadays, as preventing people from changing the music is now serverside
};
  


import { AO_HOST } from "../../client/aoHost";

/**
 * Handles incoming evidence list, all evidences at once
 * item per packet.
 *
 * @param {Array} args packet arguments
 */
export const handleLE = (args: string[]) => {
  client.evidences = [];
  for (let i = 1; i < args.length; i++) {
    if (!args[i].includes("&")) break;
    const arg = args[i].split("&");
    client.evidences[i - 1] = {
      name: prepChat(arg[0]),
      desc: prepChat(arg[1]),
      filename: arg[2],
      icon: `${AO_HOST}evidence/${encodeURI(arg[2].toLowerCase())}`,
    };
  }

  const evidence_box = document.getElementById("evidences");
  evidence_box.innerHTML = "";
  for (let i = 0; i <= client.evidences.length - 1; i++) {
    const evi_item = new Image();
    evi_item.id = "evi_" + i;
    evi_item.className = "evi_icon";
    evi_item.src = client.evidences[i].icon;
    evi_item.alt = client.evidences[i].name;
    evi_item.onclick = () => {
      (globalThis as any).pickEvidence(i);
    };
    evidence_box.appendChild(evi_item);
  }
};

/**
 * Handles the warning packet
 * on client this spawns a message box you can't close for 2 seconds
 * @param {Array} args ban reason
 */
export const handleBB = (args: string[]) => {
    alert(args[1]);
  };
  

/**
 * show/hide judge controls
 * @param {number} show either a 1 or a 0
 */
export const handleJD = (args: string[]) => {
    if (Number(args[1]) === 1) {
      document.getElementById("judge_action")!.style.display = "inline-table";
      document.getElementById("no_action")!.style.display = "none";
    } else {
      document.getElementById("judge_action")!.style.display = "none";
      document.getElementById("no_action")!.style.display = "inline-table";
    }
};


import { handleBans } from "../../client/handleBans";

/**
 * Handles the banned packet
 * this one is sent when you are kicked off the server
 * @param {Array} args ban reason
 */
export const handleKB = (args: string[]) => {
  client.banned = true;
  handleBans("Banned", args[1]);
};


import { setOldLoading } from "../../client";

const npm_version = process.env.npm_package_version;

/**
 * Identifies the server and issues a playerID
 * @param {Array} args packet arguments
 */
export const handleID = (args: string[]) => {
  client.playerID = Number(args[1]);
  const serverSoftware = args[2].split("&")[0];
  let serverVersion;
  if (serverSoftware === "serverD") {
    serverVersion = args[2].split("&")[1];
  } else if (serverSoftware === "webAO") {
    setOldLoading(false);
    client.sender.sendSelf("PN#0#1#%");
  } else {
    serverVersion = args[3];
  }

  if (serverSoftware === "serverD" && serverVersion === "1377.152") {
    setOldLoading(true);
  } // bugged version

  if (serverSoftware !== "webAO") {
    client.sender.sendServer(
      MessageType.REQUEST_ID,
      [npm_version]
    )
  }
};



import { AreaLockMode, AreaStatus, createArea, parseEnum } from "../../client/createArea";

/**
 * Handles updated area list
 * @param {Array} args packet arguments
 */
export const handleFA = (args: string[]) => {
  client.resetAreaList();

  for (let i = 1; i < args.length; i++) {
    createArea(i - 1, args[i]);
  }
};




/**
 * Handles a change in the health bars' states.
 * @param {Array} args packet arguments
 */
export const handleHP = (args: string[]) => {
  const percent_hp = Number(args[2]) * 10;
  let healthbox;
  if (args[1] === "1") {
    // Def hp
    client.hp[0] = Number(args[2]);
    healthbox = document.getElementById("client_defense_hp");
  } else {
    // Pro hp
    client.hp[1] = Number(args[2]);
    healthbox = document.getElementById("client_prosecutor_hp");
  }
  (<HTMLElement>healthbox.getElementsByClassName("health-bar")[0]).style.width =
    `${percent_hp}%`;
};



const version = process.env.npm_package_version;

/**
 * Handle the player
 * @param {Array} args packet arguments
 */
export const handleHI = (_args: string[]) => {
  client.sender.sendSelf(`ID#1#webAO#${version}#%`);
  client.sender.sendSelf(
    "FL#fastloading#yellowtext#cccc_ic_support#flipping#looping_sfx#effects#%",
  );
};


import { setExtraFeatures } from "../../client";

/**
 * With this the server tells us which features it supports
 * @param {Array} args list of features
 */
export const handleFL = (args: string[]) => {
  console.info("Server-supported features:");
  console.info(args);
  setExtraFeatures(args);

  if (args.includes("yellowtext")) {
    const colorselect = <HTMLSelectElement>document.getElementById("textcolor");

    colorselect.options[colorselect.options.length] = new Option("Yellow", "5");
    colorselect.options[colorselect.options.length] = new Option("Pink", "6");
    colorselect.options[colorselect.options.length] = new Option("Cyan", "7");
    colorselect.options[colorselect.options.length] = new Option("Grey", "8");
  }

  if (args.includes("cccc_ic_support")) {
    document.getElementById("cccc")!.style.display = "";
    document.getElementById("pairing")!.style.display = "";
  }

  if (args.includes("flipping")) {
    document.getElementById("button_flip")!.style.display = "";
  }

  if (args.includes("looping_sfx")) {
    document.getElementById("button_shake")!.style.display = "";
    document.getElementById("2.7")!.style.display = "";
  }

  if (args.includes("effects")) {
    document.getElementById("2.8")!.style.display = "";
  }

  if (args.includes("y_offset")) {
    document.getElementById("y_offset")!.style.display = "";
  }
};


import { addTrack } from "../../client/addTrack";

/**
 * Handles updated music list
 * @param {Array} args packet arguments
 */
export const handleFM = (args: string[]) => {
  client.resetMusicList();

  for (let i = 1; i < args.length - 1; i++) {
    // Check when found the song for the first time
    addTrack(args[i]);
  }
};



/**
 * Handles incoming evidence information, containing only one evidence
 * item per packet.
 *
 * EI#id#name&description&type&image&##%
 *
 * @param {Array} args packet arguments
 */
export const handleEI = (args: string[]) => {
  document.getElementById("client_loadingtext")!.innerHTML =
    `Loading Evidence ${args[1]}/${client.evidence_list_length}`;
  const evidenceID = Number(args[1]);
  const arg = args[2].split("&");
  client.evidences[evidenceID] = {
    name: prepChat(arg[0]),
    desc: prepChat(arg[1]),
    filename: arg[3],
    icon: `${AO_HOST}evidence/${encodeURI(arg[3].toLowerCase())}`,
  };

  client.sender.sendServer(
    MessageType.REQUEST_EVIDENCE,
    [(evidenceID + 1).toString()]
  )
};


import { fix_last_area } from "../../client/fixLastArea";
import { isAudio } from "../../client/isAudio";

/**
 * Handles incoming music information, containing multiple entries
 * per packet.
 * @param {Array} args packet arguments
 */
export const handleEM = (args: string[]) => {
  document.getElementById("client_loadingtext")!.innerHTML = "Loading Music";
  if (args[1] === "0") {
    client.resetMusicList();
    client.resetAreaList();
    client.musics_time = false;
  }

  for (let i = 2; i < args.length - 1; i++) {
    if (i % 2 === 0) {
      const trackname = args[i];
      const trackindex = Number(args[i - 1]);
      if (client.musics_time) {
        addTrack(trackname);
      } else if (isAudio(trackname)) {
        client.musics_time = true;
        fix_last_area();
        addTrack(trackname);
      } else {
        createArea(trackindex, trackname);
      }
    }
  }
  // get the next batch of tracks
  client.sender.sendServer(
    MessageType.REQUEST_MUSIC,
    [(Number(args[1]) / 10 + 1).toString()]
  )
};


/**
 * server got our message
 */
export const handleackMS = () => {
  resetICParams();
};


import queryParser from "../../utils/queryParser";
import { clientState } from "../../client";

const { mode } = queryParser();
/**
 * Handles the handshake completion packet, meaning the player
 * is ready to select a character.
 *
 * @param {Array} args packet arguments
 */
export const handleDONE = (_args: string[]) => {
  // DONE packet signals that the handshake is complete
  client.state = clientState.Joined;
  document.getElementById("client_loading")!.style.display = "none";
  if (mode === "watch") {
    // Spectators don't need to pick a character
    document.getElementById("client_waiting")!.style.display = "none";
  }
};

/**
 * Handles incoming character information, bundling multiple characters
 * per packet.
 * CI#0#Phoenix&description&&&&&#1#Miles ...
 * @param {Array} args packet arguments
 */
export const handleCI = (args: string[]) => {
  // Loop through the 10 characters that were sent
  document.getElementById("client_loadingtext")!.innerHTML =
    `Loading Character ${args[1]}/${client.char_list_length}`;
  for (let i = 2; i <= args.length - 2; i++) {
    if (i % 2 === 0) {
      const chargs = args[i].split("&");
      const charid = Number(args[i - 1]);
      setTimeout(() => handleCharacterInfo(chargs, charid), 500);
    }
  }
  // Request the next pack
  client.sender.sendServer(
    MessageType.AN,
    [(Number(args[1]) / 10 + 1).toString()]
  )
};


import { initTestimonyUpdater } from "../../viewport/utils/initTestimonyUpdater";

/**
 * Handles a testimony states.
 * @param {Array} args packet arguments
 */
export const handleRT = (args: string[]) => {
  const judgeid = Number(args[2]);
  switch (args[1]) {
    case "testimony1":
      client.testimonyID = 1;
      break;
    case "testimony2":
      // Cross Examination
      client.testimonyID = 2;
      break;
    case "judgeruling":
      client.testimonyID = 3 + judgeid;
      break;
    default:
      console.warn("Invalid testimony");
  }
  initTestimonyUpdater();
};



/**
 * Handles an out-of-character chat message.
 * @param {Array} args packet arguments
 */
export const handleCT = (args: string[]) => {
  if (mode !== "replay") {
    const oocLog = document.getElementById("client_ooclog")!;
    const username = prepChat(args[1]);
    let message = addLinks(prepChat(args[2]));
    // Replace newlines with br
    message = message.replace(/\n/g, "<br>");

    oocLog.innerHTML += `${username}: ${message}<br>`;
    if (oocLog.scrollTop + oocLog.offsetHeight + 120 > oocLog.scrollHeight)
      oocLog.scrollTo(0, oocLog.scrollHeight);
  }
};

// If the incoming message contains a link, add a href hyperlink to it
function addLinks(message: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return message.replace(
    urlRegex,
    (url) => `<a href="${url}" target="_blank">${url}</a>`,
  );
}


enum ARUPType {
    PLAYER_COUNT,
    STATUS,
    CM,
    LOCK_MODE
}


/**
 * Handle the change of players in an area.
 * @param {Array} args packet arguments
 */
export const handleARUP = (args: string[]) => {
  args = args.slice(1);
  for (let i = 0; i < args.length - 1; i++) {
    if (client.areas[i]) {
      // the server sends us ARUP before we even get the area list
      const thisarea = document.getElementById(`area${i}`)!;
      const arup_type: ARUPType = Number(args[0])
      switch (arup_type) {
        case ARUPType.PLAYER_COUNT: // playercount
          client.areas[i].players = Number(args[i + 1]);
          break;
        case ARUPType.STATUS: // status
          const unsafe_status = safeTags(args[i + 1])
          const status: AreaStatus = parseEnum(AreaStatus, unsafe_status, AreaStatus.IDLE)
          
          client.areas[i].status = status
          break;
        case ARUPType.CM:
          client.areas[i].cm = safeTags(args[i + 1]);
          break;
        case ARUPType.LOCK_MODE:
          const unsafe_lock_mode = safeTags(args[i + 1])
          client.areas[i].locked = parseEnum(AreaLockMode, unsafe_lock_mode, AreaLockMode.FREE)
          break;
      }

      thisarea.className = `area-button area-${client.areas[
        i
      ].status.toLowerCase()}`;

      thisarea.innerText = `${client.areas[i].name} (${client.areas[i].players}) [${client.areas[i].status}]`;

      thisarea.title =
        `Players: ${client.areas[i].players}\n` +
        `Status: ${client.areas[i].status}\n` +
        `CM: ${client.areas[i].cm}\n` +
        `Area lock: ${client.areas[i].locked}`;
    }
  }
};



/**
 * Handles the list of all used and vacant characters.
 * @param {Array} args list of all characters represented as a 0 for free or a -1 for taken
 */
export const handleCharsCheck = (args: string[]) => {
  for (let i = 0; i < client.char_list_length; i++) {
    const img = document.getElementById(`demo_${i}`)!;

    if (args[i + 1] === "-1") {
      img.style.opacity = "0.25";
    } else if (args[i + 1] === "0") {
      img.style.opacity = "1";
    }
  }
};


/**
 * What? you want a character list from me??
 * @param {Array} args packet arguments
 */
export const handleaskchaa = (_args: string[]) => {
  client.sender.sendSelf(`SI#${vanilla_character_arr.length}#0#0#%`);
};


/**
 * What? you want a character??
 * @param {Array} args packet arguments
 */
export const handleCC = (args: string[]) => {
  client.sender.sendSelf(`PV#1#CID#${args[2]}#%`);
};


import { setAOhost } from "../../client/aoHost";

/**
 * new asset url!!
 * @param {Array} args packet arguments
 */
export const handleASS = (args: string[]) => {
  if (args[1] !== "None") setAOhost(args[1]);
};

/**
 * Handles the banned packet
 * this one is sent when you try to reconnect but you're banned
 * @param {Array} args ban reason
 */
export const handleBD = (args: string[]) => {
  client.banned = true;
  handleBans("Banned", args[1]);
};

import { updateBackgroundPreview } from "../../dom/updateBackgroundPreview";
import { getIndexFromSelect } from "../../dom/getIndexFromSelect";
import { switchPanTilt } from "../../dom/switchPanTilt";
import transparentPng from "../../constants/transparentPng";
import tryUrls from "../../utils/tryUrls";

/**
 * Handles a background change.
 * @param {Array} args packet arguments
 */

export const handleBN = (args: string[]) => {
  const bgFromArgs = safeTags(args[1]);
  client.viewport.setBackgroundName(bgFromArgs);
  const bgfolder = client.viewport.getBackgroundFolder();
  const bg_index = getIndexFromSelect(
    "bg_select",
    client.viewport.getBackgroundName(),
  );
  (<HTMLSelectElement>document.getElementById("bg_select")).selectedIndex =
    bg_index;
  updateBackgroundPreview();
  if (bg_index === 0) {
    (<HTMLInputElement>document.getElementById("bg_filename")).value =
      client.viewport.getBackgroundName();
  }

  tryUrls(
    `${AO_HOST}background/${encodeURI(args[1].toLowerCase())}/defenseempty`,
  ).then((resp) => {
    (<HTMLImageElement>document.getElementById("bg_preview")).src = resp;
  });
  tryUrls(`${bgfolder}defensedesk`).then((resp) => {
    (<HTMLImageElement>document.getElementById("client_def_bench")).src = resp;
  });
  tryUrls(`${bgfolder}stand`).then((resp) => {
    (<HTMLImageElement>document.getElementById("client_wit_bench")).src = resp;
  });
  tryUrls(`${bgfolder}prosecutiondesk`).then((resp) => {
    (<HTMLImageElement>document.getElementById("client_pro_bench")).src = resp;
  });
  tryUrls(`${bgfolder}court`).then((resp) => {
    (<HTMLImageElement>document.getElementById("client_court")).src = resp;
    if (resp !== transparentPng) {
      (<HTMLInputElement>document.getElementById("client_pantilt")).checked =
        true;
      switchPanTilt();
    }
  });
  tryUrls(`${bgfolder}defenseempty`).then((resp) => {
    (<HTMLImageElement>document.getElementById("client_court_def")).src = resp;
  });
  tryUrls(`${bgfolder}transition_def`).then((resp) => {
    (<HTMLImageElement>document.getElementById("client_court_deft")).src = resp;
  });
  tryUrls(`${bgfolder}witnessempty`).then((resp) => {
    (<HTMLImageElement>document.getElementById("client_court_wit")).src = resp;
  });
  tryUrls(`${bgfolder}transition_pro`).then((resp) => {
    (<HTMLImageElement>document.getElementById("client_court_prot")).src = resp;
  });
  tryUrls(`${bgfolder}prosecutorempty`).then((resp) => {
    (<HTMLImageElement>document.getElementById("client_court_pro")).src = resp;
  });

  if (client.charID === -1) {
    client.viewport.set_side({
      position: "jud",
      showSpeedLines: false,
      showDesk: true,
    });
  } else {
    client.viewport.set_side({
      position: client.chars[client.charID].side,
      showSpeedLines: false,
      showDesk: true,
    });
  }
};


/**
 * i am mod now
 * @param {Array} args packet arguments
 */
export const handleAUTH = (args: string[]) => {
    if (args[1] === "1") {
      (<HTMLAnchorElement>document.getElementById("mod_ui")).href =
        `styles/mod.css`;
    }
};


export {handleSC}

/**
 * Handles incoming character information, containing all characters
 * in one packet.
 * @param {Array} args packet arguments
 */
async function handleSC(args: string[]) {
  if (mode === "watch") {
    // Spectators don't need to pick a character
    document.getElementById("client_charselect")!.style.display = "none";
  } else {
    document.getElementById("client_charselect")!.style.display = "block";
  }

  document.getElementById("client_loadingtext")!.innerHTML =
    "Loading Characters";
  for (let i = 1; i < args.length; i++) {
    const chargs = args[i].split("&");
    const charid = i - 1;

    setTimeout(() => handleCharacterInfo(chargs, charid), charid * 6);
  }
  // We're done with the characters, request the music
  client.sender.sendServer(
    MessageType.RM, []
  )
};


import { oldLoading } from "../../client";

/**
 * Received when the server announces its server info,
 * but we use it as a cue to begin retrieving characters.
 * @param {Array} args packet arguments
 */
export const handleSI = (args: string[]) => {
  client.char_list_length = Number(args[1]);
  client.evidence_list_length = Number(args[2]);
  client.music_list_length = Number(args[3]);

  // create the charselect grid, to be filled by the character loader
  document.getElementById("client_chartable")!.innerHTML = "";

  for (let i = 0; i < client.char_list_length; i++) {
    const demothing = document.createElement("img");

    demothing.className = "demothing";
    demothing.id = `demo_${i}`;
    const demoonclick = document.createAttribute("onclick");
    demoonclick.value = `pickChar(${i})`;
    demothing.setAttributeNode(demoonclick);

    document.getElementById("client_chartable")!.appendChild(demothing);
  }

  // this is determined at the top of this file
  if (!oldLoading) {
    client.sender.sendServer(
      MessageType.RETRIEVE_CHARACTERS, []
    )
  } else {
    client.sender.sendServer(
      MessageType.ASK_CHARACTER_2, []
    )
  }
};


/**
 * Handles incoming music information, containing all music in one packet.
 * @param {Array} args packet arguments
 */
export const handleSM = (args: string[]) => {
  document.getElementById("client_loadingtext")!.innerHTML = "Loading Music ";
  client.resetMusicList();
  client.resetAreaList();

  client.musics_time = false;

  document.getElementById("client_loadingtext")!.innerHTML = `Loading Music`;

  for (let i = 1; i < args.length - 1; i++) {
    // Check when found the song for the first time
    const trackname = args[i];
    const trackindex = i - 1;

    if (client.musics_time) {
      addTrack(trackname);
    } else if (isAudio(trackname)) {
      client.musics_time = true;
      fix_last_area();
      addTrack(trackname);
    } else {
      createArea(trackindex, trackname);
    }
  }

  // Music done, carry on
  client.sender.sendServer(
    MessageType.RD, []
  )
};


export {handleSP}

/**
 * position change
 * @param {string} pos new position
 */
function handleSP(args: string[]) {
  updateActionCommands(args[1]);
};


/**
 * Handles a modcall
 * @param {Array} args packet arguments
 */
export const handleZZ = (args: string[]) => {
  const oocLog = document.getElementById("client_ooclog")!;
  const message = args[1].replace(/\n/g, "<br>");
  oocLog.innerHTML += `$Alert: ${prepChat(message)}<br>`;
  if (oocLog.scrollTop > oocLog.scrollHeight - 60) {
    oocLog.scrollTop = oocLog.scrollHeight;
  }

  client.viewport.getSfxAudio().pause();
  const oldvolume = client.viewport.getSfxAudio().volume;
  client.viewport.getSfxAudio().volume = 1;
  client.viewport.getSfxAudio().src = `${AO_HOST}sounds/general/sfx-gallery.opus`;
  client.viewport.getSfxAudio().play();
  client.viewport.getSfxAudio().volume = oldvolume;
};


/**
 * Handles a timer update
 * @param {Array} args packet arguments
 */
export const handleTI = (args: string[]) => {
    const timerid = Number(args[1]);
    const type = Number(args[2]);
    const timer_value = args[3];
    switch (type) {
      case 0:
      //
      case 1:
        document.getElementById(`client_timer${timerid}`)!.innerText =
          timer_value;
      case 2:
        document.getElementById(`client_timer${timerid}`)!.style.display = "";
      case 3:
        document.getElementById(`client_timer${timerid}`)!.style.display = "none";
    }
};
  