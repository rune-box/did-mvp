export class API {
    uri: string = "";
    provider: string = "";
    lastPingAt: number = 0;
}

export class DataRune {
    id: string = "";
    title: string = "";
    description: string = "";
    apis: Array<API> = [];
    isTask: boolean = false;
    dataType: string = "";
    possibleValues: Array<any> = [];
    keywords: Array<string> = [];
    schemaVersion: number = 0;
}

export class DataRunesGroup{
    name: string = "";
    items: Array<DataRune> = [];
}