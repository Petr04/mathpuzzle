export function getJSONItem(name) {
    let ret = localStorage.getItem(name);
    if (ret != null) {
        return JSON.parse(ret);
    }
    return null;
}

export function setJSONItem(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
}
