import { DatatypesUtility } from "../utils/DatatypesUtility";
import { delay } from "../utils/threads";

export const getData = async (address: string, api: string, method: string = "GET", sleepInMilleseconds = 500) => {
    if(sleepInMilleseconds && sleepInMilleseconds > 0){
      console.log("delay: " + sleepInMilleseconds);
      await delay(sleepInMilleseconds);
    }
    const fetchURL = api + address;
    console.log(fetchURL);
    const result = await fetch(fetchURL, {method: method})
      .then(data => data.json());
    if(typeof result.data === "number"){
        let num: number = result.data;
        result.data = num.toFixed(2);
    }
    return result;
}

export const getDataGene = async (address: string, api: string, dataType: string, method: string = "GET") => {
  const fetchURL = api + address;
  console.log(fetchURL);
  const result = await fetch(fetchURL, {method: method})
    .then(data => data.json());
  if(result){
      return result.data;
  }
  switch(dataType){
    case "boolean":
      return DatatypesUtility.getDefaultBoolean();
    case "integer":
      return DatatypesUtility.getDefaultInteger();
    case "double":
      return DatatypesUtility.getDefaultDouble();
    default: // text
      return DatatypesUtility.getDefaultText();
  }
}
