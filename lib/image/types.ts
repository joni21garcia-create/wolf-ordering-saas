export interface GeneratedIcon {
  name: string;
  filename: string;
  size: number;
  buffer: Buffer;
}

export interface GenerateIconsResult {
  icons: GeneratedIcon[];
}