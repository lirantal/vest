const faker = require('faker');
const { ERROR_HOOK_CALLED_OUTSIDE } = require('../constants');
const { isExcluded } = require('.');

const runSpec = (vest) => {

    const { validate, only, skip } = vest;

    describe('exclusive hooks', () => {
        let field1, field2, field3;

        describe('`only` hook', () => {

            beforeEach(() => {
                field1 = faker.lorem.word();
                field2 = faker.lorem.word();
                field3 = faker.lorem.word();
            });

            describe('string input', () => {
                test('isExcluded returns false for included field', () => {
                    validate(faker.lorem.word(), () => {
                        only(field1);

                        expect(isExcluded(field1)).toBe(false);
                    });
                });

                test('isExcluded returns true for non included field', () => {
                    validate(faker.lorem.word(), () => {
                        expect(isExcluded(field2)).toBe(false);
                        only(field1);
                        expect(isExcluded(field2)).toBe(true);
                    });
                });
            });

            describe('array input', () => {
                test('isExcluded returns false for included field', () => {
                    validate(faker.lorem.word(), () => {
                        only([field1, field2]);

                        expect(isExcluded(field1)).toBe(false);
                        expect(isExcluded(field2)).toBe(false);
                    });
                });

                test('isExcluded returns true for non included field', () => {
                    validate(faker.lorem.word(), () => {
                        expect(isExcluded(field3)).toBe(false);
                        only([field1, field2]);
                        expect(isExcluded(field3)).toBe(true);
                    });
                });
            });
        });

        describe('`skip` hook', () => {

            beforeEach(() => {
                field1 = faker.lorem.word();
                field2 = faker.lorem.word();
                field3 = faker.lorem.word();
            });

            describe('string input', () => {
                test('isExcluded returns true for excluded field', () => {
                    validate(faker.lorem.word(), () => {
                        skip(field1);

                        expect(isExcluded(field1)).toBe(true);
                    });
                });

                test('isExcluded returns true for non excluded field', () => {
                    validate(faker.lorem.word(), () => {
                        skip(field1);
                        expect(isExcluded(field2)).toBe(false);
                    });
                });
            });

            describe('array input', () => {
                test('isExcluded returns true for excluded field', () => {
                    validate(faker.lorem.word(), () => {
                        skip([field1, field2]);

                        expect(isExcluded(field1)).toBe(true);
                        expect(isExcluded(field2)).toBe(true);
                    });
                });

                test('isExcluded returns false for non included field', () => {
                    validate(faker.lorem.word(), () => {
                        skip([field1, field2]);
                        expect(isExcluded(field3)).toBe(false);
                    });
                });
            });
        });

        describe('Error handling', () => {
            let mockThrowError, hooks;

            beforeEach(() => {
                mockThrowError = jest.fn();
                jest.resetModules();
                jest.mock('../../lib/throwError/', () => ({
                    __esModule: true,
                    default: mockThrowError
                }));
                hooks = require('.');
            });

            describe.each([['only', 'skip']])('%s', (hook) => {
                describe('When called outside of a suite', () => {
                    it('Should throw an error', () => {
                        hooks[hook](faker.random.word());
                        expect(mockThrowError.mock.calls[0][0].includes(ERROR_HOOK_CALLED_OUTSIDE)).toBe(true);
                    });
                });
            });
        });
    });
};


global.vestDistVersions
    .concat(require('../../'))
    .forEach(runSpec);
