define('js/gameboard', ['js/tile'], function(tile){
  return {
    components: {
      tile: tile
    },
    data: function() {
      return {
        board: [],
        size: 10,
        started: false,
        finished: false,
        bombs: []
      };
    },
    created : function(){
      this.createNewBoard();
    },
    methods: {
      createNewBoard: function(){
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
              //class:'cell'
            };
            row.push(cell);
          }
          this.board.push(row);
        }
      },
      restartGame: function(){
        this.started = false;
        this.finished = false;
        this.bombs = [];
        for(var i=0; i<this.size; i++){
          for(var j=0; j<this.size; j++){
            var cell = this.board[i][j];
            cell.hidden = true;
            cell.detonated = false;
            cell.bomb = false;
            cell.flagged = false;
            cell.value = 0;
          }
        }
      },
      putBombs: function(){
        var bombs_to_put = this.size * 2;
        while(bombs_to_put){
          var x = Math.floor(Math.random() * this.size);
          var y = Math.floor(Math.random() * this.size);
          if(!this.board[x][y].bomb && !this.isSafeZone(x,y)){
            this.board[x][y].bomb = true;
            this.bombs.push({x: x, y: y});
            bombs_to_put--;
          }
        }
      },
      isSafeZone: function(x,y){
        var sx = this.safeZone.x;
        var sy = this.safeZone.y;
        return ((x <= sx + 1 && x >= sx - 1) && (y <= sy + 1 && y >= sy - 1));
      },
      calculateNumbers: function(){
        for(var i=0; i<this.size; i++){
          for(var j=0; j<this.size; j++){
            var cell = this.board[i][j];
            if(!cell.bomb){
              var count = 0;
              for(x=i-1; x<=i+1; x++){
                for(y=j-1; y<=j+1; y++){
                  if(x >=0 && y >= 0 && x < this.size && y < this.size){
                    if((x !== i || y !== j) && this.board[x][y].bomb){
                      count++
                    }
                  }
                }
              }
              cell.value = count;
            }
          }
        }
      },
      showCell: function(x,y){
        var cell = this.board[x][y];
        if(cell.hidden){
          this.uncoverCell(x,y);
          if(cell.value === 0){
            for(var i=x-1; i<=x+1; i++){
              for(var j=y-1; j<=y+1; j++){
                if(i >=0 && j >= 0 && i < this.size && j < this.size){
                    this.showCell(i,j);
                }
              }
            }
          }
        }
      },
      uncoverCell: function(x,y){
        var cell = this.board[x][y];
        cell.hidden = false;
      },
      processClick: function(x,y){
        if(!this.started){
          //FIRST CLICK
          this.started = true;
          this.safeZone = {x: x, y: y};
          this.putBombs();
          this.calculateNumbers();
        };
        if(this.finished || this.board[x][y].flagged){
          return;
        }
        if(this.board[x][y].bomb){
          //DETONATE
          this.board[x][y].detonated = true;
          this.bombs.forEach((cell)=>{
            this.uncoverCell(cell.x,cell.y);
          });
          this.finished = true;
        }
        this.showCell(x,y);
      },
      processRightClick: function(x,y){
        //e.preventDefault();
        var cell = this.board[x][y];
        if(cell.hidden && !this.finished){
          cell.flagged = cell.flagged ? false : true;
        }
      }
    },
    template:`
      <div>
        <div @click="restartGame">RESTART</div>
        <div class="row" v-for="row in board">
          <tile v-for="cell in row" :key="cell.x + cell.y" :cell="cell" 
            @show="processClick(cell.x,cell.y);" 
            @flag="processRightClick(cell.x,cell.y);">
          </tile>
        </div>
      </div>`
  };
});
