
let textBox = document.getElementById('postText');
let button = document.getElementById('postSubmit');
let replyBox = document.getElementById('replyText');
let replyButton = document.getElementById('submitReplyBtn');
let replyModal = document.getElementById('replyModal');
let deleteModal = document.getElementById('deletePostModal');
let deleteButton = document.getElementById('deletePostBtn');
let posts = Array.from(document.getElementsByClassName('post'));
const xhr = new XMLHttpRequest();

// Enable/Disable post button 
if (textBox) {
    textBox.addEventListener('keyup', (e) => {
        if (e.target.value.trim() != "") {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });
}

if (replyBox) {
    replyBox.addEventListener('keyup', (e) => {
        if (e.target.value.trim() != "") {
            replyButton.disabled = false;
        } else {
            replyButton.disabled = true;
        }
    });
}

//Delete Post Button
deleteModal.addEventListener('show.bs.modal', (e) => {
    let postButton = e.relatedTarget;
    let postId = getPostId(postButton);
    deleteButton.setAttribute('data-id', postId);

});

deleteButton.addEventListener('click', (e) => {
    let postId = e.target.dataset.id;

    xhr.open('DELETE', `/api/posts/${postId}`, true);
    xhr.onload = () => {
        location.reload();
    };
    xhr.send();

});

// Comment Button
replyModal.addEventListener('show.bs.modal', (e) => {
    let postButton = e.relatedTarget;
    let postId = getPostId(postButton);
    replyButton.setAttribute('data-id', postId);

    xhr.open('GET', '/api/posts/' + postId, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = () => {
            let parsedResponse = JSON.parse(xhr.responseText);
            let container = document.getElementById('modal-postContainer');
            outputPosts(parsedResponse.postData, container);
    };
    xhr.send();

});

replyModal.addEventListener('hidden.bs.modal', (e) => {
    document.getElementById('modal-postContainer').innerHTML = "";
});

// Like Button
function handleLikeButton(e) {
    let button = e.target;
    let postId = getPostId(button);
    
    if (!postId) return;

    xhr.open('PUT', `/api/posts/${postId}/like`, true);
    xhr.onload = () => {
        let post = JSON.parse(xhr.responseText);
        let likes = post.likes.length;
        let likeSpan = button.querySelector('.postLikes');
        likeSpan.innerText = likes || '';

        if (post.likes.includes(userLoggedIn._id)) {
            button.classList.add('activeLike');
        } else {
            button.classList.remove('activeLike');
        }

    };
    xhr.send();
};

// Repost Button
function handleRepostButton(e) {
    let button = e.target;
    let postId = getPostId(button);
    
    if (!postId) return;

    xhr.open('POST', `/api/posts/${postId}/repost`, true);
    xhr.onload = () => {
        let post = JSON.parse(xhr.responseText);
        let reposts = post.repostUsers.length;
        let repostSpan = button.querySelector('.postReposts');
        repostSpan.innerText = reposts || '';

        if (post.repostUsers.includes(userLoggedIn._id)) {
            button.classList.add('activeRepost');
        } else {
            button.classList.remove('activeRepost');
        }

    };
    xhr.send();
};

//Post ID
function getPostId(element) {
    let isRoot = element.classList.contains('post');
    let rootEl = isRoot ? element : element.closest('.post');
    let postId = rootEl.dataset.id;

    if (!postId) { return alert('No Post Id') }

    return postId;
};

//View Post
function handlePostClick(e) {
        let element = e.target;
        let postId = getPostId(element);
        
        if(!postId !== undefined && element.tagName !== "BUTTON") {
            window.location.href = '/post/' + postId;
        }

};

//Handle Posting and Reply
if (button) {
    button.addEventListener('click', () => {
        let dataObj = {
            content: textBox.value.trim()
        };
        let data = new URLSearchParams(Object.entries(dataObj)).toString();

        xhr.open('POST', '/api/posts', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                let parsedResponse = JSON.parse(xhr.responseText);
                let container = document.getElementById('postsContainer');
                let postHtml = createPostHtml(parsedResponse);
                let postElement = document.createElement('div');

                postElement.innerHTML = postHtml;

                container.prepend(postElement);
                textBox.value = '';
                button.disabled = true;
            }
        };
        xhr.send(data);

    });
}

if (replyButton) {
    replyButton.addEventListener('click', () => {
        let dataObj = {
            content: replyBox.value.trim(),
            replyTo: replyButton.dataset.id
        };
        let data = new URLSearchParams(Object.entries(dataObj)).toString();

        xhr.open('POST', '/api/posts', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {

                location.reload();

                /* Outputs post instead of hard reload
                let parsedResponse = JSON.parse(xhr.responseText);
                let container = document.getElementById('postsContainer');
                let postHtml = createPostHtml(parsedResponse);
                let postElement = document.createElement('div');

                postElement.innerHTML = postHtml;

                container.prepend(postElement);
                replyBox.value = '';
                replyButton.disabled = true; */
            }
        };
        xhr.send(data);

    });
}

function createPostHtml(postData, largeFont = false) {

    if(postData == null) return console.log('No post data');

    let postUser = postData.postedBy;
    let postTime = timeDifference(new Date(), new Date(postData.createdAt));
    let likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "activeLike" : "";
    let repostButtonActiveClass = postData.repostUsers.includes(userLoggedIn._id) ? "activeRepost" : "";
    let isRepost = postData.repostData != undefined;
    let repostedBy = isRepost ? postData.postedBy.username : null;
    let largeFontClass = largeFont ? "largeFont" : "";

    postData = isRepost ? postData.repostData : postData;

    let repostText = '';
    if (isRepost) {
        repostText = `
        <i class="fas fa-retweet"></i>
        <span>
            Reposted by <a href="/profile/${repostedBy}">@${repostedBy}</a>
        </span>`;
    }

    let replyFlag = '';
    if (postData.replyTo && postData.replyTo._id) {

        if (!postData.replyTo._id) {
            return alert('replyTo not populated');
        } else if (!postData.replyTo.postedBy._id) {
            return alert('postedBy not populated');
        }

        let replyToUsername = postData.replyTo.postedBy.username;

        replyFlag = `
        <div class="replyFlag">
            Replying to <a href="/profile/${replyToUsername}">@${replyToUsername}</a>
        </div>
        `;
    }

    let userButtons = "";
    if (postData.postedBy._id == userLoggedIn._id) {
        userButtons = `<button class="userButtons" data-id="${postData._id}" data-bs-toggle="modal" data-bs-target="#deletePostModal"><i class="far fa-trash-alt"></i></button>`
    }

    return `
        <div class="post ${largeFontClass}" data-id="${postData._id}" onclick="handlePostClick(event)">
            <div class="repostedBy">
                ${repostText}
            </div>
            <div class="postMainContainer">
                <div class="userImageWrap">
                    <img src="${postUser.profilePic}">
                </div>
                <div class="postContent">
                    <div class="postHeader">
                        <a href="/profile/${postUser.username}">${postUser.username}</a>
                        <span class="postDate">${postTime}</span>
                        ${userButtons}
                    </div>
                    ${replyFlag}
                    <div class="postBody">
                        <span>${postData.content}</span>
                    </div>
                    <div class="postFooter">
                        <div class="postButtonWrap">
                        <button data-bs-toggle="modal" data-bs-target="#replyModal">
                            <i class="far fa-comment"></i>
                        </button>
                        </div>
                        <div class="postButtonWrap">
                        <button onclick=handleRepostButton(event) class=${repostButtonActiveClass}>
                            <i class="fas fa-retweet"></i>
                            <span class="postReposts">${postData.repostUsers.length || ''}</span>
                        </button>
                        </div>
                        <div class="postButtonWrap">
                        <button onclick=handleLikeButton(event) class=${likeButtonActiveClass}>
                            <i class="far fa-heart"></i>
                            <span class="postLikes">${postData.likes.length || ''}</span>
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

function outputPosts(results, container) {
    container.innerHTML = "";
    
    results.forEach(result => {
        let post = document.createElement('div');
        let postHtml = createPostHtml(result);
        post.innerHTML = postHtml;
        container.appendChild(post);
    });

    if (results.length == 0) {
        container.innerHTML = `
        <div class="msgWrap">
            <span class="noPostsMsg">Nothing to show</span>
        </div>
        `;
    }
};

function outputPostsIncludeReplies(results, container) {
    container.innerHTML = "";
    
    if (results.replyTo && results.replyTo._id !== undefined) {
        let post = document.createElement('div');
        let postHtml = createPostHtml(results.replyTo);
        post.innerHTML = postHtml;
        container.appendChild(post);
    }

    let originalPostHtml = createPostHtml(results.postData, true);
    let post = document.createElement('div');
    post.innerHTML = originalPostHtml;
    container.appendChild(post);

    results.replies.forEach(result => {
        let post = document.createElement('div');
        let postHtml = createPostHtml(result);
        post.innerHTML = postHtml;
        container.appendChild(post);
    });

}

// Relative Timestamp
function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return 'Just Now';   
    }

    else if (elapsed < msPerHour) {
        if (Math.round(elapsed/msPerMinute) == 1) {
            return '1 minute ago';
        } else {
            return Math.round(elapsed/msPerMinute) + ' minutes ago';
        } 
    }

    else if (elapsed < msPerDay ) {
        if (Math.round(elapsed/msPerHour) == 1) {
            return '1 hour ago';
        } else {
            return Math.round(elapsed/msPerHour) + ' hours ago';
        } 
    }

    else if (elapsed < msPerMonth) {
        if (Math.round(elapsed/msPerDay) == 1) {
            return '1 day ago';
        } else {
            return Math.round(elapsed/msPerDay) + ' days ago';
        }
    }

    else if (elapsed < msPerYear) {
        if (Math.round(elapsed/msPerMonth) == 1) {
            return '1 month ago';
        } else {
            return Math.round(elapsed/msPerMonth) + ' months ago';
        }
    }

    else {
        if (Math.round(elapsed/msPerYear) == 1) {
            return '1 year ago';
        } else {
            return Math.round(elapsed/msPerYear) + ' years ago';
        }
    }
};
