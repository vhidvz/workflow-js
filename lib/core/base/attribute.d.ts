import { BPMNProcess } from '../../type';
export declare class Attribute {
    protected process: BPMNProcess;
    $: {
        id: string;
        name?: string;
    };
    constructor(process: BPMNProcess, data?: Partial<Attribute>);
    /**
     * The function returns the value of the id property of the object that is stored in the $ property
     * of the current object
     *
     * @returns The id property of the object.
     */
    get id(): string;
    /**
     * The function returns the value of the name property of the object that is stored in the $ property
     * of the current object
     *
     * @returns The name property of the object.
     */
    get name(): string | undefined;
}
