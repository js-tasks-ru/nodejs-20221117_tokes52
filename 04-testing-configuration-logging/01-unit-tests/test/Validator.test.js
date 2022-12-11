const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    const stringLimit = {
      min: 10,
      max: 20,
    };

    const numLimit = {
      min: 18,
      max: 27,
    };

    const validString = 'WwAw@!;.lksj/';
    const validNumbers = [23, numLimit.min, numLimit.max];

    it('валидатор проверяет строковые поля на длину строки', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: stringLimit.min,
          max: stringLimit.max,
        },
        surname: {
          type: 'string',
          min: stringLimit.min,
          max: stringLimit.max,
        },
      });

      const minString = 'Lalala';
      const minErrors = validator.validate({name: minString, surname: validString});
      expect(minErrors).to.have.length(1);
      expect(minErrors[0]).to.have.property('field').and.to.be.equal('name');
      expect(minErrors[0]).to.have.property('error')
          .and.to.be.equal(`too short, expect ${stringLimit.min}, got ${minString.length}`);

      const maxString = 'LalalaLalalaLalalaLalala';
      const maxErrors = validator.validate({name: maxString, surname: minString});
      expect(maxErrors).to.have.length(2);
      expect(maxErrors[0]).to.have.property('field').and.to.be.equal('name');
      expect(maxErrors[0]).to.have.property('error')
          .and.to.be.equal(`too long, expect ${stringLimit.max}, got ${maxString.length}`);
      expect(maxErrors[1]).to.have.property('field').and.to.be.equal('surname');
      expect(maxErrors[1]).to.have.property('error')
          .and.to.be.equal(`too short, expect ${stringLimit.min}, got ${minString.length}`);

      const validErrors = validator.validate({name: validString, surname: validString});
      expect(validErrors).to.have.length(0);
    });

    it('валидатор проверяет числовые значения на мин и макс', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: numLimit.min,
          max: numLimit.max,
        },
        amount: {
          type: 'number',
          min: numLimit.min,
          max: numLimit.max,
        },
      });

      const minNumber = 10;
      const minErrors = validator.validate({age: minNumber, amount: validNumbers[0]});
      expect(minErrors).to.have.length(1);
      expect(minErrors[0]).to.have.property('field').and.to.be.equal('age');
      expect(minErrors[0]).to.have.property('error')
          .and.to.be.equal(`too little, expect ${numLimit.min}, got ${minNumber}`);

      const maxNumber = 29;
      const maxErrors = validator.validate({age: maxNumber, amount: validNumbers[0]});
      expect(maxErrors).to.have.length(1);
      expect(maxErrors[0]).to.have.property('field').and.to.be.equal('age');
      expect(maxErrors[0]).to.have.property('error')
          .and.to.be.equal(`too big, expect ${numLimit.max}, got ${maxNumber}`);

      validNumbers.forEach((validNumber) => {
        const validErrors = validator.validate({age: validNumber, amount: validNumbers[0]});
        expect(validErrors).to.have.length(0);
      });
    });

    it('валидатор проверяет тип данных', () => {
      const schema = {
        age: {
          type: 'number',
          min: numLimit.min,
          max: numLimit.max,
        },
        name: {
          type: 'string',
          min: stringLimit.min,
          max: stringLimit.max,
        },
      };

      const validator = new Validator(schema);

      const errorObj = {age: new Array(stringLimit.min - 3).fill('@'), name: numLimit.min - 5};
      const typeErrors = validator.validate(errorObj);
      expect(typeErrors).to.have.length(1);
      expect(typeErrors[0]).to.have.property('field').and.to.be.equal('age');
      expect(typeErrors[0]).to.have.property('error')
          .and.to.be.equal(`expect ${schema.age.type}, got ${typeof errorObj.age}`);
    });
  });
});
