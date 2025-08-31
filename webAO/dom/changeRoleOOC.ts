import { updateActionCommands } from "./updateActionCommands";
import { client } from "../client";
import { MessageType } from "../client/sender/messageEncoder";
/**
 * Change role via OOC.
 */
export function changeRoleOOC() {
  const roleselect = <HTMLInputElement>document.getElementById("role_select");

  client.sender.sendOOC(`/pos ${roleselect.value}`);
  client.sender.sendServer(
    MessageType.SP, [roleselect.value]
  )
  updateActionCommands(roleselect.value);
}
(window as any).changeRoleOOC = changeRoleOOC;
