import { DataRune } from "../models/DataRune";
import { getDataGene } from "../services/HttpWorker";

const computeBoolScore = (data: boolean, rules: Array<any>): number => {
    if(!rules || rules.length === 0){
        return 0;
    }
    const rule = rules[0];
    if(data) return rule.trueScore;
    return rule.falseScore;
}

const computeNumberRule = (data: number, rule: any): number => {
    let leftCheck = false, rightCheck = false;
    if(rule.leftCondition === "[") leftCheck = (data >= rule.leftValue);
    else if(rule.leftCondition === "(") leftCheck = (data > rule.leftValue);
    else leftCheck = true;

    if(rule.rightCondition === "[") rightCheck = (data >= rule.rightValue);
    else if(rule.rightCondition === "(") rightCheck = (data > rule.rightValue);
    else rightCheck = true;

    // let checkResult = false;
    // if(rule.condition === ""){}
    // else if(rule.condition === ""){}
    // else {}

    return (leftCheck && rightCheck) ? rule.score : 0;
}
const computeNumberScore= (data: number, rules: Array<any>): number => {
    if(!rules || rules.length === 0){
        return 0;
    }
    let score = 0;
    for(let i = 0; i< rules.length; i++){
        const rule = rules[i];
        const ruleScore = computeNumberRule(data, rules[i]);
        //if(ruleScore > 0){ score = ruleScore; break;}
        if(score < ruleScore) score = ruleScore;
    }
    return score;
}

const computeTextScore= (data: string, rules: Array<any>): number => {
    if(!rules || rules.length === 0){
        return 0;
    }
    let score = 0;
    for(let i = 0; i< rules.length; i++){
        const rule = rules[i];
        if(rule.checkValue === data){
            score = rule.score;
            break;
        }
    }
    return score;
}

// score * factor
export const ComputeScoreDirectly = async (rules: Array<any>, address: string) => {
    const result = {
        data: new Map<string, any>(),
        score: 0
    }
    if(!rules || rules.length === 0){
        return result;
    }
    
    let score: number = 0;
    for(let i = 0; i< rules.length; i++){
        const rule = rules[i];
        const rune = rule.rune;
        if(rune.apis.length === 0) continue;
        const api = rune.apis[0];
        const data = await getDataGene(address, api.uri, rune.dataType);
        result.data.set(rune.id, data);
        let ruleScore = 0;
        switch(rune.dataType){
            case "boolean":
                ruleScore = computeBoolScore(data as boolean, rule.boolRules);
                break;
            case "integer":
                ruleScore = computeNumberScore(data as number, rule.numberRules);
                break;
            case "double":
                ruleScore = computeNumberScore(data as number, rule.numberRules);
                break;
            case "text":
                ruleScore = computeTextScore(data as string, rule.textRules);
                break;
        }
        score += ruleScore * rule.factor;
    }
    result.score = score;
    return result;
}