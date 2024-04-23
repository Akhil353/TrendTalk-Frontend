<html lang="en">
<head>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Media Chat</title>
    <style> /* partially created by chatGPT */
        @keyframes strobe {
            0%, 100%{
                border-color: #FF0000;
            }
            20% {
                border-color: #FF7F00;
            }
            40% {
                border-color: #FFFF00;
            }
            60% {
                border-color: #00FF00;
            }
            80% {
                border-color: #002CFF;
            }
        }
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #171515;
            color: #39FF14;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        .container {
            border-radius: 15px;
            padding: 20px;
            border: 5px solid transparent;
            background-clip: padding-box;
            background-color: #171515;
            color: #39FF14;
            animation: strobe 2s infinite;
            max-width: 1000px;
            width: 100%;
            margin: 20px auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        input[type="text"],
        textarea {
            width: calc(100% - 20px);
            margin-bottom: 10px;
            padding: 10px;
            border: 1px solid #ccc;
            background-color: #fff;
            color: #000;
            border-radius: 5px;
            resize: vertical;
            box-sizing: border-box;
        }
        button {
            width: calc(100% - 20px);
            padding: 10px;
            background-color: #39FF14;
            color: #fff;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.3s ease;
            box-sizing: border-box;
        }
        button:hover {
            background-color: #2d9e00;
        }
        .posts-container {
            max-width: 800px;
            width: 100%;
            padding: 20px;
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .post-container {
            width: 100%;
            max-width: 600px;
            border: 1px solid #ccc;
            margin-bottom: 10px;
            padding: 10px;
            background-color: #000;
            color: #fff;
            border-radius: 5px;
            position: relative;
            box-sizing: border-box;
        }
        .post-actions {
            position: absolute;
            top: 10px;
            right: 10px;
        }
        .post-actions button {
            margin-right: 5px;
            cursor: pointer;
            background-color: transparent;
            border: none;
            color: #39FF14;
        }
        .post-content {
            margin: 0;
        }
        .reply-form-container {
            margin-top: 10px;
            border: 1px solid #ccc;
            padding: 10px;
            background-color: #252525;
            border-radius: 5px;
            color: #fff;
            width: calc(100% - 40px);
            margin-left: auto;
        }
        .reply-form-container h3 {
            margin-top: 0;
        }
    </style>
</head>
<body onload="fetchPosts();">
    <div class="container">
        <div class="input-container">
        <form action="javascript:createPost()" id="postButton">
            <h2>Post Your Message</h2>
            <textarea id="message" placeholder="Type your post..."></textarea>
            <button id="postButton">Post</button>
        </form>
        </div>
        <div class="posts-container" id="postsWrapper">
            <h2>Posts</h2>
            <input type="text" id="searchInput" oninput="searchPosts()" placeholder="Search posts...">
            <div id="posts"></div>
        </div>
    </div>
    <div id="latestPosts" class="latest-posts"></div>
<script>
    if (location.hostname === "localhost") {
        uri = "http://localhost:8086/";
} else if (location.hostname === "127.0.0.1") {
        uri = "http://127.0.0.1:8086/";
} else if (location.hostname === "0.0.0.0") {
        uri = "http://0.0.0.0:4100/"
} else {
        uri = "http://localhost:8086/";
}
    function createPost() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const message = document.getElementById("message").value;
        const body = {
            message: message,
            likes: 0
        };
        const authOptions = {
            method: 'POST',
            cache: 'no-cache',
            headers: myHeaders,
            body: JSON.stringify(body),
            credentials: 'include'
        };
        fetch(uri+'/api/messages/send', authOptions)
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to create post:', response.status);
                    return null;
                }
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(data => {
                if (data !== null) {
                    console.log('Response:', data);
                    updatePostsContainer(data['uid'], message, 0);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    function fetchPosts() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const authOptions = {
            method: 'GET',
            cache: 'no-cache',
            headers: myHeaders,
            credentials: 'include'
        };
        fetch(uri+'/api/messages/', authOptions)
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to fetch posts:', response.status);
                    return null;
                }
                return response.json();
            })
            .then(posts => {
                if (posts === null || posts === undefined) {
                    console.warn('Received null or undefined posts.');
                    alert('Please Log in first!');
                    return;
                }
                console.log('Fetched Posts:', posts);
                displayPosts(posts);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    function displayPosts(posts) {
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            updatePostsContainer(post.uid, post.message, post.likes);
        });
    }
    // boilerplate code created by chatGPT, then edited to fit needs
    function updatePostsContainer(uid, message, likes) {
        const postsContainer = document.getElementById('posts');
        const postDiv = document.createElement('div');
        postDiv.className = 'post-container';
        postDiv.dataset.uid = uid;
        const postContent = document.createElement('p');
        postContent.className = 'post-content';
        postContent.textContent = `UID: ${uid}, Message: ${message}`;
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => showEditForm(uid, message));
        const likeButton = document.createElement('button');
        likeButton.textContent = 'Like';
        likeButton.addEventListener('click', () => {
            likePost(uid, message);
            likeButton.style.display = 'none';
        });
        const likeCountContainer = document.createElement('div');
        likeCountContainer.className = 'like-count-container';
        const likesCountSpan = document.createElement('span');
        likesCountSpan.className = 'likes-count';
        likesCountSpan.textContent = `${likes} 👍`;
        likeCountContainer.appendChild(likesCountSpan);
        postDiv.appendChild(postContent);
        postDiv.appendChild(editButton);
        postDiv.appendChild(likeButton);
        postDiv.appendChild(likeCountContainer);
        postsContainer.appendChild(postDiv);
    }
    function showReplyForm(parentUID) {
        const replyFormContainer = document.getElementById('replyFormContainer');
        replyFormContainer.innerHTML = ''; // Clear existing content
        const replyForm = document.createElement('form');
        replyForm.className = 'reply-form-container';
        replyForm.innerHTML = `
            <h3>Reply to UID: ${parentUID}</h3>
            <textarea id="replyMessage" placeholder="Type your reply..."></textarea>
            <button type="button" onclick="postReply('${parentUID}')">Post Reply</button>
        `;
        replyFormContainer.appendChild(replyForm);
    }
    function postReply(parentUID) {
        const replyMessage = document.getElementById('replyMessage').value;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const body = {
            uid: parentUID,
            message: replyMessage,
            likes: 0
        };
        const authOptions = {
            method: 'POST',
            cache: 'no-cache',
            headers: myHeaders,
            body: JSON.stringify(body),
            credentials: 'include'
        };
        fetch(uri+'/api/messages/send', authOptions)
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to create reply:', response.status);
                    return null;
                }
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(data => {
                if (data !== null) {
                    console.log('Reply Response:', data);
                    const replyFormContainer = document.getElementById('replyFormContainer');
                    replyFormContainer.innerHTML = '';
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    function likePost(uid, message) {
        const likesCountSpan = document.querySelector(`.post-container[data-uid="${uid}"] .likes-count`);
        var currentLikes = 0;
        if (likesCountSpan) {
            currentLikes = parseInt(likesCountSpan.textContent, 10) || 0;
            likesCountSpan.textContent = `${currentLikes + 1} 👍`;
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const body = {
            message: message,
        };
        const authOptions = {
            method: 'PUT',
            cache: 'no-cache',
            headers: myHeaders,
            body: JSON.stringify(body),
            credentials: 'include'
        };
        fetch(uri+`/api/messages/like`, authOptions)
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to like post:', response.status);
                    if (likesCountSpan) {
                        likesCountSpan.textContent = `${currentLikes} 👍`;
                    }
                    return null;
                }
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(data => {
                if (data !== null) {
                    console.log('Like Response:', data);
                    if (likesCountSpan) {
                        likesCountSpan.textContent = `${currentLikes + 1} 👍`;
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    function searchPosts() {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const postsContainer = document.getElementById('posts');
        const allPosts = postsContainer.querySelectorAll('.post-container');
        allPosts.forEach(post => {
            const postContent = post.querySelector('.post-content').textContent.toLowerCase();
            if (postContent.includes(searchInput)) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
    }
    function showEditForm(uid, message) {
        const editFormContainer = document.getElementById('editFormContainer');
        editFormContainer.innerHTML = ''; // Clear existing content
        const editForm = document.createElement('form');
        editForm.className = 'edit-form-container';
        editForm.innerHTML = `
            <h3>Edit Message with UID: ${uid}</h3>
            <textarea id="editMessage" placeholder="Edit your message...">${message}</textarea>
            <button type="button" onclick="editPost('${uid}')">Save Changes</button>
        `;
        editFormContainer.appendChild(editForm);
    }
    function editPost(uid) {
        const editedMessage = document.getElementById('editMessage').value;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const body = {
            message: editedMessage,
        };
        console.log(body);
        const authOptions = {
            method: 'DELETE',
            cache: 'no-cache',
            headers: myHeaders,
            body: JSON.stringify(body),
            credentials: 'include'
        };
        fetch(uri+'/api/messages/delete', authOptions)
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to edit post:', response.status);
                    return null;
                }
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(data => {
                if (data !== null) {
                    console.log('Edit Response:', data);
                    const editFormContainer = document.getElementById('editFormContainer');
                    editFormContainer.innerHTML = '';
                    fetchPosts();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
</script>


<div id="replyFormContainer"></div>

<div id="editFormContainer"></div>
