
export class Utility {
    static secondsOf24Hours = 86400;

    public static generatePlainUUID(): string {
        let id = "";
        if(crypto){
            id = crypto.randomUUID();
        }
        else if(URL){
            const url = URL.createObjectURL(new Blob());
            id = url.toString();
            URL.revokeObjectURL(url);
            id = id.substring(id.lastIndexOf("/") + 1);
        }
        id = id.replace(new RegExp("-", "g"), '');
        return id.toLocaleLowerCase();
    }

    /**
     * return a integer number less than max
     * @param max 
     */
    static getRandomInt(max: number, min = 0) {
        //return Math.floor(Math.random() * Math.floor(max));

        // https://stackoverflow.com/a/41452318/1247872
        let range = max - min;
        if (range <= 0) {
            //throw ('max must be larger than min');
            const tmp = max;
            max = min;
            min = tmp;
            range = -range;
        }

        const requestBytes = Math.ceil(Math.log2(range) / 8);
        if (!requestBytes) { // No randomness required
            return min;
        }
        const maxNum = Math.pow(256, requestBytes);
        const ar = new Uint8Array(requestBytes);

        while (true) {
            window.crypto.getRandomValues(ar);

            let val = 0;
            for (let i = 0; i < requestBytes; i++) {
                val = (val << 8) + ar[i];
            }

            if (val < maxNum - maxNum % range) {
                return min + (val % range);
            }
        }
    }

    // static getRandomElement(list: Array<any>) {
    //     const index = Utility.getRandomInt(list.length - 1);
    //     return list[index];
    // }

    // static createLocalFileName(id: string, extension_name: string) {
    //     let filename = "." + extension_name;
    //     if (id && id.length > 0) {
    //         filename = id + filename;
    //     }
    //     else {
    //         const now = _.now();
    //         filename = "lore." + now + filename;
    //     }
    //     return filename;
    // }

    // static getHostOfUri(uri: string) {
    //     if (uri) {
    //         const pathArray = uri.split('/');
    //         //const protocol = pathArray[0];
    //         //const host = pathArray[2];
    //         //const url = protocol + '//' + host;
    //         return pathArray[2];
    //     }
    //     return "n/a";
    // }

    static getTimestamp(){
        const now = new Date();
        const timestampInSeconds = Math.floor(now.getTime() / 1000);
        return timestampInSeconds;
    }
}