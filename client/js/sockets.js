const socketPort = 3000
const wsURL = "ws://" + window.location.hostname + window.location.pathname.slice(0, -1) + ":" + socketPort
const socket = new WebSocket(wsURL)
var currentChannel = 0

socket.onmessage = function(message) {
    var json = JSON.parse(message.data)

    if (json.subChannel === currentChannel) {
        playNote(json.payload)
    } else if (json.subChannel === undefined) {
        console.log(json.payload)
    }
};

function updateRoom(i) {
    currentChannel = i
};

function sendMessage(data) {
    var noteData = {
        payload: data,
        subChannel: currentChannel
    }

    socket.send(JSON.stringify(noteData))
}