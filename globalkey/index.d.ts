declare module "globalkey" {
    export function start(keydown_callback: (keys: string[]) => void, keyup_callback: (keys: string[]) => void): void;
    export function stop(): void;
}