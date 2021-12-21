
if (activeTab === "replies") {
    loadReplies();
} else {
    loadPosts();
}


function loadPosts() {

    xhr.open('GET', '/api/posts/userposts/' + profileUserId, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = () => {
            let parsedResponse = JSON.parse(xhr.responseText);
            let container = document.getElementById('postsContainer');
            outputPosts(parsedResponse, container);
    };

    xhr.send();
};

function loadReplies() {

    xhr.open('GET', '/api/posts/userreplies/' + profileUserId, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = () => {
            let parsedResponse = JSON.parse(xhr.responseText);
            let container = document.getElementById('postsContainer');
            outputPosts(parsedResponse, container);
    };

    xhr.send();
};