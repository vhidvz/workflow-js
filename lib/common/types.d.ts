import { BPMNDefinition } from '../type';
export type ProcessOptions = {
    xml: string;
} | {
    path: string;
} | {
    schema: BPMNDefinition;
};
export type IdentityOptions = {
    id: string;
} | {
    name: string;
};
export type Metadata = {
    process: IdentityOptions;
    definition: {
        id: string;
    };
};
