var rockShape = [[0, -4], [1, -1], [4, 0], [1, 1], [0, 4], [-1, 1], [-4, 0], [-1, -1], [0, -4]];
var rock = [], numRocks = 25;
function makerocks(WIDTH, HEIGHT){
for(var i = 0; i < numRocks; ++i){
    var sx = Math.random() * WIDTH;
    var sy = Math.random() * HEIGHT;
    var sz = Math.random() * 15 + 1;
    for(var dy = 0; dy <= 2; ++dy){
      for(var dx = 0; dx <= 2; ++dx){
        rock[i + (dy * 3 + dx) * numRocks]
          = new Mobile(rockShape, sx + (dx - 1) * WIDTH, sy + (dy - 1) * HEIGHT, sz);
      }
    }
  }
}