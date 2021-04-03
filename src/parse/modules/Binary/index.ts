import acorn from '../../../../type/type';
const walk = require('acorn-walk');

/**
 * @module BinaryExpression
 * @param c
 * @param out
 */
export default (
    c: acorn.Body | acorn.Body3,
    out: acorn.OUT,
    conversion: { BinaryExpression: (data: string[]) => string },
) => {
    let t = {
        name: '',
        raw: '',
    };
    if (c.expression.arguments[0].left.type === 'Identifier') {
        t.name = c.expression.arguments[0].left?.name;
    }
    if (c.expression.arguments[0].right.type === 'Identifier') {
        t.raw = c.expression.arguments[0].right?.name;
    }
    if (c.expression.arguments[0].right.type === 'Literal') {
        t.raw = `${c.expression.arguments[0].right?.value}`;
    }
    if (c.expression.arguments[0].left.type === 'Literal') {
        t.name = `${c.expression.arguments[0].left?.value}`;
    }
    walk?.full(c, (node: acorn.Argument): void => {
        if (node.type === 'BinaryExpression') {
            if (node.left.type === 'BinaryExpression') {
                function hasLiteral(
                    d: acorn.Argument | acorn.Left | acorn.Right | acorn.Id,
                ): boolean {
                    return (
                        d['type'] === 'Literal' && !isNaN(Number(d['value']))
                    );
                }
                if (node.left.left.type !== 'BinaryExpression') {
                    let left: string | number = node.left.left.value;
                    let right: string | number = node.left.right.value;
                    if (node.left.left.type === 'Identifie') {
                        left = node.left.left.name;
                    }
                    if (node.left.right.type === 'Identifie') {
                        right = node.left.right.name;
                    }
                    if (out.option.optimisation) {
                        left = 0;
                        right = '';
                        for (const d of [
                            node.left.left,
                            node.left.right,
                            c.expression.arguments[0].left,
                            c.expression.arguments[0].right,
                        ].filter((n) => hasLiteral(n) === true)) {
                            left = Number(left) + Number(d.value);
                        }
                        for (const d of [
                            node.left.left,
                            node.left.right,
                            c.expression.arguments[0].left,
                            c.expression.arguments[0].right,
                        ].filter((n) => hasLiteral(n) === false)) {
                            right += `+${d.name}`;
                        }
                        if (right) {
                            t.name += left;
                        } else {
                            t.raw += `${node.left.operator}${right}`;
                        }
                    } else {
                        t.name += `${left}${node.left.operator}${right}`;
                    }
                } else {
                    let right: string | number = node.left.right.value;
                    if (node.left.right.type === 'Identifier') {
                        right = node.left.right.name;
                    }
                    if (out.option.optimisation) {
                        if (hasLiteral(node.left.right)) {
                            t.name = String(Number(t.name) + Number(right));
                        } else {
                            t.raw += `${node.left.operator}${right}`;
                        }
                    } else {
                        t.name += `${node.left.operator}${right}`;
                    }
                }
            }
        }
        if (node.right?.type == 'BinaryExpression') {
            if (node.right.left.type === 'Literal') {
                t.raw += `${node.right.left.raw}${node.right.operator}${node.right.right.raw}`;
            } else if (node.right.left.type === 'BinaryExpression') {
                if (node.right.left.left.type == 'Literal') {
                    t.raw += `${node.right.left.left.raw}${node.right.left.operator}${node.right.left.right.raw}`;
                }
            }
            {
            }
        }
    });
    if (Number(t.raw[0]) !== NaN && !isNaN(Number(t.name))) {
        t.name = String(Number(t.name) + Number(t.raw[0]));
        t.raw = t.raw.slice(t.raw.search(/[(+|-|*|%|\/)]/) + 1);
    }
    if (out.option.optimisation) {
        if (!isNaN(Number(t.raw))) {
            c.expression.arguments[0].operator = '';
            t.raw = '';
        }
    }
    out.cash.code += conversion.BinaryExpression([
        t.name,
        c.expression.arguments[0].operator,
        t.raw,
    ]);
    const binary = [t.name, c.expression.arguments[0].operator, t.raw];

    return { out, binary };
};
