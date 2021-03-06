const express = require('express')
const path = require('path')
const WebSocket = require('ws')
const MattkovChains = require('./mattkovchains')
const webPort = 3000
const numChannels = 10

// start web server to host our page
const app = express()
app.use('/', express.static(path.join(__dirname, 'client')))

const httpServer = require('http').createServer(app)
httpServer.listen(webPort, () => console.log(`WASup listening on port ${webPort}!`))

// start websocket server
const socketServer = new WebSocket.Server({ server: httpServer })

const channelChains = Array.apply(null, Array(numChannels)).map(function() {
    return MattkovChains()
})

// when a client connects
socketServer.on('connection', function(connection) {

    connection.on('message', function(message) {

        message = JSON.parse(message)

        if (message.payload === undefined || typeof message.payload != "number") {
            return
        }

        var chain = channelChains[message.subChannel]

        if (message.payload === -1) {
            message.payload = chain.guessNote()

            if (message.payload === undefined) {
                return
            }

            connection.send(JSON.stringify(message))
        } else {
            chain.consumeNote(message.payload)
        }

        const stringifiedMessage = JSON.stringify(message)

        socketServer.clients.forEach(function(client) {
            // if the client is active and not our client, forward them the note we played
            if (client !== connection && client.readyState === WebSocket.OPEN) {
                client.send(stringifiedMessage)
            }
        })
    })
})
