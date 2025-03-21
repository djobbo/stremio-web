declare const usePlayer: (
  urlParams: UrlParams,
  videoParams: any,
) => [
  Player,
  (time: number, duration: number, device: string) => void,
  (paused: boolean) => void,
  () => void,
  () => void,
]
export = usePlayer
