var currentChannel = 0
var channel = new DataChannel("WASup-0");

channel.onopen = function(userid) {
    console.log(userid)
};

channel.onmessage = function(message, userid) {
    console.log(userid, message)
    if (message.subChannel == currentChannel) {
        playNote(rects[message.payload])
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