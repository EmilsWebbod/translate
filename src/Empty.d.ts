import Branch, { Translations } from './Branch.js';
import Tree from './Tree.js';
import ApiBranch from './ApiBranch.js';
export default class Empty extends ApiBranch {
    branch: Branch | Tree;
    isTreeText: boolean;
    apiID: string;
    constructor(branch: Branch | Tree, word: string, isTreeText?: boolean);
    translate(_: string): string;
    add(translations?: Translations): void;
    suggestions(): Branch[];
}
//# sourceMappingURL=Empty.d.ts.map