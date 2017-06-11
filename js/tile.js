define('js/tile', [], function(){
  return {
    props: ['cell'],
    methods: {
      handleClick: function(){
        this.$emit('show');
      },
      handleRightClick: function(e){
        e.preventDefault();
        this.$emit('flag');
      }
    },
    template:`<div class="cell"
                :class="{
                  shown: !cell.hidden,
                  flagged: cell.flagged,
                  boom: cell.detonated,
                  color1: cell.value == 1,
                  color2: cell.value == 2,
                  color3: cell.value == 3,
                  color4: cell.value == 4,
                  color5: cell.value == 5,
                }" 
                @click="handleClick"
                @contextmenu="handleRightClick($event);"
              >
                  <span v-if="cell.bomb && !cell.hidden">*</span>
                  <span v-if="cell.value && !cell.hidden">{{cell.value}}</span>
              </div>`
  };
});
