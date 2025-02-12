import { compressImage } from "./tinyPNG/compressImage";

const args=process.argv;
// pnpm tiny '/Users/huangzuxiang/Documents/project/my-tools/demo.png' '/Users/huangzuxiang/Documents/project/my-tools/demo2.png'
compressImage(args[2],args[3]);