var ship = new Mobile(
  [[-10, -7], [10, 0], [-10, 7], [-5, 0], [-10, -7]], 
  0, 0, 10, 0, 0.01);

var bullet = [], numBullets = 3, curBullet = 0, MAX_BULLET_AGE = 2000, BULLET_SPEED = 0.05;
var pingX = [], pingY = [], pingAge = [], pingR = [], pingD = [], numPings = 3, curPing = 0, MAX_PING_AGE = 10000;

for(var i = 0; i < numBullets; ++i){
  bullet[i] = new Mobile([[-1, 0], [0, 1], [1, 0], [0, -1]]);
}

for(var i = 0; i < numPings; ++i){
  pingX[i] = pingY[i] = pingAge[i] = pingR[i] = pingD[i] = 0;
}

lib.keyHandler.add(65, 0, function(){
  ship.dda = -da;
});

lib.keyHandler.add(68, 0, function(){
  ship.dda = da;
});

lib.keyHandler.add(87, 0, function(){
  ship.ddx = lib.cos(ship.a) * spd;
  ship.ddy = lib.sin(ship.a) * spd;
});

lib.keyHandler.add(83, 0, function(){
  ship.ddx = -lib.cos(ship.a) * spd;
  ship.ddy = -lib.sin(ship.a) * spd;
});

lib.keyHandler.add(32, 250, function(){
  if(bullet[curBullet].ttl <= 0){
    bullet[curBullet].init(ship.x, ship.y, 10, 
      ship.a, 0, MAX_BULLET_AGE, 0, 0, 0, 
      BULLET_SPEED * lib.cos(ship.a), BULLET_SPEED * lib.sin(ship.a), 1);
    curBullet = (curBullet + 1) % numBullets;
  }
});

lib.keyHandler.add(69, 500, function(){
  if(pingAge[curPing] <= 0){
    pingX[curPing] = ship.x;
    pingY[curPing] = ship.y;
    pingAge[curPing] = MAX_PING_AGE;
    pingR[curPing] = 0;
    pingD[curPing] = 0.05;
    curPing = (curPing + 1) % numPings;
  }
});