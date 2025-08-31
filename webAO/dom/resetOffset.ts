export function resetOffset(_event: Event) {
  (<HTMLInputElement>document.getElementById("pair_offset")).value = "0";
  (<HTMLInputElement>document.getElementById("pair_y_offset")).value = "0";
}
(globalThis as any).resetOffset = resetOffset;
