const NOTE_UPTIME = 250;
const ROOMS = 10;

var s = Snap("#snap");

var colors = ["#EA2027", "#EE5A24", "#F79F1F", "#FFC312", "#A3CB38", "#C4E538", "#1289A7", "#12CBC4", "#9980FA", "#D980FA", "#B53471", "#ED4C67"]

var width = document.body.clientWidth
var height = document.body.clientHeight

var mouseDown = false

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
        rect.playStates = 0
        // rect.noStroke()
        rects.push(rect)
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
    }
}

function projectVector(vector, length) {
    var magnitude = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2))
    return vector.map(function(e) {
        return e / magnitude * length
    })
}

var rects = createKeys(24)

function playNote(n) {
    var rect = rects[n]
    rect.playStates += 1
    rect.node.classList.add('up')

    setTimeout(function() {
        rect.playStates -= 1
        if (rect.playStates == 0) {
            rect.node.classList.remove('up')
        }
    }, NOTE_UPTIME)    
    
    // rects[0].animate({"transform": "scale(1, 1.5)"}, 100)
}