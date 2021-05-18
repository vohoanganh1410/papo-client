// Debounce function based on underscores modified to use es6 and a cb
export function debounce(func: (...args: any) => mixed, wait: number, immediate: boolean, cb: () => mixed) {
    let timeout;
    return function fx(...args: Array<any>) {
        const runLater = () => {
            timeout = null;
            if (!immediate) {
                Reflect.apply(func, this, args);
                if (cb) {
                    cb();
                }
            }
        };
        const callNow = immediate && !timeout;
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(runLater, wait);
        if (callNow) {
            Reflect.apply(func, this, args);
            if (cb) {
                cb();
            }
        }
    };
}