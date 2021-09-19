let socket = io();

const target = document.querySelector(".target");
const targetContainer = document.querySelector(".target-container");
const form = document.querySelector("#form");
const sendAll = document.querySelector("#sendAllBtn");
const sendMe = document.querySelector("#sendMeBtn");
const input = document.querySelector("#input");
const userNameInput = document.querySelector("#username");
const login = document.querySelector("#login");
const roomName = document.querySelector("#chatroom");
const sideRoom = document.querySelector("#sidebar-chatroom");
const sideUsers = document.querySelector("#sidebar-users");

let ID = "";

const { username, chatroom } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

console.log(username, chatroom);

socket.emit("joinRoom", { username, chatroom });

// Get room and users
socket.on('roomUsers', ({ chatroom, users }) => {
    outputRoomName(chatroom);
    outputUsers(users);
});


socket.on("message", (message) => {
    displayMessage(message);
    ID = socket.id
    console.log(message.id);
    console.log(message);
});


sendAll.addEventListener("click", (e) => {
    e.preventDefault();
    const message = input.value;
    if (input.value) {
        socket.emit("sendToAll", message);
        input.value = "";
        input.focus();
    }
});

sendMe.addEventListener("click", (e) => {
    e.preventDefault();
    let message = input.value;
    if (input.value) {
        socket.emit("sendToMe", message);
        input.value = "";
        input.focus();
    }
});

function displayMessage(message) {
    const item = document.createElement("div");
    const item2 = document.createElement("div")

    if (message.username === "KittyChat bot") {
        item.classList.add("message-item");
        item2.classList.add("message-content")
    } else if (ID === message.id) {
        console.log("bla");
        item.classList.add("message-item-me");
        item2.classList.add("message-content-me")

    } else {
        console.log("blabla");
        item.classList.add("message-item-other");
        item2.classList.add("message-content-other")

    }

    item2.innerHTML = `
    <p class="message-username"><span class="user">${message.username}</span> - ${chatroom} - ${message.time}</p>
    <p>${message.text}</p>
    `;
    target.appendChild(item);
    item.appendChild(item2)
    console.log("bla" + chatroom);

    targetContainer.scrollTop = targetContainer.scrollHeight;
}


// Add room name to DOM
function outputRoomName(chatroom) {
    sideRoom.innerText = chatroom;
}

// Add users to DOM
function outputUsers(users) {
    sideUsers.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        sideUsers.appendChild(li);
    });
}


function addEmoji(emoji) {
    input.value += emoji;
}

function toggleEmojiPopup() {
    let popup = document.getElementById("emoji-popup-id");
    popup.classList.toggle("toggle-popup");
}