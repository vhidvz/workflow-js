import { BPMNDefinition, BPMNProcess } from '../../type';
import { Context } from '../../context';
export type Execute<D = any> = {
    target: any;
    context: Context<D>;
    process: BPMNProcess;
    definition: BPMNDefinition;
};
