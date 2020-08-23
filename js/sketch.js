//global variables
var player, jungle, ground; 
var backImg, bananaImg, obstacleImg;
var foodGroup, obstacleGroup;
var score, timesTouched, timesReduced;
var gameState;
var textSprite;

function preload()
{
    //loading the images and animations
    backImg = loadImage("images/jungle.jpg");

    playerAnimation = loadAnimation("images/Monkey_01.png","images/Monkey_02.png",
    "images/Monkey_03.png","images/Monkey_04.png","images/Monkey_05.png","images/Monkey_06.png",
    "images/Monkey_07.png","images/Monkey_08.png","images/Monkey_09.png","images/Monkey_10.png");

    bananaImg = loadImage("images/Banana.png");
    obstacleImg = loadImage("images/stone.png");
}

function setup()
{
    //creating the canvas
    createCanvas(displayWidth,displayHeight);

    //declaring values for the main variables
    gameState = 1;
    timesTouched = 0;
    timesReduced = 0;
    score = 0;

    //creating groups for objects
    foodGroup = new Group();
    obstacleGroup = new Group();
    
    //creating sprite for background
    jungle = createSprite(displayWidth/2,displayHeight/2,displayWidth,displayHeight);
    jungle.addImage("background",backImg);
    jungle.scale = 3;
    jungle.x = jungle.width/2;

    //creating sprite for player
    player = createSprite(displayWidth/6, displayHeight*8.5/10, displayWidth/30, displayHeight/6);
    player.addAnimation("player",playerAnimation);
    player.scale = 0.2;

    //creating the invisible ground
    ground = createSprite(displayWidth/2, displayHeight*8.5/10 +displayHeight/10, displayWidth, displayHeight/24);
    ground.visible = false;

    textSprite = createSprite(displayWidth*4/6,displayHeight/5);
    textSprite.visible = false;
}

function draw()
{
    //giving background
    background(255);

    //commands to executed if gameState = 1
    if(gameState === 1)
    {
        //making camera move with invisible ground
        camera.position.x = ground.x;
        
        //assigning velocities to player and invisible ground
        player.velocityX = displayWidth/500;
        ground.velocityX = displayWidth/500;
        textSprite.velocityX = displayWidth/500;

        //reseting the camera 
        if(camera.position.x > jungle.x+jungle.width/2)
        {
            player.position.x = displayWidth/6;
            ground.position.x = displayWidth/2;
            textSprite.x = displayWidth*4/6;
        }

        //creating food
        if(frameCount % 80 === 0)
        {
            food();
        }

        //creating obstacles
        if(frameCount % 300 === 0){
            obstacles();
        }

        player.collide(ground);

        player.velocityY = player.velocityY + displayHeight/100;

        if(keyWentDown("space") && player.y < displayHeight *6/7 && player.y > displayHeight * 0.844)
        {
            player.velocityY = player.velocityY - displayHeight/12;
        }

        if(obstacleGroup.isTouching(player)){
            timesReduced++;
            obstacleGroup.destroyEach();
        }

        if(timesReduced === 2)
        {
            gameState = 2;
        }

        score = timesTouched + (Math.round(frameCount/getFrameRate()));

        if(foodGroup.isTouching(player)){
            timesTouched = timesTouched+2;
            foodGroup.destroyEach();
        }
    }

    if(gameState === 2)
    {
        player.velocityX = 0;
        ground.velocityX = 0;
        textSprite.velocityX = 0;
        score = 0;
        timesTouched = 0;
        timesReduced = 0;
        player.collide(ground);
    }

    drawSprites();

    stroke("white");
    textSize(displayWidth/30);
    fill("white");

    text("SCORE: "+score,textSprite.x,textSprite.y);

}

function food(){
    //creating the sprite for the bananas and loading their image
    var banana = createSprite(displayWidth,displayHeight/100,10,10);
    banana.addImage(bananaImg);

    //scaling them and giving them velocity
    banana.scale = 0.05;
    banana.velocityX = -displayWidth/50;

    //reassigning a random y position
    banana.y = random(displayHeight/2,displayHeight/1.5);

    //assigning lifetime and adding them to group
    banana.lifetime = 50;
    foodGroup.add(banana);
} 

function obstacles(){
    //creating sprites for obstacles and loading their image
    var obstacle = createSprite(displayWidth,displayHeight*9/10,10,10);
    obstacle.addImage(obstacleImg);
    
    //scaling them and giving them velocity
    obstacle.scale = 0.09;
    obstacle.velocityX = obstacle.velocityX = -displayWidth/100;
    
    //giving them lifetime and adding them to the group
    obstacle.lifetime = 100;
    obstacleGroup.add(obstacle);
  }