import acorn from '../../type/type';
import { print, variable, Function, IF, Out, For } from '..';
/**
 * @module parse
 * @returns {acorn.OUT} 変換結果を出力
 */
export default function parse({
    codes,
    out,
    conversion,
}: {
    codes: acorn.Node;
    out: acorn.OUT;
    conversion: acorn.CONVERSION;
}): acorn.OUT {
    for (const code of codes.body) {
        if (code.type === 'FunctionDeclaration') {
            out = Function({ code, out, conversion: conversion.Function });
        }
    }
    for (const code of codes.body) {
        out.cash = Out.cleanCash(out);
        if (code.type === 'ExpressionStatement') {
            out.code += print({
                code,
                out,
                conversion: conversion.Print,
            }).cash.code;
        } else if (code.type === 'VariableDeclaration') {
            out.cash.code = '';
            out.code += variable({
                code,
                out,
                conversion: conversion.Variable,
            }).out.cash.code;
        } else if (code.type === 'IfStatement') {
            out.cash.code = '';
            out.code += IF({
                code,
                out,
                conversion: { IF: conversion.IF },
            }).cash.code;
        } else if (code.type === 'ForStatement') {
            out.cash = Out.cleanCash(out);
            out = For(code, out, {
                For: conversion.For,
                Kind: conversion.Variable.Kind,
            });
        }
    }
    out.code = out.cash.Function + out.code;
    return out;
}
