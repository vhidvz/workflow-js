"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = void 0;
const container_1 = require("../../core/container");
const utils_1 = require("../../utils");
const keys_1 = require("../keys");
require("reflect-metadata");
/**
 * It takes a ProcessOptions object and an optional id string, and returns a decorator function that
 * takes a class and returns a new class with a  property that contains the ProcessOptions
 * object and the id string
 *
 * @param options - ProcessOptions & IdentityOptions
 * @param {string} id - The id of the process definition.
 *
 * @returns A function that returns a class that extends the class passed in.
 */
function Process(options, id = keys_1.Default) {
    if ('schema' in options)
        container_1.Container.addDefinition(id, options.schema);
    if ('xml' in options)
        container_1.Container.addDefinition(id, (0, utils_1.parse)(options.xml)['bpmn:definitions']);
    if ('path' in options)
        container_1.Container.addDefinition(id, (0, utils_1.parse)((0, utils_1.readFile)(options.path))['bpmn:definitions']);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    return function (constructor) {
        return class extends constructor {
            constructor() {
                super(...arguments);
                this.$__metadata__ = {
                    definition: { id },
                    process: Object.assign(Object.assign({}, ('id' in options ? { id: options.id } : {})), ('name' in options ? { name: options.name } : {})),
                };
            }
        };
    };
}
exports.Process = Process;
//# sourceMappingURL=process.js.map