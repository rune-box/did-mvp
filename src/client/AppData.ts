export const AppSettings = {
    //APIPrefix: "https://localhost:7153/v0/",
    APIPrefix: "https://api.runebox.xyz/v0/",
}

export class GlobalParam{
    did: string = "";
    type: string = "";
}

// export const AppData = {
//     AppData: new GlobalParam(),
// }

export const loadAppData = (): string =>{
    const data = (window as any).AppData;
    if(!data) return "";
    const did = data.did;
    if(!did) return "";
    return did;
}

export const resetAppData = () => {
    (window as any).AppData = {};
}