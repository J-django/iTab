export function loadImg(fileName: string) {
  return new URL(`../../assets/images/${fileName}`, import.meta.url).href;
}

export function loadSvg(fileName: string) {
  return new URL(`../../assets/svg/${fileName}`, import.meta.url).href;
}
