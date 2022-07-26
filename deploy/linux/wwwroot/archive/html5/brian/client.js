(define brian (new Fish MID_WIDTH MID_HEIGHT))
(define shark (new Shark 100 MID_HEIGHT))
(define bubbles [])
(define plants null)
(define fish null)
(define jellies null)

(define (makeJellies i)
    (set! jellies [])
    (while (> i 0)
        (jellies.push (new Jelly (+ MID_WIDTH (rand MID_WIDTH)) (rand MID_HEIGHT)))
        (set! i (- i  1)))
        undefined)

(makeJellies 5)

(define (makePlants i)
    (set! plants [])
    (while (> i 0)
        (plants.push (new Plant (rand WIDTH) HEIGHT (+ 5 (rand 15))))
        (set! i (- i  1)))
    undefined)

(makePlants 40)

(define (makeFish i)
    (log "fish")
    (set! fish [])
    (while (> i 0)
        (fish.push (new Fish (rand WIDTH) (rand HEIGHT)))
        (set! i (- i  1)))
    undefined)

(makeFish 20)

(define G 0.00005)

(define (clrscrn)
    (define y 0)
    (define b 127)
    (define s (/ (* BAND_SIZE b) MID_HEIGHT))
    (while (< y MID_HEIGHT)
        (set! g.fillStyle (rgba 0 0 (Math.floor b) 1))
        (g.fillRect 0 y WIDTH BAND_SIZE)
        (set! y (+ BAND_SIZE y))
        (set! b (- b s)))
    (set! g.fillStyle (rgba 0 0 0 1))
    (g.fillRect 0 MID_HEIGHT WIDTH MID_HEIGHT))

(define lt (time))
(define BAND_SIZE 20)
(define vDown (new Vector (Math.floor (/ -WIDTH BAND_SIZE)) 1))
(define vRight (new Vector 1 0))
(noise.seed (Math.random))
(define BLOCK_SIZE (* 2 BAND_SIZE))
(define BLOCKS_WIDE (Math.floor (/ WIDTH BLOCK_SIZE)))
(define BLOCKS_HI (Math.floor (/ HEIGHT BLOCK_SIZE)))
(define (draw-cave)
    (define start (- (Math.floor (/ (- brian.loc.x MID_WIDTH) BLOCK_SIZE)) 10))
    (define end (+ (Math.floor (/ (+ brian.loc.x MID_WIDTH) BLOCK_SIZE)) 10))
    (g.save)
    (g.scale BLOCK_SIZE BLOCK_SIZE)
    (while (<= start end)        
        (draw-block start 0)
        (draw-block start BLOCKS_HI)
        (set! start (+ 1 start)))
    (g.restore))

(define (draw-block left top)
    (define v (Math.floor (* 5 (+ 1 (noise.simplex2 left top)))))
    (when (>= v 7)
        (set! v (- v 2))
        (define half (Math.floor (/ v -2)))
        (define y half)
        (while (< y v)
            (define x half)
            (while (< x v)
            (when (and (> (+ x left) BLOCKS_WIDE) 
                       (< (+ (Math.abs x) (Math.abs y)) v))
                    (set! g.fillStyle (rgba 127 127 0 255))
                    (g.fillRect (+ x left) (+ y top) 1 1))
                (set! x (+ 1 x)))
            (set! y (+ 1 y)))
        undefined))

(setInterval (lambda ()
    (define t (time))
    (define dt (- t lt))
    (set! lt t)
    
    (clrscrn)
    (g.save)
    
    (g.translate (- MID_WIDTH brian.loc.x) 0)
    (draw-cave)
    (set! bubbles (bubbles.concat (boids fish dt)))
    (set! bubbles (bubbles.concat (brian.update dt)))

    (brian.draw)
    (fish.forEach (lambda (obj) (obj.draw)))
    (shark.update dt)
    (shark.draw)
    (bubbles.forEach (lambda (obj) (obj.update dt) (obj.draw)))
    (plants.forEach (lambda (obj) (obj.update dt) (obj.draw)))

    (set! bubbles (bubbles.filter (lambda (b) (> b.loc.y 0))))
    (g.restore)
    undefined) 15)

(define (move ddx ddy)
    (set! brian.spd (brian.spd.add (new Vector ddx ddy))))

(define (moveLeft)
    (move -0.1 0))

(define (moveRight)
    (move 0.1 0))

(define (moveUp)
    (move 0 -0.2))

(define (moveDown)
    (move 0 0.05))

(define (movePoint x y)
    (if (< x brian.loc.x)
        (moveLeft)
        (moveRight))
    (if (< y brian.loc.y)
        (moveUp)
        (moveDown)))

(on window:keydown (lambda (evt)
    (if (or (= evt.keyCode UP)
            (= evt.keyCode W_KEY))
        (moveUp)
        (when (or (= evt.keyCode DOWN)
                  (= evt.keyCode S_KEY))
            (moveDown)))

    (if (or (= evt.keyCode LEFT)
            (= evt.keyCode A_KEY))
        (moveLeft)
        (when (or (= evt.keyCode RIGHT)
                  (= evt.keyCode D_KEY))
            (moveRight)))

    (when (not (or evt.ctrlKey (= evt.keyCode ALT)))
        (evt.preventDefault))
        undefined))

(if (in "touchstart" window)
    (on window:touchstart (lambda (evt)
        (define touches (Array.prototype.slice.call evt.changedTouches))
        (while (> touches.length 0)
            (define touch (touches.pop))
            (define x touch.clientX)
            (define y touch.clientY)
            (movePoint x y))
        (evt.preventDefault)
        undefined))
    (on window:mouseup (lambda (evt)
        (movePoint evt.clientX evt.clientY)
        undefined)))