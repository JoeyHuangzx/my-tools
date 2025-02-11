
import { config } from 'dotenv';
import { askDoubao } from './ai/doubao';

config();

const args=process.argv;
console.log(args[2]);
askDoubao(process.argv[2]);