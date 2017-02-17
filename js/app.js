var VERTICAL_PLAYER_STEP = 80;
var HORIZONTAL_PLAYER_STEP = 102;
var MAX_STEPS = {
    'left': -4
    , 'right': 404
    , 'top': -10
    , 'down': 390
};
var INIT_PLAYER_POSITION = {x: 200, y:390};

var ENEMY_VERTICAL_POSITIONS = [
    60, 145, 230
];
var INIT_ENEMY_HORIZONTAL_POSITION = -70;

var Sprite = function (resource, x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.sprite = resource;
};
Sprite.prototype.update = function (dt) {
    // override
};
Sprite.prototype.collision = function () {
    // override
};
Sprite.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function() {
    var x = INIT_ENEMY_HORIZONTAL_POSITION;
    var random_vertical_position = Math.floor(Math.random() * ENEMY_VERTICAL_POSITIONS.length) + 1;
    var y = ENEMY_VERTICAL_POSITIONS[random_vertical_position - 1];

    Sprite.call(this, 'images/enemy-bug.png', x, y);
    this.speed = Math.floor(Math.random() * 250) + 100;
    this.stop = false;
    this.vertical_position = random_vertical_position;
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    //this.sprite = 'images/enemy-bug.png';
};
Enemy.prototype = Object.create(Sprite.prototype);
Enemy.prototype.constructor = Enemy;
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;
    if (this.x > 500) {
        this.stop = true;
    }
};
/*
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
*/

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (x, y) {
    Sprite.call(this, 'images/char-boy.png', x, y);
    this.finish = false;
    this.resetPosition = function () {
        this.x = x;
        this.y = y;
    }
};
Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    if (this.finish) {
        this.resetPosition();
        this.finish = false;
    } else if (this.y === MAX_STEPS.top) {
        this.finish = true;
    } 
};
Player.prototype.handleInput = function (key) {
    if (key) {
        var step = {
            x: this.x
            , y: this.y
        };

        switch (key) {
            case 'up':
                step.y -= VERTICAL_PLAYER_STEP; 
                break;
            case 'down':
                step.y += VERTICAL_PLAYER_STEP;
                break;
            case 'left':
                step.x -= HORIZONTAL_PLAYER_STEP;
                break;
            case 'right':
                step.x += HORIZONTAL_PLAYER_STEP;
                break;
        }

        if (step.y >= MAX_STEPS.top && step.y <= MAX_STEPS.down) {
            this.y = step.y;
        }
        if (step.x >= MAX_STEPS.left && step.x <= MAX_STEPS.right) {
            this.x = step.x;
        }
    }
};
Player.prototype.collision = function () {
    var exists_collision = false;
    var count_enemies = allEnemies.length;
    var inx = 0;
    while (!exists_collision && inx < count_enemies) {
        var enemy = allEnemies[inx];
        var horizontal_collision_margin = 50;
        var vertical_collision_margin = 10;
        if (this.x <= (enemy.x + horizontal_collision_margin)
            && this.x >= (enemy.x - horizontal_collision_margin)
            && this.y <= (enemy.y + vertical_collision_margin)
            && this.y >= (enemy.y - vertical_collision_margin)
        ) {
            exists_collision = true;
        }
        inx++;
    }

    if (exists_collision) {
        this.resetPosition();
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player(INIT_PLAYER_POSITION.x, INIT_PLAYER_POSITION.y);

var enemyGenerator = setInterval(function () {
    allEnemies.push(new Enemy());
}, 1000);
var enemyGarbageCollector = setInterval(function () {
    var listToDelete = [];
    allEnemies.forEach(function (enemy) {
        if (enemy.stop) {
            listToDelete.push(enemy);
        }
    });
    
    listToDelete.forEach(function (enemy) {
        var enemy_index = allEnemies.indexOf(enemy);
        allEnemies.splice(enemy_index, 1);
    });
    
}, 1000);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
