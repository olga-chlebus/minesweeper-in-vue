define('js/tile', [], function(){
  return {
    props: ['cell'],
    methods: {
      handleClick(){
        this.$emit('show');
      },
      handleRightClick(e){
        e.preventDefault();
        this.$emit('flag');
      }
    },
    template:`<div class="cell"
                :class="[{
                  shown: !cell.hidden,
                  flagged: cell.flagged,
                  boom: cell.detonated,
                }, 'color' + cell.value]" 
                @click="handleClick"
                @contextmenu="handleRightClick($event);"
              >
                  <span v-if="cell.bomb">*</span>
                  <span v-if="cell.value">{{cell.value}}</span>
              </div>`
  };
});
