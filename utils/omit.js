function omit(obj, keys) {
    return Object.getOwnPropertyNames(obj).reduce(function(acc, name) {
        if (!keys.includes(name)) {
            acc[name] = obj[name];
        }
        return acc;
    }, {});
}



module.exports = {
    omit
}
