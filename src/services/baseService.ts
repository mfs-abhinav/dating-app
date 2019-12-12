class BaseService {

    constructor() { }

    // date compare
    public compareDate(date1: Date, date2: Date) {

        const d1 = new Date(date1);
        const d2 = new Date(date2);

        const same = d1.getTime() === d2.getTime();
        if (same) {
            return 0;
        } else if (d1 > d2) { // Check if the first is greater than second
           return 1;
        } else if (d1 < d2) { // Check if the first is less than second
            return -1;
        }
    }

    // check whether string is empty or not. It check for null, undefined, blank
    public isEmpty(str: string) {
        return (!str || 0 === str.trim().length);
    }
}

export default BaseService;

