export const TOTALWEEKDAY: number = 7;


export function dateIsBefore(d1: Date, d2: Date) {
    return new Date(d2) > new Date(d1);
}

export function dateIsBeforeOr(d1: Date, d2: Date) {
    return new Date(d2) > new Date(d1);
}


export function addWeek(date) {
    let newDate = new Date(date);
    newDate.setDate(date.getDate() + TOTALWEEKDAY);
    return newDate;
}

export function getUTCDate(d: Date): Date {
    const date = new Date(d)
    let thisDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
    return thisDate;
}

export function sortByDate(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
}

export function dateBetween(date: Date, fromDate: Date, toDate: Date) {
    const to = new Date(toDate)
    const from = new Date(fromDate)
    return date.getTime() <= to.getTime() && date.getTime() >= from.getTime();
}