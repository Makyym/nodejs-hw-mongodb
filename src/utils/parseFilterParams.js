const parseType = (type) => {
    const isString = typeof type === 'string';
    if(!isString) return;
    const isType = (type) => ['work', 'home', 'personal'].includes(type);
    if (isType(type)) return type;
};

const parseIsFavoutite = (type) => {
    if (typeof type === 'boolean') {
        return type;
    };
    if (typeof type === 'string') {
        if (type.toLowerCase() === 'true') return true;
        if (type.toLowerCase() === 'false') return false;
    };
};

export const parseFilterParams = (query) => {
    const {type, isFavourite} = query;
    const parsedType = parseType(type);
    const parsedIsFavourite = parseIsFavoutite(isFavourite);
    return {
        type: parsedType,
        isFavourite: parsedIsFavourite,
    };
};