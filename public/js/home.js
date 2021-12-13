
xhr.open('GET', '/api/posts', true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.onload = () => {
        let parsedResponse = JSON.parse(xhr.responseText);
        let container = document.getElementById('postsContainer');
        outputPosts(parsedResponse, container);
};

xhr.send();
