/**
 * ReadFile takes a string and returns a string
 *
 * @param {string} path - string - The path to the file you want to read.
 */
export declare const readFile: (path: string) => string;
/**
 * It takes an XML string and returns a BPMN schema
 *
 * @param {string} xml - string - the XML string to parse
 *
 * @returns A BPMNSchema object
 */
export declare const parse: (xml: string) => never;
/**
 * It returns a random string of 36 characters
 */
export declare const uid: () => string;
/**
 * It returns an object with three functions, each of which logs a message with a different color
 *
 * @param {string} namespace - This is the namespace of the logger.
 * @param [prefix=workflow-js] - This is the prefix that will be used for the debug module.
 *
 * @returns An object with three functions.
 */
export declare const logger: (namespace: string, prefix?: string) => {
    error: (formatter: string, ...args: unknown[]) => void;
    warn: (formatter: string, ...args: unknown[]) => void;
    info: (formatter: string, ...args: unknown[]) => void;
    debug: (formatter: string, ...args: unknown[]) => void;
};
