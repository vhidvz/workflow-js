import { IdentityOptions } from '../common';
import { Context } from '../context';
import { BPMNDefinition, BPMNProcess } from '../type';
import { Execute } from './types';
export interface ExecutionInterface {
    id?: string;
    factory?: () => any;
    handler?: any;
    context?: Context;
    data?: any;
    value?: any;
    node?: IdentityOptions;
    xml?: string;
    path?: string;
    schema?: BPMNDefinition;
    exec?: Partial<Execute>;
}
export interface WorkflowOptions {
    cache: boolean;
}
export declare class WorkflowJS {
    protected target: any;
    protected context?: Context;
    protected process?: BPMNProcess;
    protected options?: WorkflowOptions;
    protected definition?: BPMNDefinition;
    static build(exec?: Partial<Execute> & {
        options?: WorkflowOptions;
    }): WorkflowJS;
    /**
     * It executes a workflow
     *
     * @param {ExecutionInterface} options - ExecutionInterface
     *
     * @returns The return value is an object with the following properties:
     */
    execute(options: ExecutionInterface): Execute;
}
