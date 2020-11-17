export function generateRandomString(
    length, 
    letters: boolean = true,
    upperCase: boolean = true,
    numbers: boolean = true,
    symbols: boolean = true
  ) {
    let chars = '';
    chars += letters ? 'abcdefghijklmnopqrstuvwxyz' : '';
    chars += upperCase ? 'abcdefghijklmnopqrstuvwxyz'.toUpperCase() : '';
    chars += numbers ? '0123456789' : '';
    chars += symbols ? '!#$%&()' : '';
  
    return [...Array(length)].reduce((pre, cur) => {
        return pre + chars.charAt(Math.floor(Math.random() * chars.length))
    }, '');
  }
  
  export function generateId() {
    return generateRandomString(20, true, true, true, false);
  }