jest.mock('./post.js');
const { TestScheduler } = require('@jest/core');
const lib = require('./post.js');

const response = {
    data: [
        {uid: 3, uname: 'abby', uhook: '@abby', content: 'hello hello', imgs:['src1'], vids:['link1', 'link2']},
        {uid: 3, uname: 'babble', uhook: '@bbsteak', content: 'new to this platform', imgs:[], vids:[]}
    ]    
}

const userPosts = {
    uid: 13,
    uname: 'costco',
    uhook: 'costcoUS',
    data : [
        {content: 'enjoy savings on these products', imgs: [], vids: []},
        {content: 'check this little guy out', imgs: ['123.132.52.113:3303/doggy.png'], vids: ['cute-dogg-video.mp4']}
    ]
}

const confirmed = {
    status: 200,
    message: null
}

const created = {
    status: 201,
    message: null
}

lib.fetchFollowedPosts.mockResolvedValue(response)
lib.scrollFollowedPosts.mockResolvedValue(response)
lib.fetchPostsFromUser.mockResolvedValue(userPosts)
lib.commentOnPost.mockResolvedValue(confirmed)
lib.createPost.mockResolvedValue(created)
lib.deletePost.mockResolvedValue(confirmed)
lib.likePost.mockResolvedValue(confirmed)

describe( 'fetch and scroll will return correct items', ()=>{
    test('fetchFollowedPosts test', ()=>{
        lib.fetchFollowedPosts(1).then(
            (ret)=>{
                expect(ret.data[1].uname).toBe('babble');
                expect(ret.data[1].content).toBe('new to this platform');   
            }
        )
    })
    test('scrollFollowedPosts test', ()=>{
        lib.scrollFollowedPosts(1, 3).then((ret)=>{
            expect(ret.data[0].uhook).toBe('@abby');
            expect(ret.data[0].vids[0]).toBe('link1');
        })
    })
})

describe( 'fetchPostsFromUser test', ()=>{
    test('return value correctness', ()=>{
        lib.fetchPostsFromUser(1, 13).then(
            (ret)=>{
                expect(ret.data[1].vids[0]).toBe('cute-dogg-video.mp4');
                expect(ret.uname).toBe('costco');   
            }
        )
    })
})

describe( 'commentOnPost test', ()=>{
    test('return value correctness', ()=>{
        lib.commentOnPost(1, 2201, "I like your hairstyle").then(
            (ret)=>{
                expect(ret.status).toBe(200);   
            }
        )
    })
})

describe( 'createPost test', ()=>{
    test('createPost success', ()=>{
        lib.createPost(2, "I like your hairstyle").then(
            (ret)=>{
                expect(ret.status).toBe(201);   
            }
        )
    })
})

describe( 'likePost test', ()=>{
    test('return liked success', ()=>{
        lib.likePost(2, 2201, true).then(
            (ret)=>{
                expect(ret.status).toBe(200);   
            }
        )
    })
})


describe( 'deletePost test', ()=>{
    test('deletePost success', ()=>{
        lib.deletePost(2).then(
            (ret)=>{
                expect(ret.status).toBe(200);   
            }
        )
    })
})

