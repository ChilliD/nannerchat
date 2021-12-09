
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

//Handle Post
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
    let postTime = 'Just Now';

    return `
        <div class="post">
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
                    <div class="postFooter"></div>
                </div>
            </div>
        </div>
    `;
};