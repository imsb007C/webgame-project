//add event listener for when the dom content loaded
document.addEventListener('DOMContentLoaded', ()=> {
    //making 20 X 10 grid using div tag
    const body = document.querySelector("container")
    const grid = document.createElement("div");
    grid.setAttribute("class", "grid")
    body.appendChild(grid)
    for(let x = 0; x < 200; x++){
        let div = document.createElement("div")
        grid.appendChild(div)
    }
    //make a bottom line
    for(let x = 0; x<10;x++){
        let div = document.createElement("div")
        div.setAttribute("class","taken")
        grid.appendChild(div)
    }
    // make a 4 by 4 gird to display the next Tetrominoes
    const miniGrid = document.createElement("div")
    miniGrid.setAttribute("class","mini-grid")
    body.append(miniGrid)
    for(let x = 0; x <16 ; x++){
        let div = document.createElement('div')
        miniGrid.appendChild(div)
    }
    const Grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const ScoreDisplay = document.querySelector('#score')
    const StartBotton = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0


    //The Tetrominoess
    const lTetromino = [
        [1,width+1,width*2+1,2],
        [width,width+1,width+2,width*2+2],
        [1,width+1,width*2+1, width*2],
        [width,width*2,width*2+1,width*2+2]
    ]
    const skewTetromino = [
        [width+1,width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1]
    ]
    const tTetrominoes = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1]
        [1,width,width+1,width*2+1]
    ]
    const squareTetrominoes = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]
    const lineTetrominoes = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]
    const theTetrominoes = [lTetromino,skewTetromino,tTetrominoes,squareTetrominoes,lineTetrominoes]
    
    let currentPosition = 4
    let currentRotation = 0

    //random selecte a tetrominoes
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]

    //draw the first rotation in the first tetromino
    function draw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        })
    }
    
    //undraw the Tetromino
    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }
  
    
    //assign functions to keyCodes
    function control(e) {
        if(e.keyCode === 37){
            moveLeft()
        }
        else if (e.keyCode ===38){
            rotate()
        }
        else if (e.keyCode === 39){
            moveRight()
        }
        else if(e.keyCode === 40){
            fallDown()
        }
    }
    document.addEventListener("keydown",control)

    //fall down function
    function fallDown(){
        undraw()
        currentPosition = currentPosition + width
        draw()
        freeze()
    }

    //stop tetromino falling down
    function freeze() {
        //check if the tetromino at the bottom line or there is other tetromino under
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            //add class name taken when there is a tetromino
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition=4
            draw()
            displayShape()
            addScore()
            gameover()
        }
    }

    //move the tetromino left, unless is at the edge or there is a blockage
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if(!isAtLeftEdge){
            currentPosition = currentPosition - 1   
        }
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition = currentPosition+1
        }
        draw()
    }
    //move the tetromino right, unless is at the edge or there is a blockage
    function moveRight() {
        
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
        if(!isAtRightEdge){
            undraw()
            currentPosition = currentPosition + 1   
        }
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            undraw()
            currentPosition = currentPosition - 1
        }
        draw()
    }

    //rotate the tetromino
    function rotate(){

        const isAtLeftEdge = current.some(index => (currentPosition + index)%width === 0)
        const isAtRightEdge = current.some(index=> (currentPosition+index)%width===(width-1))

        if(isAtLeftEdge|!isAtRightEdge){
            undraw()
            currentRotation++
            if(currentRotation === current.length){ // if the current rotation get to 4 make it go back to 0
                currentRotation = 0
            }
        }
        current= theTetrominoes[random][currentRotation]
        draw()
    }

    //show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0
    

    //the Tetrominos without roations
    const upNextTetromineos = [
        [1,displayWidth+1,displayWidth*2+1,2], //L
        [displayWidth+1,displayWidth+2,displayWidth*2,displayWidth*2+1], //SKEW
        [1,displayWidth,displayWidth+1,displayWidth+2], //T
        [0,1,displayWidth,displayWidth+1], //SQUARE
        [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1] //LINE
    ]
    //display the shape in the mini grid display
    function displayShape(){
        //remove any trace of a tetromino form the entire gird
        displaySquares.forEach(square =>{
            square.classList.remove('tetromino')
        })
        upNextTetromineos[nextRandom].forEach(index=>{
            displaySquares[displayIndex + index].classList.add('tetromino')
        })
    }

    //add functionality to the button
    StartBotton.addEventListener('click', ()=> {
        if(timerId){
            clearInterval(timerId)
            timerId = null
        }
        else{
            draw()
            timerId = setInterval(fallDown,1000)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })
    // add score
    function addScore(){
        for(let i = 0; i < 199; i = width + i){
            const row=[i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]

            if(row.every(index => squares[index].classList.contains('taken'))){
                score = score + 10
                ScoreDisplay.innerHTML = score
                row.forEach(index=>{
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                })
                const squareRemoved = squares.splice(i, width)
                squares = squareRemoved.concat(squares)
                squares.forEach(cell=>grid.appendChild(cell))
            }
        }
    }

    //game over
    function gameover(){
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            ScoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }

})
