"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
const keys_1 = require("../keys");
/**
 * It takes an options object and returns a function that takes a target, propertyName, and descriptor
 *
 * @param {IdentityOptions} options - IdentityOptions
 *
 * @returns A function that is used as a decorator.
 */
function Node(options) {
    return function (target, propertyName, descriptor) {
        var _a;
        const nodes = (_a = Reflect.getOwnMetadata(keys_1.NodeKey, target, '$__metadata__')) !== null && _a !== void 0 ? _a : {};
        if ('name' in options)
            nodes[options.name] = { options, propertyName };
        else if ('id' in options)
            nodes[options.id] = { options, propertyName };
        Reflect.defineMetadata(keys_1.NodeKey, nodes, target, '$__metadata__');
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const method = descriptor.value;
        descriptor.value = function ({ activity, context, token, data, value }) {
            const params = Reflect.getOwnMetadata(keys_1.ParamKey, target, propertyName);
            if (params === null || params === void 0 ? void 0 : params.length) {
                const args = [];
                if ('$__metadata__' in this) {
                    for (const param of params) {
                        if (param.type === 'activity')
                            args.push(activity);
                        else if (param.type === 'data')
                            args.push(data);
                        else if (param.type === 'value')
                            args.push(value);
                        else if (param.type === 'token')
                            args.push(token);
                        else if (param.type === 'context')
                            args.push(context);
                        else
                            throw new Error('Arguments type is not supported');
                    }
                }
                else
                    throw new Error('@Process decorator is required');
                return method.call(this, ...args);
            }
        };
    };
}
exports.Node = Node;
//# sourceMappingURL=method.js.map