import { BPMNActivity, BPMNDefinition } from '../type';
import { IdentityOptions } from '../common';
export interface DefinitionContainer {
    [id: string]: BPMNDefinition;
}
export interface ActivityContainer {
    [id: string]: {
        [id: string]: {
            activity: BPMNActivity;
            key: string;
        };
    };
}
export declare class Container {
    private static activities;
    private static definitions;
    /**
     * It adds an activity to the activities object
     *
     * @param {string} id - string - The id of the process
     * @param activity - activity: BPMNActivity; key: string
     */
    static addActivity(id: string, activity: {
        activity: BPMNActivity;
        key: string;
    }): void;
    /**
     * If the identity object has an id property, return the activity with that id, otherwise if it has a
     * name property, return the activity with that name
     *
     * @param {string} id - The ID of the activity.
     * @param {IdentityOptions} identity - IdentityOptions
     *
     * @returns The activity of the user with the given identity.
     */
    static getActivity(id: string, identity: IdentityOptions): {
        activity: BPMNActivity;
        key: string;
    } | undefined;
    /**
     * It deletes an activity from the activities object
     *
     * @param {string} id - The ID of the activity.
     * @param {IdentityOptions} identity - IdentityOptions
     */
    static delActivity(id: string, identity: IdentityOptions): void;
    /**
     * It adds a new BPMN definition to the definitions object
     *
     * @param {string} id - The id of the BPMN definition.
     * @param {BPMNDefinition} definition - BPMNDefinition
     */
    static addDefinition(id: string, definition: BPMNDefinition): void;
    /**
     * It returns the definition of the given id
     *
     * @param {string} id - The id of the definition to get.
     *
     * @returns The definition of the id.
     */
    static getDefinition(id: string): BPMNDefinition;
    /**
     * It deletes the definition of the given id from the definitions object
     *
     * @param {string} id - The id of the definition.
     */
    static delDefinition(id: string): void;
}
