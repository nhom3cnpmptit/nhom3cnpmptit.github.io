//BACKGROUND (screeen adjustment):

var height = 0
var width = 0
var lives = 1 
var time = 0 
var createtime = 1500

var level = window.location.search
level = level.replace('?', '')

// TIME SETTINGS:

if (level === 'normal'){ 
	time = 30
	createtime = 1500
} else if (level === 'hard'){
	time = 45
	createtime = 1200
} else if (level === 'expert'){
	time = 60
	createtime = 900
}

function screenSize(){
	height = window.innerHeight
	width = window.innerWidth
}

screenSize()

var chronometer = setInterval(function(){
	time -= 1
	if (time < 0){ //vitória
		clearInterval(chronometer) 
		clearInterval(createZombie) 
		window.location.href = 'victory.html'
	} else{
		document.getElementById('chronometer').innerHTML = time
	}

}, 1000)

function randomPosition(){

	if(document.getElementById('zombie')){
		document.getElementById('zombie').remove()
		if (lives <= 3){ 
			document.getElementById('life' + lives).src = "../images/empty_heart.png"
			lives++
		} else{ 
			window.location.href = 'defeat.html'
		}
	}

	var positionx = Math.floor(Math.random() * width) - 250 
	var positiony = Math.floor(Math.random() * height) - 250 

	positionx = positionx < 0 ? 0 : positionx
	positiony = positiony < 0 ? 0 : positiony

	var zombie = document.createElement('img') 
	zombie.src = '../images/zombie.png' 
	zombie.className = randomSize() + ' ' + randomSide() 
	zombie.style.position = 'absolute' 
	zombie.style.left = positionx + 'px'
	zombie.style.top = positiony + 'px'
	document.body.appendChild(zombie)
	zombie.id = 'zombie'
	zombie.onclick = function(){ 
		this.remove()
	}

	//randomSize() 
}


function randomSize(){
	var option = Math.floor(Math.random() * 3) 
	switch(option){
		case 0:
			return 'zombie1'
		case 1:
			return 'zombie2'
		case 2:
			return 'zombie3'
	}
}

function randomSide(){
	var side = Math.floor(Math.random() * 2)
	switch(side){
		case 0:
			return 'side-a'
		case 1:
			return 'side-b'
	}
}
