const expect = require('chai').expect;

const errorsTemplateByType = {
  string: 'too {too}, expect {expect}, got {got}',
  number: 'too {too}, expect {expect}, got {got}',
  type: 'expect {expect}, got {got}',
};

const relationErrorTypeByRange = {
  string: {
    short: 'min',
    long: 'max',
  },
  number: {
    little: 'min',
    big: 'max',
  }
};

function getTooByErrorType(errorExpected) {
  return errorExpected.type !== 'type'
    ? { too: errorExpected.type }
    : null;
}

function getExpectByErrorType(errorExpected, rulesOfValidator, typeofChecked) {
  const {
    field: fieldError,
    type: typeError,
  } = errorExpected;

  const typeOfRule = rulesOfValidator[fieldError].type;

  let expect;

  switch (typeofChecked) {
    case 'type':
      expect = typeOfRule;
      break;

    case 'number':
    case 'string':
      const rangeType = relationErrorTypeByRange[typeOfRule][typeError];
      expect = rulesOfValidator[fieldError][rangeType];
      break;

    default:
      return null;
  }

  return { expect };
}


function getGotByErrorType(errorExpected, inputValue, typeofChecked) {
  const {
    field: fieldError,
  } = errorExpected;

  let got;

  switch (typeofChecked) {
    case 'type':
      got = typeof inputValue[fieldError];
      break;

    case 'number':
      got = inputValue[fieldError];
      break;

    case 'string':
      got = inputValue[fieldError].length;
      break;

    default:
      return null;
  }

  return { got };
}

function getErrorMessage(template, data) {
  const pattern = /{\s*(\w+?)\s*}/g; // {property}
  return template.replace(pattern, (_, token) => data[token] || '');
}

function testValidator(checkedObjects, Validator) {
  checkedObjects.forEach(checked => {
    const {
      rulesOfValidator,
      inputValue,
      errorsExpected
    } = checked;

    const validator = new Validator(rulesOfValidator);
    const errors = validator.validate(inputValue);

    expect(errors).to.have.length(errorsExpected.length);

    for (let index = 0; index < errorsExpected.length; index++) {
      const errorExpected = errorsExpected[index];

      const typeofChecked = errorExpected.type !== 'type'
        ? rulesOfValidator[errorExpected.field].type
        : errorExpected.type;

      const expectErrorParams = {
        ...getTooByErrorType(errorExpected),
        ...getExpectByErrorType(errorExpected, rulesOfValidator, typeofChecked),
        ...getGotByErrorType(errorExpected, inputValue, typeofChecked),
      };

      expect(errors[index])
        .to.have.property('field')
        .and.to.be.equal(errorExpected.field);

      expect(errors[index])
        .to.have.property('error')
        .and.to.be.equal(
          getErrorMessage(
            errorsTemplateByType[typeofChecked],
            expectErrorParams
          )
        );
    }
  });
}

module.exports = testValidator;
