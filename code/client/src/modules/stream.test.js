jest.mock('./stream.js');
const streaming = require('./stream.js');

streaming.fetchCreateStream.mockResolvedValue({_id: 200, usersIds: [], title:'Hello' });

describe('Confirm New Stream', () => {
  test('Id is 200', () => streaming.fetchCreateStream().then((res) => expect(res._id).toBe(200)));

  test('Response contains correct title', () => streaming.fetchCreateStream().then((res) => expect(res.title).toEqual('Hello')));
});
