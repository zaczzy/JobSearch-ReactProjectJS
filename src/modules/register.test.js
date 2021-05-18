jest.mock('./register.js');
const register = require('./register.js');
let email = "keithjohnathan@gmail.com";
let password = "myPassword123";
register.createUser.mockResolvedValue({status: 200, data: {id: 293} });

describe('Confirm Create User', () => {
  test('Status code is 200', () => register.createUser(email, password).then((res) => expect(res.status).toBe(200)));
  test('Response contains user ID', () => register.createUser().then((res) => expect(res.data.id).toBe(293)));
});
