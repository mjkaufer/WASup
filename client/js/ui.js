const NOTE_UPTIME = 250;
const ROOMS = 10;

var s = Snap("#snap");

var colors = ["#EA2027", "#EE5A24", "#F79F1F", "#FFC312", "#A3CB38", "#C4E538", "#1289A7", "#12CBC4", "#9980FA", "#D980FA", "#B53471", "#ED4C67"]

var width = document.body.clientWidth
var height = document.body.clientHeight

var mouseDown = false

var piano = new Wad(Wad.presets.piano)

function createKeys(n) {
    var rectWidth = width / n
    var rectHeight = height / 5    

    var rects = []

    for (var i = 0; i < n; i++) {
        // makeRectangle places based on center, so we needa adapt
        var x = i * rectWidth
        var y = document.body.clientHeight - rectHeight / 2

        var rect = s.rect(x, y, rectWidth, rectHeight)
        rect.attr("fill", colors[i % 12])
        rect.attr("pitch", Math.pow(2, i / 12) * 440)
        rect.playStates = 0
        rects.push(rect)

        var play = function(i) {
            rects[i].node.onmousedown = function() {
                playNote(i)
                sendMessage(i)
            }
        }

        play(i)
        
    }

    return rects
}

function createKnobs(r) {
    var mainKnob = s.circle(width / 2, height * 2 / 3, r)
    var subRadius = r / 3
    var offset = r - subRadius - Math.sqrt(subRadius)

    mainKnob.cx = parseInt(mainKnob.attr("cx"))
    mainKnob.cy = parseInt(mainKnob.attr("cy"))
    var subKnob = s.circle(mainKnob.cx - offset, mainKnob.cy, subRadius)
    subKnob.offset = offset
    subKnob.angle = 0
    subKnob.node.classList.add("cursor")
    subKnob.attr("fill", "#ffffff")

    return [mainKnob, subKnob]
}

var knobs = createKnobs(Math.min(width, height) / 15)
var rects = createKeys(24)

knobs[1].node.onmousedown = function() {
    mouseDown = true
}

document.body.onmouseup = function() {
    mouseDown = false
}

var roomDisplay = document.getElementById('room')

document.body.onmousemove = function(e) {
    if (mouseDown) {
        var vector = [e.pageX - knobs[0].cx, e.pageY - knobs[0].cy]
        var projection = projectVector(vector, knobs[1].offset)
        knobs[1].attr("cx", knobs[0].cx + projection[0])
        knobs[1].attr("cy", knobs[0].cy + projection[1])

        // subtract by 0.5 / ROOMS because there is some point where the sum reads 2, but it is super small, so it's
        // really hard to get to that room, so we just artificially remove it
        var room = parseInt((Math.atan2(projection[1], projection[0]) / Math.PI + 1 - 0.5 / ROOMS) / 2 * ROOMS)
        roomDisplay.innerHTML = room
        updateRoom(room)
    }
}

function projectVector(vector, length) {
    var magnitude = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2))
    return vector.map(function(e) {
        return e / magnitude * length
    })
}

function playNote(i) {
    var rect = rects[i]
    rect.playStates += 1
    rect.node.classList.add('up')

    piano.play({pitch: rect.attr("pitch")})

    setTimeout(function() {
        rect.playStates -= 1
        if (rect.playStates == 0) {
            rect.node.classList.remove('up')
        }
    }, NOTE_UPTIME)   
}


const pathAnimationInterval = 20
const circleRadius = 20
const numPaths = 5

// some docs on how to make paths: http://snapsvg.io/docs/#Paper.path
var pathStrings = ["M0,0h10v10h10", "M0,0l10,0l0,20Z", "M0,0a7,7,0,1,1,0,.00001"]
var pathGroups = makePaths(numPaths)


function makePaths(numPaths) {
    var paths = []
    for (var i = 0; i < numPaths; i++) {
        var pathString = pathStrings[parseInt(Math.random() * pathStrings.length)]
        var stroke = colors[parseInt(Math.random() * colors.length)]
        var g = s.group()
        var path = g.path(pathString)
        path.attr({
            stroke,
            "fill-opacity": 0,
            "stroke-width": 3
        })

        var x = Math.random() * (width - g.getBBox().width - 2 * circleRadius)
        var y = Math.random() * (height - g.getBBox().height - 2 * circleRadius)

        g.initial = Math.random() * 2 * Math.PI
        g.period = Math.random() + 0.5
        g.rotation = parseInt(Math.random() * 360)
        g.x = x
        g.y = y

        g.addClass('pathGroup')

        updateGroupPosition(g)

        paths.push(g)
    }

    return paths
}

function updateGroupPosition(group) {
    var w = (t + group.initial) * group.period
    var x = group.x + circleRadius * Math.cos(w)
    var y = group.y + circleRadius * Math.sin(w)
    group.transform("t" + x + "," + y + "r" + group.rotation)
}

var t = 0
var dt = 0.05
setInterval(function() {
    pathGroups.forEach(function(group) {
        updateGroupPosition(group)
    })
    t += dt
}, pathAnimationInterval)

window.onresize = function() {
    knobs.forEach(function(knob) {
        knob.remove()
    })
    rects.forEach(function(rect) {
        rect.remove()
    })

    pathGroups.forEach(function(pathGroup) {
        pathGroup.remove()
    })

    width = document.body.clientWidth
    height = document.body.clientHeight

    rects = createKeys(24)
    knobs = createKnobs(Math.min(width, height) / 15)

    pathGroups = makePaths(numPaths)
}