import { ethers } from "ethers";
import { isBytesLike } from "ethers/lib/utils";
import { DataRune, DataRuneTask, ImprintItem } from "../models/DataRune";

export class DataRuneUtility {
    static convertToTasks(runes: Array<DataRune>){
        const tasks: Array<DataRuneTask> = [];
        if(!runes) return tasks;
        runes.forEach(element => {
            tasks.push(new DataRuneTask(element));
        });
        return tasks;
    }

    static getData0(tasks: Array<DataRuneTask>){
        const imprints: Array<ImprintItem> = [];
        if(!tasks) return tasks;
        tasks.forEach(element => {
            imprints.push(new ImprintItem(element));
        });
        return imprints;
    }
    static getData(evmTasks: Array<DataRuneTask>, idenaTasks: Array<DataRuneTask>,
        nervosTasks: Array<DataRuneTask>){
        let imprints: Array<ImprintItem> = [];
        const evmData = this.getData0(evmTasks);
        if(evmData.length > 0)
            imprints = imprints.concat(evmData);

        const idenaData = this.getData0(idenaTasks);
        if(idenaData.length > 0)
            imprints = imprints.concat(idenaData);
        
        const nervosData = this.getData0(nervosTasks);
        if(nervosData.length > 0)
            imprints = imprints.concat(nervosData);

        imprints = imprints.sort((a, b) => {
            return a.id.localeCompare(b.id, 'en', { sensitivity: 'base' });
        });
        return imprints;
    }
    static keccak256(imprints: Array<ImprintItem>){
        if(!imprints || imprints.length === 0)
            return "";
        imprints = imprints.sort((a, b) => {
            return a.id.localeCompare(b.id, 'en', { sensitivity: 'base' });
        });
        const text = JSON.stringify(imprints);
        console.log("Client data text: " + text);
        const bytes = ethers.utils.toUtf8Bytes(text);
        const hash = ethers.utils.keccak256(bytes);
        return hash;
    }

}