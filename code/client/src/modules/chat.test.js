jest.mock('./chat.js');
const lib = require('./chat.js');

lib.fetchChats.mockResolvedValue({
    data: [
        {cid: 12, userName:'Jerome'},
        {cid: 45, userName:'Todd'},
    ]
})
describe('fetchChats return value test',() => {
    test('return value is correct', () => {
        lib.fetchChats(1).then(
            (ret) => {
                expect(ret.data[0].cid).toBe(12);
                expect(ret.data[1].userName).toBe('Todd');
            }
        )
    });
})
lib.fetchChatWithUser.mockResolvedValue({
    data: [
        {time: 1000,
        from: 'other',
        message:'hello'},
        {time: 2004,
        from: 'you',
        message: 'whats up Todd'},
        {time: 3005,
        from: 'other',
        message: 'long time no see'}
    ]
})
describe('fetchChatWithUser return value test', () => {
    test('return value is correct', () => {
        lib.fetchChatWithUser(1, 45).then(
            (ret) => {
                expect(ret.data[0].time).toBe(1000);
                expect(ret.data[1].from).toBe('you');
                expect(ret.data[2].message).toBe('long time no see');
            }
        )
    })
})

lib.fetchSendChat.mockResolvedValue({status: 200, message: null});
describe('verify fetchSendChat returns ok', () => {
    test('return ok', () => {
        lib.fetchSendChat(1, 45, 'yes my friend').then(
            (ret) => {
                expect(ret.status).toBe(200);
                expect(ret.message).toBeNull();
            }
        )
    })
})
