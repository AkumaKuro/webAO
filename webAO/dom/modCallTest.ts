import { packetHandler } from "../packets/packetHandler";
/**
 * Triggered by the modcall sfx dropdown
 */
export function modcall_test() {
  packetHandler.get("ZZ")!("test#test".split("#"));
}
(globalThis as any).modcall_test = modcall_test;
