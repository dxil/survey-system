
const isInstanceOf = type => element => Object.prototype.toString.call(element) === `[object ${type}]`;

export const isArray = isInstanceOf("Array");
export const isDate = isInstanceOf("Date");
export const isFunction = isInstanceOf("Function");

export const isInteger = num => typeof num === "number" && parseInt(num, 10) === num;

export const cloneObject = (src) => {
    let tar = new src.constructor();
    for (let key of Object.keys(src)) {
        switch (typeof src[key]) {
            case "number":
            case "string":
            case "boolean": tar[key] = src[key]; break;
            case "object": {
                switch (true) {
                    case isArray(key): tar[key] = [...src[key]]; break;
                    case isDate(key): tar[key] = new Date(src[key].valueOf()); break;
                    default: tar[key] = cloneObject(src[key]);
                }
                break;
            }
        }
    }
    return tar;
};