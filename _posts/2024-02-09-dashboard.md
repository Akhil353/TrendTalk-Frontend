<head>
    <style> /* styling code created by chatGPT */
        @keyframes strobe {
            0%, 100%{
                border-color: #FF0000;
            }
            16% {
                border-color: #FFFF00;
            }
            33% {
                border-color: #00FF00;
            }
            49% {
                border-color: #00FFFF
            }
            66% {
                border-color: #0000FF;
            }
            80% {
                border-color: #FF00FF;
            }
        }
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #171515;
            color: #39ff14;
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
            color: #39dd14;
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
            background-color: #2d6e00;
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
    </style>
</head>
<body onload="fetch_posts();">
    <div class="container">
        <div class="input-container">
        <form action="javascript:create_post()" id="postButton">
            <h2>Post Your Message</h2>
            <textarea id="message" placeholder="Type your post..."></textarea>
            <button id="postButton">Post</button>
        </form>
        </div>
        <div class="posts-container" id="postsWrapper">
            <h2>Posts</h2>
            <input type="text" id="searchInput" oninput="search_posts()" placeholder="Search posts...">
            <div id="posts"></div>
        </div>
    </div>
    <div id="latestPosts" class="latest-posts"></div>
<script> 
/* this code was mainly created by me and and then debugged using chatGPT */
    if (location.hostname === "localhost") {
        uri = "http://localhost:8086/";
    } else if (location.hostname === "127.0.0.1") {
        uri = "http://127.0.0.1:8086/";
    } else if (location.hostname === "0.0.0.0") {
        uri = "http://0.0.0.0:4100/"
    } else {
        uri = "http://localhost:8086/";
    }
    function create_post() {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        const message = document.getElementById("message").value;
        const body = {
            message: message,
            likes: 0
        };
        const fetch_options = {
            method: 'POST',
            cache: 'no-cache',
            headers: headers,
            body: JSON.stringify(body),
            credentials: 'include'
        };
        fetch(uri+'/api/messages/send', fetch_options)
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to create post:', response.status);
                    return null;
                }
                const content = response.headers.get('Content-Type');
                if (content && content.includes('application/json')) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(data => {
                if (data !== null) {
                    console.log('Response:', data);
                    update_posts_container(data['uid'], message, 0);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    function fetch_posts() {
        const fetch_options = {
            method: 'GET',
            cache: 'no-cache',
            headers: headers,
            credentials: 'include'
        };
        fetch(uri+'/api/messages/', fetch_options)
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
                display_posts(posts);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    function display_posts(posts) {
        const posts_container = document.getElementById('posts');
        posts_container.innerHTML = '';
        posts.forEach(post => {
            update_posts_container(post.uid, post.message, post.likes);
        });
    }
    // boilerplate code created by chatGPT, then edited to fit needs
    function update_posts_container(uid, message, likes) {
        const posts_container = document.getElementById('posts');
        const post_div = document.createElement('div');
        post_div.className = 'post-container';
        post_div.dataset.uid = uid;
        const post_content = document.createElement('p');
        post_content.className = 'post-content';
        post_content.textContent = `${uid}: ${message}`;
        const edit_button = document.createElement('button');
        edit_button.textContent = 'Edit';
        const like_button = document.createElement('button');
        like_button.textContent = 'Like';
        like_button.addEventListener('click', () => {
            like_post(uid, message);
            like_button.style.display = 'none';
        });
        const like_count_container = document.createElement('div');
        like_count_container.className = 'like-count-container';
        const likes_count_span = document.createElement('span');
        likes_count_span.className = 'likes-count';
        likes_count_span.textContent = `${likes} 👍`;
        like_count_container.appendChild(likes_count_span);
        post_div.appendChild(post_content);
        post_div.appendChild(edit_button);
        post_div.appendChild(like_button);
        post_div.appendChild(like_count_container);
        posts_container.appendChild(post_div);
    }
    function like_post(uid, message) {
        const likes_count_span = document.querySelector(`.post-container[data-uid="${uid}"] .likes-count`);
        var currentLikes = 0;
        if (likes_count_span) {
            currentLikes = parseInt(likes_count_span.textContent, 10) || 0;
            likes_count_span.textContent = `${currentLikes + 1} 👍`;
        }
        const body = {
            message: message,
        };
        const fetch_options = {
            method: 'PUT',
            cache: 'no-cache',
            headers: headers,
            body: JSON.stringify(body),
            credentials: 'include'
        };
        fetch(uri+`/api/messages/like`, fetch_options)
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to like post:', response.status);
                    if (likes_count_span) {
                        likes_count_span.textContent = `${currentLikes} 👍`;
                    }
                    return null;
                }
                const content = response.headers.get('Content-Type');
                if (content && content.includes('application/json')) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(data => {
                if (data !== null) {
                    console.log('Like Response:', data);
                    if (likes_count_span) {
                        likes_count_span.textContent = `${currentLikes + 1} 👍`;
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    function search_posts() {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const posts_container = document.getElementById('posts');
        const allPosts = posts_container.querySelectorAll('.post-container');
        allPosts.forEach(post => {
            const post_content = post.querySelector('.post-content').textContent.toLowerCase();
            if (post_content.includes(searchInput)) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
    }
</script>


<div id="editFormContainer"></div>
