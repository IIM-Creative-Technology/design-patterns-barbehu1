document.addEventListener('keydown', function(e){
    /* switch (e.code) {...*/
    console.log(e.code)

    // check if method in imageManager exists
    if(imageManager.hasOwnProperty(e.code)) {
        imageManager.execute(e.code)
    }
})

let imageManager = {
    image: document.querySelector('.twitter-picture'),
    ArrowUp: function () {
        this.image.style.top = this.image.offsetTop - 10 + 'px'
    },
    ArrowLeft: function () {
        this.image.style.left = this.image.offsetLeft - 10 + 'px'
    },
    ArrowRight: function () {
        this.image.style.left = this.image.offsetLeft + 10 + 'px'
    },
    ArrowDown: function () {
        this.image.style.top = this.image.offsetTop + 10 + 'px'
    }
}

imageManager.execute = function (key) {
    let methodName = imageManager[key]
    return methodName.apply(imageManager)
}

function random() {
    let randomNumber = Math.floor(Math.random() * 4)
    let movement

    switch(randomNumber) {
        case 1:
            movement = 'ArrowUp'
        break
        case 2:
            movement = 'ArrowRight'
        break
        case 3:
            movement = 'ArrowLeft'
        break
        case 4:    
            movement = 'ArrowDown'
        break 
    }
    return movement
}

setInterval(function () {
    let randomMovement = random()
    if(imageManager.hasOwnProperty(randomMovement)) {
        imageManager.execute(randomMovement)
    }
}, 500)