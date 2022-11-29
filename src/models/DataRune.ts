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
    accountType: string = "";
    state: string = "";
    possibleValues: Array<any> = [];
    keywords: Array<string> = [];
    schemaVersion: number = 0;
}

export class DataRunesGroup{
    name: string = "";
    items: Array<DataRune> = [];
}

export class DataRuneTask{
    rune: DataRune;
    data: any;
    isLoading: boolean = true;
    finished: boolean = false;
    failed: boolean = false;
    updatedAt: number = -1;

    constructor(_rune: DataRune){
        this.rune = _rune;
    }
}

export class ImprintItem {
    id: string;
    data: any;

    constructor(task: DataRuneTask){
        this.id = task.rune.id;
        this.data = task.data;
    }
}