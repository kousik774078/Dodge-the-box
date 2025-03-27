 
    import * as THREE from 'three'
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
  
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(
        0, 1.0243243390978214, 15.026900513738931);
          //x=0.08208678488976971
        
    const audioLoader = new THREE.AudioLoader();
    const listener = new THREE.AudioListener();
    camera.add(listener);

  
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled=true
    document.body.appendChild(renderer.domElement)
  
const controls = new OrbitControls(camera, renderer.domElement)
    

let backgroundMusic, jumpSound, collisionsound; // Declare variables for your audio

audioLoader.load('audio\bg_music.mp3', function(buffer) {
    backgroundMusic = new THREE.Audio(listener); // We'll discuss 'listener' next 
    backgroundMusic.setBuffer(buffer);
    backgroundMusic.setLoop(true); 
    backgroundMusic.setVolume(1); 
     
},function(error){console.log(error)}); 

let collisionSound; 

audioLoader.load('audio\cute-level-up-2-189851.mp3', function(buffer) {
    collisionSound = new THREE.Audio(listener); 
    collisionSound.setBuffer(buffer);
    collisionSound.setVolume(1); 

});


// audioLoader.load('sounds/jump.wav', function(buffer) {
//     jumpSound = new THREE.Audio(listener);
//     jumpSound.setBuffer(buffer);
// });

// Inside your game initialization or 'start' function



    class Box extends THREE.Mesh{
        constructor({
            width,
            height,
            depth,
            flag = 0,
            color = '#00ff00',
            velocity={
                x:0,
                y:0,
                z:0
            },
            position={
                x:0,
                y:0,
                z:0
            },
            zAcceleration = false
        }) {
            super(new THREE.BoxGeometry(width,height,depth),new THREE.MeshStandardMaterial({ color: color }))
            this.width=width
            this.height=height
            this.depth=depth
            if(color==='yellow'){
                this.flag=1
            }
            else{
                this.flag=0
            }

            this.position.set(position.x, position.y, position.z)  //can't directly set "this.position" since it is a read only property of THREE.Mesh hence "this.position.set()"

            this.right = this.position.x + this.width/2
            this.left = this.position.x - this.width/2
            
            this.bottom= this.position.y - this.height / 2
            this.top = this.position.y + this.height/2
            
            this.front = this.position.z - this.depth/2
            this.back = this.position.z + this.depth/2

            this.velocity = velocity
            this.gravity = -0.004

            this.zAcceleration = zAcceleration

        }


        updateSides(){
            this.bottom= this.position.y - this.height / 2
            this.top = this.position.y + this.height / 2

            this.right = this.position.x + this.width/2
            this.left = this.position.x - this.width/2

            this.front = this.position.z - this.depth/2
            this.back = this.position.z + this.depth/2
        }

        update(ground){
            this.updateSides()

            if(this.zAcceleration){this.velocity.z +=0.001}

            this.position.x += this.velocity.x
            this.position.z += this.velocity.z            
            this.applyGravity(ground)
        }

        applyGravity(ground){
            this.velocity.y += this.gravity
            // this.position.y += this.velocity.y

            if(boxCollision({
                box1:this,
                box2:ground})) 
            {   
                const friction = 0.5 
                this.velocity.y *= friction
                this.velocity.y= -this.velocity.y}
            else this.position.y += this.velocity.y
        }
    }

    function boxCollision({box1,box2}){//checking for boundary overlap
            //detect for collision
            const xCollision = (box1.right >= box2.left) && (box1.left <= box2.right);
            const zCollision = (box1.front <= box2.back) && (box1.back >= box2.front);
        const yCollision = (box1.bottom + box1.velocity.y <= box2.top) && (box1.top >= box2.bottom);
        
            
            return (xCollision && yCollision && zCollision)
    }
    
    let score = 0;
    const scoreDisplay = document.getElementById("score-display")
    function updateScoreDisplay() {
        scoreDisplay.innerText = "Score: " + score;
    }
localStorage.setItem("highScore", 0);
const highscoredisplay = document.getElementById
("high-score-display")
let highScore = localStorage.getItem("highScore") || 0;
function updateHighScoreDisplay() {
        highscoredisplay.innerText="High Score: " +highScore
}
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        updateHighScoreDisplay();
        }
    }

    const cube = new Box({ //creating a new class so that we can have parameters like height depth and width in a cleaner way
        width: 1,
        height: 1,
        depth: 1,
        velocity:{
            x:0,
            y:-0.01,
            z:0
        },
        position:{
                x:0,
                y:0,
                z:10
            }
    })
    cube.castShadow=true
    scene.add(cube)
 
    const ground = new Box({
        width:10,
        height:0.5,
        depth:50,
        color:'#0369a1',
        position:{
            x:0,
            y:-2,
            z:0
        }
    })

    
    ground.receiveShadow=true
    scene.add(ground)

    const light = new THREE.DirectionalLight(0xffffff,1)
    light.castShadow=true
    light.position.z=1
    light.position.y=3
    scene.add(light)

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))

    // ... your existing code ...

