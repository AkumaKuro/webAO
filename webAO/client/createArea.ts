import { client } from "../client";
import { area_click } from "../dom/areaClick";
import { safeTags } from "../encoding";

export { createArea, Area, AreaStatus, AreaLockMode, parseEnum }

enum AreaStatus {
  IDLE = "IDLE"
}

function parseEnum<E extends Record<string, string | number>>(
  e: E,
  value: string | number,
  fallback: E[keyof E]
): E[keyof E] {
  if (Object.values(e).includes(value as E[keyof E])) {
    return value as E[keyof E]
  }
  return fallback;
}

enum AreaLockMode {
  LOCKED = "LOCKED",
  FREE = "FREE"
}

class Area {
  name: string
  players: number
  status: AreaStatus
  cm: string
  locked: AreaLockMode
}

function createArea(id: number, aname: string) {
  const name = safeTags(aname);
  const area: Area = {
    name: name,
    players: 0,
    status: AreaStatus.IDLE,
    cm: "",
    locked: AreaLockMode.FREE
  }

  client.areas.push(area);

  // Create area button
  const new_area = document.createElement("SPAN");
  new_area.className = "area-button area-default";
  new_area.id = `area${id}`;
  new_area.innerText = area.name;
  new_area.title =
    `Players: ${area.players}\n` +
    `Status: ${area.status}\n` +
    `CM: ${area.cm}\n` +
    `Area lock: ${area.locked}`;
  new_area.onclick = function () {
    area_click(new_area);
  };

  document.getElementById("areas")!.appendChild(new_area);
};
