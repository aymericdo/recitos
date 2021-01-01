export const addCapitalize = (value, event) => {
  const selectionStart = event.target.selectionStart;

  const array = value.split(' ');
  let index = -1;

  if (selectionStart < value.length) {
    let cpt = 0;
    array.every((val, i) => {
      if (selectionStart < cpt) {
        index = i;
        return false;
      } else {
        cpt += val.length + 1;
        return true;
      }
    });

    setTimeout(() => {
      event.target.selectionStart = event.target.selectionEnd = selectionStart;
    }, 10);
  }

  if (index === -1) {
    index = array.length
  }

  const splittedByEnter = array[index - 2].split('\n');

  if (splittedByEnter.length > 1) {
    const newLastWord = capitalize(splittedByEnter[splittedByEnter.length - 1])
    splittedByEnter.splice(splittedByEnter.length - 1, 1, newLastWord);
    const splittedStuff = splittedByEnter.join('\n');
    array.splice(index - 2, 1, splittedStuff);

    return array.join(' ');
  } else {
    const newLastWord = capitalize(array[index - 2]);

    const cloneArray = [...array];
    cloneArray.splice(index - 2, 1, newLastWord);
    
    if (index === 2 || endOfSentenceSymbole(cloneArray[index - 3].charAt(cloneArray[index - 3].length - 1))) {
      return cloneArray.join(' ');
    } else {
      return array.join(' ');
    }
  }
}

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const endOfSentenceSymbole = (char) => {
  return ['.', '!', '?', '...', '\n'].includes(char);
}