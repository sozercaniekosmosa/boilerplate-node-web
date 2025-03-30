import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

self.onmessage = function (e) {
    const {code} = e.data;
    const newAnnotations = [];

    try {
        const ast = acorn.parse(code, {
            ecmaVersion: 'latest',
            sourceType: 'script',
            allowHashBang: true,
            allowAwaitOutsideFunction: true,
            locations: true
        });

        walk.simple(ast, {
            VariableDeclaration(node) {
                if (node.kind === 'var') {
                    throw {
                        message: 'Используйте const/let вместо var',
                        loc: node.loc.start,
                        type: "warning"
                    };
                }
            }
        });

    } catch (error) {
        const {loc, message, type} = error;
        if (loc) {
            newAnnotations.push({
                row: loc.line - 1,
                column: loc.column,
                text: message,
                type: type ?? "error"
            });
        }
    }

    self.postMessage({annotations: newAnnotations});
};