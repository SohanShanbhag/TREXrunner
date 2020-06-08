var trex, trex_running, trex_collided;
var ground, groundImg, invisiGround;

var obstacleGroup, cloudGroup;

var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var cloud, cloudImg;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var score = 0;

var gameOver, gameOverImg;
var restart, restartImg;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImg = loadImage("ground2.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  cloudImg = loadImage("cloud.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}  

function setup() {
  createCanvas(800,300);
  
  trex = createSprite(50,250);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,280,600,5);
  ground.addImage("ground", groundImg);
  
  invisiGround = createSprite(200,285,400,8.5);
  invisiGround.visible = false;
  
  cloudGroup = new Group();
  obstacleGroup = new Group();
  
  gameOver = createSprite(370,120);
  gameOver.addImage("gameOver", gameOverImg);
  gameOver.scale = 0.75;
  gameOver.visible = false;
  
  restart = createSprite(380,170);
  restart.addImage("restart", restartImg);
  restart.scale = 0.75;
  restart.visible = false;
}

function draw() {
  background("white");
  
  trex.collide(invisiGround);
  
  if(gameState === PLAY){
    
    score = score + Math.round(World.frameRate / 60);
    
    ground.velocityX = -(6 + 3*score/100);

    resetGround();

    if(keyDown("space") && trex.y >= 257 ) {
      trex.velocityY = -12;
    }

    trex.velocityY = trex.velocityY + 0.8;

    spawnObstacles();
    spawnClouds();
    
    if(obstacleGroup.isTouching(trex)){
      gameState = END;
    }
  }
  
  else if (gameState === END){
    trex.changeAnimation("collided",trex_collided);
    
    ground.velocityX = 0;
    
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    
    trex.velocityY = 0;
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    
    gameOver.visible = true;
    restart.visible = true;
    
    if(mousePressedOver(restart)){
      reset(); 
    }
  }
  
  drawSprites();
  
  fill("black");
  text("Score: " + score,600,150);
}

function resetGround() {
  if(ground.x < 0){
    ground.x = ground.width / 2;
  }
}

function spawnObstacles(){
  if(World.frameCount % 90 === 0){
    obstacle = createSprite(800,265);
    obstacle.velocityX = -(6 + 3*score/100);
    obstacle.scale = 0.5;
    var rand = Math.round(random(1,6));
    
    switch (rand){
      case 1: obstacle.addImage(obstacle1);
              break;
              
      case 2: obstacle.addImage(obstacle2);
              break;
          
      case 3: obstacle.addImage(obstacle3);
              break;
              
      case 4: obstacle.addImage(obstacle4);
              break;
              
      case 5: obstacle.addImage(obstacle5);
              break;
          
      case 6: obstacle.addImage(obstacle6);
              break;
              
      default : break;
    }
    
    obstacle.lifetime = 150;
    
    obstacleGroup.add(obstacle);
  }
}

function spawnClouds(){
  if(World.frameCount % 60 === 0){
    cloud = createSprite(800,random(180,220));
    cloud.addAnimation("cloud", cloudImg);
    cloud.velocityX = -4;
    cloud.scale = 0.5;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloud.lifetime = 200;
    
    cloudGroup.add(cloud);
  }  
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
  score = 0;
  
}