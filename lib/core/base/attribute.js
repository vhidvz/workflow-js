"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attribute = void 0;
/* The Attribute class is a base class for all classes that represent an attribute of a BPMN element */
class Attribute {
    constructor(process, data) {
        if (data)
            Object.assign(this, data);
        this.process = process;
    }
    /**
     * The function returns the value of the id property of the object that is stored in the $ property
     * of the current object
     *
     * @returns The id property of the object.
     */
    get id() {
        return this.$.id;
    }
    /**
     * The function returns the value of the name property of the object that is stored in the $ property
     * of the current object
     *
     * @returns The name property of the object.
     */
    get name() {
        return this.$.name;
    }
}
exports.Attribute = Attribute;
//# sourceMappingURL=attribute.js.map