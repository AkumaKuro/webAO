export {};

declare global {
  interface Window {
    changeRoleOOC: () => void
    pickEmotion(index: number) : void
  }
}