var game = new Phaser.Game(600, 600, Phaser.AUTO, "sweeper", {
    preload: function() {
        game.load.spritesheet('mine', 'assets/minesweeper.png',16,16);
        game.load.spritesheet('tile', 'assets/tile.png',16,16);
    },
    
    create: function() {
        game.grid = new MineGrid(8,8,10);
    },
    
    update: function() {
        game.grid.update();
    }
});