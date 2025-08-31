import { client } from "../client";
import { cancelEvidence } from "./cancelEvidence";

/**
 * Delete selected evidence.
 */
export function deleteEvidence() {
  const id = client.selectedEvidence;
  client.sender.sendDE(id);
  cancelEvidence();
}
(globalThis as any).deleteEvidence = deleteEvidence;
