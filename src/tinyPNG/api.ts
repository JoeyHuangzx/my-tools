export interface Input {
  size: number;
  type: string;
}

export interface Output {
  size: number;
  type: string;
  width: number;
  height: number;
  ratio: number;
  url: string;
}

export interface ImageCompressionResult {
  input: Input;
  output: Output;
}