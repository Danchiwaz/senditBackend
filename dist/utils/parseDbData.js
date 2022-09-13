"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseDbData = (data, key) => {
    const array = data.rows[0][key];
    if (array)
        return array[0];
    return null;
};
exports.default = parseDbData;
