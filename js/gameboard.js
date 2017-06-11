define('js/gameboard', ['js/tile'], function(tile){
  return {
    components: {
      tile: tile
    },

    data() {
      return {
        board: null,
        size: 10,
        started: null,
        finished: null,
        bombs: null
      };
    },

    created(){
      this.startNewGame();
    },

    methods: {
      createNewBoard(){
        this.board = [];
        for(var i=0; i<this.size; i++){
          var row = [];
          for(var j=0; j<this.size; j++){
            var cell = {
              value: 0,
              x: i,
              y: j,
              bomb: false,
              detonated: false,
              hidden: true,
              flagged: false
            };
            row.push(cell);
          }
          this.board.push(row);
        }
      },

      startNewGame(){
        this.started = false;
        this.finished = false;
        this.bombs = [];
        this.createNewBoard();
      },

      putBombs(){
        var bombsToPut = this.size * 2;
        while(bombsToPut){
          var x = Math.floor(Math.random() * this.size);
          var y = Math.floor(Math.random() * this.size);
          if(!this.board[x][y].bomb && !this.isSafeZone(x,y)){
            /*this.board[x][y].bomb = true;
            this.bombs.push({x: x, y: y});*/
            this.putBomb(x,y);
            bombsToPut--;
          }
        }
      },

      putBomb(x,y){
        this.board[x][y].bomb = true;
        this.board[x][y].value = 0;
        this.bombs.push({x: x, y: y}); //temporary
        this.getNeighbours(x,y).forEach(nbr => {
          if(!nbr.bomb){
            nbr.value++;
          }
        });
      },

      getNeighbours(x,y){
        var nbrs = [];
        for(var i=Math.max(0,x-1); i<=Math.min(x+1, this.size-1); i++){
          for(var j=Math.max(0,y-1); j<=Math.min(y+1, this.size-1); j++){
            if(i !== x || j !== y) {
              nbrs.push(this.board[i][j]);
            }
          }
        }
        return nbrs;
      },

      isSafeZone(x,y){
        var sx = this.safeZone.x;
        var sy = this.safeZone.y;
        return ((x <= sx + 1 && x >= sx - 1) && (y <= sy + 1 && y >= sy - 1));
      },

      showCell(x,y){
        var cell = this.board[x][y];
        if(cell.hidden){
          cell.hidden = false;
          if(cell.value === 0){
            this.getNeighbours(x,y).forEach(nbr => this.showCell(nbr.x,nbr.y));
          }
        }
      },

      uncoverCell(x,y){
        var cell = this.board[x][y];
        cell.hidden = false;
      },

      processClick(x,y){
        if(!this.started){
          //FIRST CLICK
          this.started = true;
          this.safeZone = {x: x, y: y};
          this.putBombs();
          //this.calculateNumbers();
        };
        if(this.finished || this.board[x][y].flagged){
          return;
        }
        if(this.board[x][y].bomb){
          //DETONATE
          this.board[x][y].detonated = true;
          this.board.forEach(row => {
            row.forEach(cell =>{
              if(cell.bomb) cell.hidden = false;
            });
          });
          this.finished = true;
        }
        this.showCell(x,y);
      },

      processRightClick(x,y){
        var cell = this.board[x][y];
        if(cell.hidden && !this.finished){
          cell.flagged = cell.flagged ? false : true;
        }
      }
    },

    template:`
      <div>
        <div @click="startNewGame" class="restart">RESTART</div>
        <div class="row" v-for="row in board">
          <tile v-for="cell in row" :key="cell.x + cell.y" :cell="cell" 
            @show="processClick(cell.x,cell.y);" 
            @flag="processRightClick(cell.x,cell.y);">
          </tile>
        </div>
      </div>`
  };
});
