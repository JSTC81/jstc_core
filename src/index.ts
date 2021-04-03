import fs from 'fs';
import variable from './parse/modules/variable';
import print from './parse/modules/print';
import Function from './parse/modules/function';
import IF from './parse/modules/if';
import Binary from './parse/modules/Binary';
import parse from './parse/parse';
import For from './parse/modules/for';
import { Out } from './parse/out';
import python from './parse/modes/python';
import ruby from './parse/modes/ruby';
/**
 *
 * @module check
 * @param {string} file
 * ファイルがあるかチェック
 * @returns {boolean} あったらtureなかったらfalse
 */
const check = (file: string): boolean => {
    let hasfaile = false;
    try {
        fs.statSync(file);
        hasfaile = true;
    } catch (err) {
        console.log(err);

        hasfaile = false;
    }
    return hasfaile;
};

/**
 *
 * @module read
 * @param {string} file
 * @returns {string} 読み込んだ結果をstringで返す
 */
const read = (file: string): string => {
    return check(file) ? fs.readFileSync(file, 'utf8') : '';
};

export {
    check,
    read,
    python,
    variable,
    print,
    Function,
    ruby,
    IF,
    parse,
    Out,
    Binary,
    For,
};
