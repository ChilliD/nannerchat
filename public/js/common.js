
// Enable/Disable post button 
let textBox = document.getElementById('postText');
let button = document.getElementById('postSubmit');
textBox.addEventListener('keyup', (e) => {
    if (e.target.value.trim() != "") {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
});
