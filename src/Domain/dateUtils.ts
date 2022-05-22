export const TOTALWEEKDAY: number = 7;


export function addOneDay(d: Date) {
    let date = new Date(d)
    date.setDate(date.getDate() + 1);
    return date;
}

export function dateIsBefore(d1: Date, d2: Date) {
    return new Date(d2) > new Date(d1);
}

export function addWeek(date) {
    let newDate = new Date(date);
    newDate.setDate(date.getDate() + TOTALWEEKDAY);
    return newDate;
}

export function getUTCDate(d: Date): Date {
    const date = new Date(d)
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));;
}

export function sortByDate(a, b): number {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
}

export function dateBetween(date: Date, fromDate: Date, toDate: Date): boolean{
    const to = new Date(toDate)
    const from = new Date(fromDate)
    return date.getTime() <= to.getTime() && date.getTime() >= from.getTime();
}

export function diffDays(d1: Date, d2: Date): number{
    const date1 = new Date(d1);
    const date2 = new Date(d2)
    var SECONDS_IN_DAY = 1000 * 3600 * 24;
    return (date2.getTime() - date1.getTime()) / SECONDS_IN_DAY;
}