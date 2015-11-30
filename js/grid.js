//Minesweeper Grid
function MineGrid(width, height, mines) {
    this.w = width;
    this.h = height;
    this.m = mines;
    
    //Reference to the mines in the field
    this.mines = [];
    this.tile = [];
    
    this.mine_size = 16;
    this.graphics = game.add.graphics((game.world.width - this.w*this.mine_size)/2, (game.world.height - this.h*this.mine_size)/2);
    
    for(var x=0; x < width; x++)
    {
        var row = [];
        for(var y=0; y < height; y++)
        {
            row.push(new MineSlot(this, x, y, 0));
        }
        this.tile.push(row);
    }
    
    for(var i=0; i<this.m; i++)
    {
        var randX = Math.floor(Math.random()*this.w);
        var randY = Math.floor(Math.random()*this.h);
        var c = this.tile[randX][randY].contents;
        if (c == '*')
        {
            i--;
            continue;
        }
        else this.tile[randX][randY].setContents('*');
    }
    
    this.update = function() {
        for(var x=0; x < width; x++)
        {
            for(var y=0; y < height; y++)
            {
                this.tile[x][y].update();
            }
        }
    };
    
    this.gameOver = function() {
        alert("Game Over!");
    };
}

//Grid Slots
function MineSlot(grid, x, y, contents) {
    this.grid = grid;
    this.x = x;
    this.y = y;
    this.contents = contents;
    this.hidden = true;
    
    this.graphics = game.add.graphics(x*this.grid.mine_size, y*this.grid.mine_size);
    this.tileSprite = game.add.sprite(0, 0, 'tile');
    this.tileSprite.inputEnabled = true;
    
    this.graphics.addChild(this.tileSprite);
    this.grid.graphics.addChild(this.graphics);
    
    this.tileSprite.events.onInputDown.add(function() {
        if (this.hidden)
        {
            this.hidden = false;
            if (this.contents == '*') this.grid.gameOver();
        }
    }, this);
    
    this.setContents = function(contents)
    {
        if (contents == '*')
            this.contentSprite = game.add.sprite(0, 0, 'mine', 0);
        else if (contents > 0)
            this.contentSprite = game.add.sprite(0, 0, 'mine', contents);
        this.contentSprite.moveDown();
        this.graphics.addChild(this.contentSprite);
    }
    
    this.update = function()
    {
        this.tileSprite.visible = this.hidden;
        if (this.contentSprite != undefined) this.contentSprite.visible = !this.hidden;
    }
}