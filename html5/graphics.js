﻿(class (Surface width height)
    (set! this.canv (document.createElement "canvas"))
    (set! this.graph (this.canv.getContext "2d"))
    
    (when (and width height)
        (this.setSize width height))

    (method (setSize width height)
		(set! this.width width)
		(set! this.height height)
        (set! this.canv.style.position "fixed")
        (set! this.canv.style.top 0)
        (set! this.canv.style.left 0)
        (set! this.canv.width width)
        (set! this.canv.style.width (+ width "px"))
        (set! this.canv.height height)
        (set! this.canv.style.height (+ height "px"))))

(define front (new Surface))
(define back (new Surface))

(document.body.appendChild front.canv)
(define g front.graph)

(define WIDTH 0)
(define HEIGHT 0)
(define MID_WIDTH 0)
(define MID_HEIGHT 0)
(define (setWindowSize)
	(set! WIDTH (- window.innerWidth 25))
	(set! HEIGHT (- window.innerHeight 5))
	(set! MID_WIDTH (* 0.5 WIDTH))
	(set! MID_HEIGHT (* 0.5 HEIGHT))
    (send front setSize WIDTH HEIGHT)
    undefined) 
(setWindowSize)
(on window:resize setWindowSize)

(class (Pattern lineHeight fg text bg)
    (set! this.lineHeight lineHeight)
    (set! this.fg fg)
    (set! this.bg bg)
    (set! this.text text))

(define (pattern-group lineHeight fg texts...)
    (texts.map (lambda (text)
        (new Pattern lineHeight fg text))))

(class (Shape width height patterns)
	(define surf (new Surface width height))
    (when (not (instanceof patterns Array))
        (set! patterns [patterns]))
	(patterns.forEach (lambda (pattern)

        (when pattern.bg
            (set! surf.graph.fillStyle pattern.bg)
            (surf.graph.fillRect 0 0 width height))

		(define font (+ pattern.lineHeight "px monospace"))
        (set! surf.graph.font font)
        (set! surf.graph.fillStyle pattern.fg)
		(set! parts (pattern.text.split "\n"))
        (parts.forEach (lambda (p i)
            (define y (* pattern.lineHeight (+ 1 i)))
			(surf.graph.fillText p 0 y)))))

    (set! this.img surf.canv)
    (set! this.midX (* -0.5 width))
    (set! this.midY (* -0.5 height))
    (set! this.width width)
    (set! this.height height)

    (method (draw)
        // (set! g.strokeStyle "#ff00ff")
        // (g.strokeRect this.midX this.midY this.width this.height)
        (g.drawImage this.img this.midX this.midY)
        undefined))

(class (Animation width height duration patternGroup runOnce)
    (set! this.width width)
    (set! this.height height)
    (set! this.shapes (patternGroup.map (lambda (pattern)
        (new Shape width height pattern))))
    (set! this.loop (not runOnce))
    (set! this.duration duration)
    (set! this.frequency (/ 1 duration))
    (set! this.current 0)

    (method (update dt)
        (set! this.current (+ this.current dt))
        (when (and this.loop (> this.current this.duration))
            (set! this.current (- this.current this.duration)))
        undefined)

    (method (draw)
        (define i (Math.floor (* this.current this.shapes.length this.frequency)))
        (if this.loop
            (set! i (% i this.shapes.length))
            (set! i (Math.min i (- this.shapes.length 1))))
        (this.shapes[i].draw)
        undefined))

(class (BoardObject x y animation)
    (set! this.loc (new Vector x y))
    (set! this.spd (new Vector 0 0))
    (set! this.animation animation)

    (method (update dt)
        (this.animation.update dt)
        (set! this.loc (this.loc.add (this.spd.mul dt))))

    (method (draw)
        (g.save)
        (g.translate this.loc.x this.loc.y)
        (define angle (Math.atan2 this.spd.y this.spd.x))
        (when (< this.spd.x 0)
            (g.scale -1 1)
            (set! angle (- Math.PI angle)))
        (g.rotate angle)
        (this.animation.draw)
        (g.restore)))