var menuState = {
    preload: function() {
        
    },
    
    create: function() {
        
    },
    
    update: function() {
        if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR))
        {
            game.state.start('gameplay', true);
        }
    }
};

var gameplayState =  {
    preload: function() {
        game.load.spritesheet('mine', 'assets/minesweeper.png',16,16);
        game.load.spritesheet('tile', 'assets/tile.png',16,16);
    },
    
    create: function() {
        game.grid = new MineGrid(16,16,32);
    },
    
    update: function() {
        game.grid.update();
    }
};

var game = new Phaser.Game(600, 600, Phaser.AUTO, "sweeper");
game.state.add('menu', menuState, true);
game.state.add('gameplay', gameplayState);