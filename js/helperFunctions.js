var helperFunctions = {};

helperFunctions.mongooseFindById = function (mongooseObj, id) {
    var obj = {};
    for (var i = 0; i < mongooseObj.length; i++) {
        if (mongooseObj[i]._id == id) {
            obj.data = mongooseObj[i];
            obj.index = i;
            break;
        }
    }

    return obj;
}

helperFunctions.findStringifyId = function (mongooseObj, id) {
    var obj = {};
    for (var i = 0; i < mongooseObj.length; i++) {
        if (JSON.stringify(mongooseObj[i]._id) == JSON.stringify(id)) {
            obj.data = mongooseObj[i];
            obj.index = i;
            break;
        }
    }

    return obj;
}

helperFunctions.numberExists = function (param1) {
    return (typeof param1 !== 'undefined');
}

helperFunctions.isValidIndex = function (param1) {
    return (typeof param1 !== 'undefined' && param1 > -1);
}

helperFunctions.stringyComp = function (param1, param2) {
    return (JSON.stringify(param1) == JSON.stringify(param2));
}

helperFunctions.propIsString = function (obj, prop) {
    return (prop in obj && obj[prop] && (typeof obj[prop]) === 'string');
}

helperFunctions.indexOfKeyValInObjArr = function (arrayParam, keyParam, valueParam) {
    if (Array.isArray(arrayParam) && arrayParam.length > 0) {
        for (let x = 0; x < arrayParam.length; x++) {
            if (arrayParam[x] && typeof arrayParam[x] === 'object' && keyParam in arrayParam[x] && arrayParam[x][keyParam] == valueParam) {
                return x;
            }
        }
    }
    return -1;
}

helperFunctions.objPropHasValue = function (objParam, propParam, typeParam) {
    // unsaon pag return kung wala objParam og propParam?
    if (typeof typeParam !== 'undefined' && typeParam !== 'array' && (typeParam === 'string' || typeParam === 'object' || typeParam === 'number' || typeParam === 'object' || typeParam === 'function')) {
        return (propParam in objParam && typeof objParam[propParam] === typeParam && objParam[propParam]);
    } else if (typeof typeParam !== 'undefined' && typeParam === 'array') {
        return (propParam in objParam && Array.isArray(objParam[propParam]) && objParam[propParam]);
    } else if (typeParam !== 'undefined' && typeParam === 'boolean') {
        return (propParam in objParam && typeof objParam[propParam] === 'boolean');
    } else {
        return (propParam in objParam && objParam[propParam]);
    }
}

module.exports = helperFunctions;