var starShape = [[0, -4], [1, -1], [4, 0], [1, 1], [0, 4], [-1, 1], [-4, 0], [-1, -1], [0, -4]];
var star = [];
function makeStars(WIDTH, HEIGHT, numStars){
  for(var i = 0; i < numStars; ++i){
    star[i] = new Mobile(
      starShape, 
      Math.random() * WIDTH - WIDTH / 2, 
      Math.random() * HEIGHT - HEIGHT / 2, 
      Math.round(Math.random() * 19 + 1));
  }
}