exports.commaFormat = function(digitsString) {
  let invertedDigitsSets = [];
  let digitsSets = [];

  for (let i = digitsString.length - 1; i > -1; i -= 3) {
    if (i === 0) {
      invertedDigitsSets.push(digitsString[0]);
    } else if (i === 1) {
      invertedDigitsSets.push(digitsString[0] + digitsString[1]);
    } else {
      invertedDigitsSets.push(digitsString[i - 2] + digitsString[i - 1] + digitsString[i]);
    }
  }

  for (let i = 0; i < invertedDigitsSets.length; i++) {
    digitsSets[i] = invertedDigitsSets[invertedDigitsSets.length - i - 1];
  }

  return digitsSets.toString();
}
