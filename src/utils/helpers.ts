import Branch from '../Branch';

export const VARIABLE_REGEXP = /{{(.*?)}}/g;

export function getWord(level: number, word: string, sentence = false) {
  if (sentence) {
    return word
      .split(' ')
      .slice(0, level + 1)
      .join(' ');
  }
  return word.slice(0, level + 1);
}

export function suggestions(this: Branch) {
  return this.isWord
    ? [this as Branch, ...this.map(x => x.suggestions())]
    : this.map(x => x.suggestions()).flat();
}

export function getFirst(word: string, isText = false) {
  if (isText) {
    return word.split(' ')[0].toLocaleLowerCase();
  }
  return word[0];
}

export const arrayToObject = <T extends object>(obj: T, item: T) => ({
  ...obj,
  ...item
});
