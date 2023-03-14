"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const utils_1 = require("../utils");
const log = (0, utils_1.logger)('container');
/* It's a container for BPMN definitions and activities */
class Container {
    /**
     * It adds an activity to the activities object
     *
     * @param {string} id - string - The id of the process
     * @param activity - activity: BPMNActivity; key: string
     */
    static addActivity(id, activity) {
        var _a;
        Container.activities[id] = (_a = Container.activities[id]) !== null && _a !== void 0 ? _a : {};
        const $ = activity.activity.$;
        Container.activities[id][$.id] = activity;
        if ($.name)
            Container.activities[id][$.name] = activity;
        log.info(`Process ${id} activity ${$.id} added to the container`);
    }
    /**
     * If the identity object has an id property, return the activity with that id, otherwise if it has a
     * name property, return the activity with that name
     *
     * @param {string} id - The ID of the activity.
     * @param {IdentityOptions} identity - IdentityOptions
     *
     * @returns The activity of the user with the given identity.
     */
    static getActivity(id, identity) {
        var _a, _b;
        if ('id' in identity)
            return ((_a = Container.activities[id]) !== null && _a !== void 0 ? _a : {})[identity.id];
        else if ('name' in identity)
            return ((_b = Container.activities[id]) !== null && _b !== void 0 ? _b : {})[identity.name];
    }
    /**
     * It deletes an activity from the activities object
     *
     * @param {string} id - The ID of the activity.
     * @param {IdentityOptions} identity - IdentityOptions
     */
    static delActivity(id, identity) {
        var _a, _b;
        if ('id' in identity)
            delete ((_a = Container.activities[id]) !== null && _a !== void 0 ? _a : {})[identity.id];
        else if ('name' in identity)
            delete ((_b = Container.activities[id]) !== null && _b !== void 0 ? _b : {})[identity.name];
        log.info(`Process ${id} activity identity %o deleted from the container`, identity);
    }
    /**
     * It adds a new BPMN definition to the definitions object
     *
     * @param {string} id - The id of the BPMN definition.
     * @param {BPMNDefinition} definition - BPMNDefinition
     */
    static addDefinition(id, definition) {
        Container.definitions[id] = definition;
        log.info(`Definition ${id} added to the container`);
    }
    /**
     * It returns the definition of the given id
     *
     * @param {string} id - The id of the definition to get.
     *
     * @returns The definition of the id.
     */
    static getDefinition(id) {
        return Container.definitions[id];
    }
    /**
     * It deletes the definition of the given id from the definitions object
     *
     * @param {string} id - The id of the definition.
     */
    static delDefinition(id) {
        delete Container.definitions[id];
        log.info(`Definition ${id} deleted from the container`);
    }
}
exports.Container = Container;
Container.activities = {};
Container.definitions = {};
//# sourceMappingURL=container.js.map