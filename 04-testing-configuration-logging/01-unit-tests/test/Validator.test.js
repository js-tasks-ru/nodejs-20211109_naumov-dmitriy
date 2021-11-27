const Validator = require('../Validator');
const expect = require('chai').expect;
const testValidator = require('./utils/Validator');

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('тест всех типов ошибок для числовых полей', () => {
      const checkedObjects = [
        {
          rulesOfValidator: {
            age: {
              type: 'number',
              min: 18,
              max: 27,
            },
            weight: {
              type: 'number',
              min: 15,
              max: 80,
            },
            height: {
              type: 'number',
              min: 120,
              max: 200,
            },
          },
          inputValue: {
            age: 15,
            weight: 81,
            height: '150',
          },
          errorsExpected: [
            {
              field: 'age',
              type: 'little',
            },
            {
              field: 'weight',
              type: 'big',
            },
            {
              field: 'height',
              type: 'type',
            },
          ],
        },
      ];
    
      testValidator(checkedObjects, Validator);
    });

    it('тест всех типов ошибок для строковых полей', () => {
      const checkedObjects = [
        {
          rulesOfValidator: {
            name: {
              type: 'string',
              min: 5,
              max: 10,
            },
            surname: {
              type: 'string',
              min: 5,
              max: 10,
            },
            patronymic: {
              type: 'string',
              min: 5,
              max: 10,
            }
          },
          inputValue: {
            name: 'lala',
            surname: 'lalalalalala',
            patronymic: 5,
          },
          errorsExpected: [
            {
              field: 'name',
              type: 'short',
            },
            {
              field: 'surname',
              type: 'long',
            },
            {
              field: 'patronymic',
              type: 'type',
            },
          ],
        },
      ];

      testValidator(checkedObjects, Validator);
    });

    it('тест ошибок по количеству и типам', () => {
      const checkedObjects = [
        {
          rulesOfValidator: {
            name: {
              type: 'string',
              min: 5,
              max: 10,
            },
            surname: {
              type: 'string',
              min: 5,
              max: 10,
            },
            patronymic: {
              type: 'string',
              min: 5,
              max: 10,
            },
            city: {
              type: 'string',
              min: 3,
              max: 15,
            },
            age: {
              type: 'number',
              min: 18,
              max: 27,
            },
            weight: {
              type: 'number',
              min: 15,
              max: 80,
            },
            height: {
              type: 'number',
              min: 120,
              max: 200,
            },
            children: {
              type: 'number',
              min: 0,
              max: 5,
            }
          },
          inputValue: {
            name: 'lalalala',
            surname: 'lala',
            patronymic: 'lalalalalala',
            city: 1,
            age: 20,
            weight: 10,
            height: 210,
            children: '3',
          },
          errorsExpected: [
            {
              field: 'surname',
              type: 'short',
            },
            {
              field: 'patronymic',
              type: 'long',
            },
            {
              field: 'city',
              type: 'type',
            },
            {
              field: 'weight',
              type: 'little',
            },
            {
              field: 'height',
              type: 'big',
            },
            {
              field: 'children',
              type: 'type',
            }
          ],
        },
      ];

      testValidator(checkedObjects, Validator);
    });

    it('тест на отсутствие ошибок', () => {
      const checkedObjects = [
        {
          rulesOfValidator: {
            name: {
              type: 'string',
              min: 5,
              max: 10,
            },
            surname: {
              type: 'string',
              min: 5,
              max: 10,
            },
            patronymic: {
              type: 'string',
              min: 5,
              max: 10,
            },
            age: {
              type: 'number',
              min: 18,
              max: 27,
            },
            weight: {
              type: 'number',
              min: 15,
              max: 80,
            },
            height: {
              type: 'number',
              min: 120,
              max: 200,
            },
          },
          inputValue: {
            name: 'lalal',
            surname: 'lalalalala',
            patronymic: 'lalalala',
            age: 18,
            weight: 80,
            height: 160,
          },
          errorsExpected: [],
        },
      ];

      testValidator(checkedObjects, Validator);
    });

  });
});