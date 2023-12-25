function useDebounce(cb, delary = 2000) {
    let timerId;
    return (...args) => {
        console.log(...args);
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            cb(...args);
        }, delary);
    }
}

export default useDebounce;

