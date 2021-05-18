import host from '../host-config';
const fetch = require('node-fetch');

const getPostOptions = (params) => {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(params)
    }
}

async function fetchFollowedPosts(currId) {
    // Gets the page 1 of the stream of followed posts
    const uri = `${host}/api/post`;
    try {
        const response = await fetch(uri, { credentials: 'include' });
        return response.json();
    } catch (err) {
        alert(`Error: ${err}`);
    }
}

async function fetchOnePost(pid) {
    const uri = `${host}/api/post/p/${pid}`;
    try {
        const response = await fetch(uri, { credentials: 'include' });
        return response.json();
    } catch (err) {
        console.error(err);
    }
}
async function likePost(pid, like) {
    const uri = `${host}/api/post/like/${pid}`;
    const params = {
        like: like
    }
    try {
        const res = await fetch(uri, getPostOptions(params));
        return res.text();
    } catch (err) {
        alert(`Error: ${err}`);
    }
}

async function createPost(body) {
    const uri = `${host}/api/post/new`;
    const params = {
        content: body.content,
        imgs: body.imgs,
        audios: body.audios,
        tags: body.tags,
        mentions: body.mentions
    }
    try {
        const res = await fetch(uri, getPostOptions(params));
        return res.text();
    } catch (err) {
        alert(`Error: ${err}`);
    }
}

async function fetchPostsFromUser(uid) {
    const uri = `${host}/api/post/${uid}`;
    try {
        const res = await fetch(uri);
        return res.json();
    } catch (err) {
        console.error(err);
    }
}

async function fetchPostsHashtags(tag) {
    const uri = `${host}/api/post/find/tag/${tag}`;
    try {
        const res = await fetch(uri);
        return res.json();
    } catch (err) {
        alert(`Error: ${err}`);
    }
}

async function fetchPostsMentions(handle) {
    const uri = `${host}/api/post/find/mention/${handle}`;
    console.log('Getting uri', uri)
    try {
        const res = await fetch(uri);
        return res.json();
    } catch (err) {
        alert(`Error: ${err}`);
    }
}

// UNTESTED BELOW


async function scrollFollowedPosts(currId, pageNum) {
    // Gets the page 1 of the stream of followed posts
    const uri = `/api/post/followed/${currId}/${pageNum}`;
    try {
        const response = await fetch(uri);
        return response.json();
    } catch (err) {
        alert(`Error: ${err}`);
    }
}

async function commentOnPost(pid, comment, tags, mentions) {
    const uri = `${host}/api/post/cm/${pid}`;
    console.log(comment);
    const params = {
        content: comment,
        tags: tags,
        mentions: mentions
    }
    try {
        const res = await fetch(uri, getPostOptions(params));
        return res.text();
    } catch (err) {
        alert(`Error: ${err}`);
    }
}

async function deletePost(pid) {
    const uri = `${host}/api/post/${pid}/del`;
    const params = {
        _id: pid,
    };

    try {
        const res = await fetch(uri, getPostOptions(params));
        return res.text();
    } catch (err) {
        alert(`Error: ${err}`);
    }
}
async function deleteComment(cmid) {
    const uri = `${host}/api/post/cm/del/${cmid}`;
    const params = {
    };

    try {
        const res = await fetch(uri, getPostOptions(params));
        return res.text();
    } catch (err) {
        alert(`Error: ${err}`);
    }
}

async function updateComment(cmid, content) {
    const uri = `${host}/api/post/cm/update/${cmid}`;
    const params = {
        content: content
    };
    try {
        const res = await fetch(uri, getPostOptions(params));
        return res.text();
    } catch (err) {
        alert(`Error: ${err}`);
    }
}

async function fetchFollowedPostsPage(currId, pageNum) {
    // Gets the page 1 of the stream of followed posts
    const uri = `${host}/api/post/paged/${pageNum}`;
    try {
        const response = await fetch(uri, { credentials: 'include' });
        return response.json();
    } catch (err) {
        console.error(err);
    }
}

async function fetchHidePost(currId, pid) {
    const uri = `${host}/api/post/hide/${pid}`;
    const params = {
        from: currId
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    }
    try {
        const res = await fetch(uri, options);
        return res.json();
    } catch (err) {
        alert(`Error: ${err}`);
    }
}


async function fetchCommentsHashtags(tag) {
    const uri = `${host}/api/comments/find/tag/${tag}`;
    try {
        const res = await fetch(uri);
        return res.json();
    } catch (err) {
        alert(`Error: ${err}`);
    }
}

async function fetchCommentsMentions(handle) {
    const uri = `${host}/api/comments/find/mention/${handle}`;
    console.log('Getting uri', uri)
    try {
        const res = await fetch(uri);
        return res.json();
    } catch (err) {
        alert(`Error: ${err}`);
    }
}

export{ scrollFollowedPosts, fetchOnePost, fetchPostsFromUser,
  commentOnPost, createPost, deletePost, likePost,
  fetchPostsHashtags, fetchPostsMentions, fetchFollowedPostsPage, fetchHidePost,
  fetchCommentsHashtags, fetchCommentsMentions, deleteComment,
    updateComment }
