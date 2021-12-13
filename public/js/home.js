
xhr.open('GET', '/api/posts', true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.onload = () => {
        let parsedResponse = JSON.parse(xhr.responseText);
        let container = document.getElementById('postsContainer');
        outputPosts(parsedResponse, container);
};

xhr.send();

function outputPosts(results, container) {
    container.innerHTML = "";
    
    results.forEach(result => {
        let post = document.createElement('div');
        let postHtml = createPostHtml(result);
        post.innerHTML = postHtml;
        container.appendChild(post);
    });

    if (results.length == 0) {
        container.appendChild(`<span>Nothing to show</span>`);
    }
};