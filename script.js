const apiUrl = "https://jsonplaceholder.typicode.com/posts";


const logoutButton = document.querySelector("#logout");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.clear();
        alert("You have logged out successfully!");
        window.location.href = "index.html";
    });
}


const registerButton = document.querySelector("#register-button");

if (registerButton) {
    registerButton.addEventListener("click", () => {
        const username = document.querySelector("#register-username").value.trim();
        const password = document.querySelector("#password").value.trim();
        const confirmPassword = document.querySelector("#confirm-password").value.trim();

        if (!username || !password || !confirmPassword) {
            alert("Please fill out all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        localStorage.setItem("user", JSON.stringify({ username, password }));
        alert("Registration successful! You can now login.");
        window.location.href = "login.html";
    });
}


const loginButton = document.querySelector("#login-button");

if (loginButton) {
    loginButton.addEventListener("click", () => {
        const username = document.querySelector("#login-username").value.trim();
        const password = document.querySelector("#login-password").value.trim();
        const user = JSON.parse(localStorage.getItem("user"));

        if (user && user.username === username && user.password === password) {
            localStorage.setItem("loggedIn", "true");
            alert(`Welcome back, ${username}!`);
            window.location.href = "home.html";
        } else {
            alert("Invalid credentials. Please try again.");
        }
    });
}


const userInfo = document.querySelector("#user-info");
const loggedIn = localStorage.getItem("loggedIn") === "true";
const user = loggedIn ? JSON.parse(localStorage.getItem("user")) : null;

if (user && userInfo) {
    userInfo.textContent = `Logged in as: ${user.username}`;
}


if (window.location.pathname.includes("home.html")) {
    const postsContainer = document.querySelector("#posts");

    fetch(apiUrl)
        .then(res => res.json())
        .then(posts => {
            let postsHTML = '';
            posts.forEach(post => {
                postsHTML += `
                    <div class="post-card" data-id="${post.id}">
                        <h3>${post.title}</h3>
                        <p>${post.body}</p>
                        <small>Post ID: ${post.id}</small>
                    </div>
                `;
            });

            postsContainer.innerHTML = postsHTML;

            document.querySelectorAll(".post-card").forEach(card => {
                card.addEventListener("click", () => {
                    const postId = card.getAttribute("data-id");
                    localStorage.setItem("selectedPostId", postId);
                    window.location.href = "singlePost.html";
                });
            });
        })
        .catch(error => {
            console.error("Error fetching posts:", error);
        });
}


if (window.location.pathname.includes("singlePost.html")) {
    const postContainer = document.querySelector("#single-post");
    const postId = localStorage.getItem("selectedPostId");

    if (postId) {
        fetch(`${apiUrl}/${postId}`)
            .then(res => res.json())
            .then(post => {
                postContainer.innerHTML = `
                    <div class="post">
                        <h3>${post.title}</h3>
                        <p>${post.body}</p>
                        <small>Post ID: ${post.id}</small>
                    </div>
                `;
            })
            .catch(error => {
                console.error("Error fetching post:", error);
                postContainer.innerHTML = "<p>Failed to load the post.</p>";
            });
    } else {
        postContainer.innerHTML = "<p>No post found.</p>";
    }
}

function goBack() {
    window.history.back();
}


if (window.location.pathname.includes("gallery.html")) {
    const galleryContainer = document.querySelector("#gallery");

    fetch("https://api.escuelajs.co/api/v1/products")
        .then(res => res.json())
        .then(products => {
            galleryContainer.innerHTML = products
                .slice(0, 30)
                .map(product => `
                    <div class="product-card">
                        <img src="${product.images[0]}" alt="${product.title}" class="product-image">
                    </div>
                `).join('');
        })
        .catch(error => console.error("Error fetching products:", error));
}


document.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.querySelector("#sendButton");
    const messageInput = document.querySelector("#messageInput");
    const messagesContainer = document.querySelector("#messages");


    const loadMessages = () => {
        const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
        messagesContainer.innerHTML = "";
        storedMessages.forEach(msg => {
            const messageElement = document.createElement("div");
            messageElement.classList.add("message", msg.type);

            const textElement = document.createElement("p");
            textElement.textContent = msg.text;

            const timeElement = document.createElement("small");
            timeElement.classList.add("timestamp");
            timeElement.textContent = msg.time;

            messageElement.appendChild(textElement);
            messageElement.appendChild(timeElement);

            messagesContainer.appendChild(messageElement);
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };


    const saveMessage = (text, type) => {
        const currentTime = new Date();
        const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMessage = { text, type, time: timeString };

        const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
        storedMessages.push(newMessage);
        localStorage.setItem("chatMessages", JSON.stringify(storedMessages));
    };


    sendButton.addEventListener("click", () => {
        const messageText = messageInput.value.trim();
        if (messageText) {
            saveMessage(messageText, "sent");
            loadMessages();
            messageInput.value = "";
        }
    });


    loadMessages();
});


document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const changePasswordForm = document.querySelector("#changePasswordForm");
    const changeProfilePictureForm = document.querySelector("#changeProfilePictureForm");

    if (changePasswordForm) {
        changePasswordForm.addEventListener("submit", e => {
            e.preventDefault();
            const currentPassword = document.querySelector("#currentPassword").value.trim();
            const newPassword = document.querySelector("#newPassword").value.trim();
            const confirmPassword = document.querySelector("#confirmPassword").value.trim();

            if (currentPassword !== currentUser.password) {
                alert("Current password is incorrect.");
                return;
            }

            if (newPassword !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            currentUser.password = newPassword;
            localStorage.setItem("user", JSON.stringify(currentUser));
            alert("Password changed successfully.");
        });
    }

    if (changeProfilePictureForm) {
        changeProfilePictureForm.addEventListener("submit", e => {
            e.preventDefault();
            const profileImageInput = document.querySelector("#profileImageInput");

            if (profileImageInput.files && profileImageInput.files[0]) {
                const reader = new FileReader();

                reader.onload = e => {
                    currentUser.profileImage = e.target.result;
                    localStorage.setItem("user", JSON.stringify(currentUser));
                    alert("Profile picture changed successfully.");
                };

                reader.readAsDataURL(profileImageInput.files[0]);
            } else {
                alert("Please select an image.");
            }
        });
    }
});