const instructionsOverlay = document.getElementById("instructions-overlay");
const startButton = document.getElementById('start-button');

startButton.addEventListener('click', function() {
    instructionsOverlay.classList.add("hidden"); // Hide instructions
    animate(); // Start your animation loop
});

// Initially show instructions
instructionsOverlay.classList.remove("hidden"); 

// ... rest of your game code ...


    const keys={
        w:{pressed:false},
        a:{pressed:false},
        s:{pressed:false},
        d:{pressed:false}
    }

    window.addEventListener('keydown',(event) =>{
        switch(event.code){
            case 'KeyW':
                keys.w.pressed=true
                break;
            case 'KeyA':
                keys.a.pressed=true
                break;
            case 'KeyS':
                keys.s.pressed=true
                break;
            case 'KeyD':
                keys.d.pressed=true
                break;
            case 'Space':
                cube.velocity.y=0.12;
                break;
        }
    })

    window.addEventListener('keyup',(event) =>{
        switch(event.code){
            case 'KeyW':
                keys.w.pressed=false
                break;
            case 'KeyA':
                keys.a.pressed=false
                break;
            case 'KeyS':
                keys.s.pressed=false
                break;
            case 'KeyD':
                keys.d.pressed=false
                break;
        }
    })

    const enemies = [];

    let jumpallow = true;
    let frames = 0;
    let framerate = 100;

    let color_probabilities = ['red','red','red','red','red','red','red','red','red','red','red','yellow']
    // let box_color = ''
    function color_randomiser(len){
        return color_probabilities[Math.floor(Math.random()*len)]
}
    
    const restartOverlay = document.getElementById("restart-overlay");

    document.body.addEventListener('keydown', (event) => {
                // console.log(event)
            if (event.code === 'KeyP') {
                score = 0;
                enemies.forEach(enemy => {
                    scene.remove(enemy);
                })
                enemies.length = 0;
                frames = 0;
                framerate = 100;
                restartOverlay.classList.add("hidden");
                cube.position.x = 0;
                cube.position.y = 0;
                cube.position.z = 10;
                animate();
            }
            
    })

function fallingOverEdge({ box1, box2 }) {
        return (box1.top<box2.bottom)
    }

    function animate() {
        console.log(camera.position.x,camera.position.y,camera.position.z)
        if (backgroundMusic) {
        backgroundMusic.play();
        }  
      
        frames++;         
      if(framerate>10){
        framerate--;
      }
      const animationFrameID = requestAnimationFrame(animate)
      renderer.render(scene, camera)

      if(frames % framerate === 0){

        const enemy = new Box({ //creating a new class so that we can have parameters like height depth and width in a cleaner way
        width: 1,
        height: 1,
        depth: 1,
        flag:0,
        velocity:{
            x:0,
            y:-0.01,
            z:0.01
        },
        position:{
            x:( Math.random()-0.5 )* 10,
            y: 0,
            z: -20
        },
        color:color_randomiser(color_probabilities.length),
        zAcceleration:true
        })

        enemy.castShadow=true
        scene.add(enemy)
        enemies.push(enemy);
      }
        if (cube.bottom - 0.1 < ground.top  && frames % framerate === 0) {
            score++;
            updateScoreDisplay();
        }
        
        if (fallingOverEdge({
            box1: cube,
            box2: ground
        })) {
            cancelAnimationFrame(animationFrameID) 
            updateHighScore();
            restartOverlay.classList.remove("hidden");
        }
      enemies.forEach(enemy => {
        enemy.update(ground)
        if (boxCollision({
            box1: cube,
            box2: enemy
        })){
            if(enemy.flag===0){
                cancelAnimationFrame(animationFrameID) 
                updateHighScore();
                restartOverlay.classList.remove("hidden");
            }
            else{
                scene.remove(enemy);
                score++;
                updateScoreDisplay();
                if (collisionSound) {
                collisionSound.play();  // Play the sound
            } 
            }
        }
      })
        
        
      //movement code
      cube.velocity.x=0
        cube.velocity.z = 0
      
    if(keys.a.pressed) cube.velocity.x = -0.08
    else if(keys.d.pressed) cube.velocity.x = 0.08
    if(keys.s.pressed) cube.velocity.z = 0.08
    else if(keys.w.pressed) cube.velocity.z = -0.08
    cube.update(ground)
    //   cube.position.y += -0.01
    //   cube.rotation.x += 0.01
    //   cube.rotation.y += 0.01
}

// const startButton = document.getElementById('start-button');
// startButton.addEventListener('click', function() {
//     animate(); // Start your animation
//     backgroundMusic.play(); // Initiate playback directly here
// });



    

   
