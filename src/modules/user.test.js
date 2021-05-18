jest.mock('./user.js');
const lib = require('./user.js');

lib.fetchUserProfile.mockResolvedValue({data: {uid: 1, handle: 'elonmusk', displayName: 'Elon Musk', displayPic: 'imgurl', follows: [2, 3, 5]} });
describe('the url returned a User Profile', () => {
  test('the url for user profile is for Elon Musk', () => lib.fetchUserProfile(1).then((data) => expect(data.data.handle).toBe('elonmusk')));

  test('the url for Elon Musks profile shows that he follows 3 users', () => lib.fetchUserProfile(1).then((data) => expect(data.data.follows.length).toBe(3)));
});

lib.fetchFollowUser.mockResolvedValue({status: 200, message: null });
lib.fetchUnfollowUser.mockResolvedValue({status: 200, message: null })
describe('Following and unfollowing a user', () => {
  test('Status code is 200', () => lib.fetchFollowUser(1, 2).then((res) => expect(res.status).toBe(200)));

  test('Status code is 200', () => lib.fetchUnfollowUser(1, 2).then((res) => expect(res.status).toBe(200)));
});

lib.fetchFollowed.mockResolvedValue({data: [{uid: 1, handle: 'elonmusk', displayName: 'Elon Musk'}, {uid: 2, handle: 'tesla', displayName: 'Tesla'}] });
describe('the url returned a list of contacts', () => {
  test('the url for contacts list contains Elon Musk', () => lib.fetchFollowed(0).then((data) => expect(data.data[0].handle).toBe('elonmusk')));

  test('the url for contacts list contains id 2', () => lib.fetchFollowed(0).then((data) => expect(data.data[1].uid).toBe(2)));
});

lib.fetchChat.mockResolvedValue({cid: 123, memberIds: {'you': 1, 'other': 3}});
lib.fetchCall.mockResolvedValue({hostId: 1, memberIds:[3]})
describe('fetchChat test', ()=>{
  test('return value', ()=>{
    lib.fetchChat(1, 3).then((data)=>{
      expect(data.cid).toBe(123);
      expect(data.memberIds.other).toBe(3);
    })
  })
});
describe('fetchCall test', ()=>{
  test('return value', ()=>{
    lib.fetchCall(1, 3).then((data)=>{
      expect(data.hostId).toBe(1);
      expect(data.memberIds[0]).toBe(3);
    })
  })
})