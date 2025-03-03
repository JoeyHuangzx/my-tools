
import { config } from 'dotenv';
import { askDoubao } from './ai/doubao';
import { askDeepseek } from './ai/deepseek';

config();

const args=process.argv;

if(args.length<3){
    console.log("Usage: node ai.ts <question>");
    process.exit(1);
}else{
    console.log("Question: "+args[2]);
    if(args[2]==='doubao'){
        askDoubao(args[3]);
    }else{
      askDeepseek(args[3]);
    }
}