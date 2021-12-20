
xhr.open('GET', '/api/posts/' + postId, true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.onload = () => {
        let parsedResponse = JSON.parse(xhr.responseText);
        let container = document.getElementById('postsContainer');
        outputPostsIncludeReplies(parsedResponse, container);
};

xhr.send();
