import Config from '../ToyBox/Config';

export const roundToTwo = (num: number) => {
    return +(Math.round(Number(num + "e+2"))  + "e-2");
}

export const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function leftPad(value: number) {
    return value >= 10 ? value : `0${value}`;
}

export function toStringByFormatting(source: Date) { 
    const year  = source.getFullYear(); 
    const month = leftPad(source.getMonth() + 1); 
    const day   = leftPad(source.getDate()); 
    const hour  = leftPad(source.getHours());
    const minute = leftPad(source.getMinutes());

    return `${[year, month, day].join('-')} ${[hour, minute].join(':')}`; 
}

export const goServer = async ( api: string, method: string, headers: any, body?: any ) => {
    try{
        const res: Response = await fetch( Config.serverIP + api, {
            method: method,
            headers: headers,
            body: body
        });
        
        return new Promise(async (resolve, reject) => {
            if(res.ok) {
                const rows = await res.json();
                resolve(rows);
            } else {
                reject(res);
            }
        });
    } catch(e) {
        console.log(e);
    }
}