export function stringToNumber(arg?:string){
    const n = Number(arg);
    return Number.isNaN(n)?undefined:n;
}