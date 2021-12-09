
let textBox = document.getElementById('postText');
let button = document.getElementById('postSubmit');
const xhr = new XMLHttpRequest();

// Enable/Disable post button 
textBox.addEventListener('keyup', (e) => {
    if (e.target.value.trim() != "") {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
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

//Post ID
function getPostId(element) {
    let isRoot = element.classList.contains('post');
    let rootEl = isRoot ? element : element.closest('.post');
    let postId = rootEl.dataset.id;

    if (!postId) { return alert('No Post Id') }

    return postId;
};

//Handle Posting
button.addEventListener('click', () => {
    let dataObj = {
        content: textBox.value.trim()
    };
    let data = new URLSearchParams(Object.entries(dataObj)).toString();

    xhr.open('POST', '/api/posts', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
            let parsedResponse = JSON.parse(xhr.responseText);
            let container = document.getElementById('postsContainer');
            let postHtml = createPostHtml(parsedResponse);
            let postElement = document.createElement('div');

            postElement.innerHTML = postHtml;

            container.prepend(postElement);
            textBox.value = '';
            button.disabled = true;

            console.log(parsedResponse);
        }
    };
    xhr.send(data);

});

function createPostHtml(postData) {
    let postUser = postData.postedBy;
    let postTime = timeDifference(new Date(), new Date(postData.createdAt));
    let likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "activeLike" : "";

    return `
        <div class="post" data-id="${postData._id}">
            <div class="postMainContainer">
                <div class="userImageWrap">
                    <img src="${postUser.profilePic}">
                </div>
                <div class="postContent">
                    <div class="postHeader">
                        <a href="/profile/${postUser.username}">${postUser.username}</a>
                        <span class="postDate">${postTime}</span>
                    </div>
                    <div class="postBody">
                        <span>${postData.content}</span>
                    </div>
                    <div class="postFooter">
                        <div class="postButtonWrap">
                        <button>
                            <i class="far fa-comment"></i>
                        </button>
                        </div>
                        <div class="postButtonWrap">
                        <button>
                            <i class="fas fa-retweet"></i>
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

/* Relative Timestamp */
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
