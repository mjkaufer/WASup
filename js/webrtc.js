var currentChannel = 0
var channel = new DataChannel("hi");

channel.onopen = function(userid) {
    console.log(userid)
};

channel.onmessage = function(message, userid) {
    if (message.subChannel == currentChannel) {
        playNote(message.payload)
    }
};

channel.onleave = function(userid) {
    console.log("Bye ", userid)
};

function updateRoom(i) {
    currentChannel = i
};

function sendMessage(data) {
    channel.send({
        payload: data,
        subChannel: currentChannel
    })
}
// var webrtc = new SimpleWebRTC({})

// webrtc.on('readyToCall', function() {
//     // you can name it anything
//     webrtc.joinRoom('your awesome room name');
//     console.log('ay')
// });

// webrtc.on('channelMessage', function(peer, channelLabel, data) {
//     console.log(peer, channelLabel, data)
// })