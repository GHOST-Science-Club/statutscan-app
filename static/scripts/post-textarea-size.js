const textarea = document.getElementById('input');
const post_container = document.getSelection('.post-container');

textarea.addEventListener('input', function () {
    this.style.height = 'auto';
    let post_height = this.scrollHeight;
    post_height = Math.min(post_height, 200);
    this.style.height = post_height + 'px';
    post_container.style.height = post_height + 'px';
});