
const socket = io()
const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector(".chat-messages")
const roomname = document.getElementById('room-name')
const userlist = document.getElementById('users')

socket.on('message', (message) =>{
    showMessage(message)
    
    chatMessages.scrollTop = chatMessages.scrollHeight
})

const {username, room} = Qs.parse(window.location.search,{
    ignoreQueryPrefix: true
})

socket.emit('JoinRoom', username, room)

chatForm.addEventListener('submit', (event) =>{
    event.preventDefault()

    const msg = event.target.elements.msg.value
    socket.emit('chatMessage', msg)
    event.target.elements.msg.value = ''
    event.target.elements.msg.focus()
    
})

function showMessage(message) {
    const chatBox = document.querySelector(".chat-messages")
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>`
    chatBox.appendChild(div)
}

socket.on('userRoom', (data) =>{
    console.log(data.room)
    roomname.innerText = data.room
    let insertHTML = '';
    {data.users.forEach((user) => {
        insertHTML += `<li>${user.username}</li>`
    })}
    console.log(insertHTML)
    userlist.innerHTML = insertHTML;
})