
export const roundToTwo = (num: number) => {
    return +(Math.round(Number(num + "e+2"))  + "e-2");
}

export const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}