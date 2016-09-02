//Minesweeper Grid
function MineGrid(width, height, mines, treasures) {
    this.w = width;
    this.h = height;
    this.m = mines;
    this.t = treasures;
    
    //Reference to the mines in the field
    this.mines = [];
    this.treasures = [];
    this.tile = [];
    
    this.mine_size = 16;
    this.mine_border = 2;
    this.graphics = game.add.graphics((game.world.width - this.w*(this.mine_size+this.mine_border))/2, (game.world.height - this.h*(this.mine_size+this.mine_border))/2);
    
    this.ended = false;
    
    this.hiddenTiles = width*height;
    
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
        if (c == '*' || c == '#')
        {
            i--;
            continue;
        }
        
        var mine = this.tile[randX][randY];
        mine.setContents('*');
        this.mines.push(mine);
        var n = mine.neighbors();
        for (var j in n)
        {
            n[j].increment();
        }
    }
    
    for(var i=0; i<this.t; i++)
    {
        var randX = 1 + Math.floor(Math.random()*(this.w-2));
        var randY = 1 + Math.floor(Math.random()*(this.h-2));
        var c = this.tile[randX][randY].contents;
        if (c == '*' || c == '#')
        {
            i--;
            continue;
        }
        
        var chest = this.tile[randX][randY];
        chest.setContents('#');
        this.treasures.push(chest);
        var n = chest.neighbors();
        for (var j in n)
        {
            n[j].increment();
        }
    }
    
    this.update = function() {
        for(var x=0; x < width; x++)
        {
            for(var y=0; y < height; y++)
            {
                this.tile[x][y].update();
            }
        }
        
        if (!this.ended)
        {
            //Only the mines remain covered
            if (this.hiddenTiles == this.m)
            {
                this.gameOver(true);
            }
        }
        
        if (this.ended && game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR))
        {
            game.state.restart(true);
        }
    };
    
    this.gameOver = function(success) {
        var success = success || false; //By default, it's a loss case
        
        alert("Game Over!");
        this.ended = true;
        for(var m in this.mines)
        {
            this.mines[m].hidden = false;
        }
    };
}

//Grid Slots
function MineSlot(grid, x, y, contents) {
    this.grid = grid;
    this.x = x;
    this.y = y;
    this.contents = contents;
    this.hidden = true;
    this.marked = false;
    
    this.graphics = game.add.graphics(x*(this.grid.mine_size+this.grid.mine_border), y*(this.grid.mine_size+this.grid.mine_border));
    this.tileSprite = game.add.sprite(1, 1, 'tile');
    this.tileSprite.inputEnabled = true;
    
    this.graphics.addChild(this.tileSprite);
    this.grid.graphics.addChild(this.graphics);
    
    this.click = function()
    {
        if (!this.grid.ended && this.hidden)
        {
            if (game.input.mouse.event.button == 2) //Right button
            {
                this.marked = !this.marked;
            }
            else
            {
                if (!this.marked)
                {
                    this.hidden = false;
                    this.grid.hiddenTiles--;
                    if (this.contents == '*') this.grid.gameOver();
                    if (this.contents == 0)
                    {
                        var N = this.neighbors();
                        for (var i in N)
                        {
                            N[i].click();
                        }
                    }
                }
            }
            
        }
    };
    this.tileSprite.events.onInputDown.add(this.click, this);
    
    this.neighbors = function()
    {
        var neighbors = [];
        for (var dx=-1; dx<=1; dx++)
        {
            for (var dy=-1; dy<=1; dy++)
            {
                if (this.x+dx < 0 || this.x+dx >= this.grid.w || this.y+dy < 0 || this.y+dy >= this.grid.h || (dx == 0 && dy == 0)) continue;
                neighbors.push(this.grid.tile[this.x+dx][this.y+dy]);
            }
        }
        return neighbors;
    }
    
    this.setContents = function(contents)
    {
        this.contents = contents;
        if (this.contentSprite == undefined)
        {
            if (contents == '*')
                this.contentSprite = game.add.sprite(1, 1, 'mine', 0);
            else if (contents == '#')
                this.contentSprite = game.add.sprite(1, 1, 'mine', 0);
            else if (contents > 0)
                this.contentSprite = game.add.sprite(1, 1, 'mine', contents);
                
            this.contentSprite.moveDown();
            this.graphics.addChild(this.contentSprite);
        }
        else
        {
            if (contents == '*')
                this.contentSprite.frame = 0;
            else if (contents > 0)
                this.contentSprite.frame = contents;
        }
    }
    
    this.increment = function(delta)
    {
        if (delta == undefined) delta = 1;
        if (this.contents == '*')
        {
            console.warn("Incrementing content value of a non-numeric tile at " + this.x + ":" + this.y);
            return;
        }
        
        this.contents = this.contents+delta;
        this.setContents(this.contents);
    }
    
    this.update = function()
    {
        this.tileSprite.visible = this.hidden;
        if (this.marked) 
            this.tileSprite.tint = 0xff0000;
        else
            this.tileSprite.tint = 0xffffff;
        if (this.contentSprite != undefined) this.contentSprite.visible = !this.hidden;
    }
}