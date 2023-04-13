# Marxent Labs Take-Home Test

## Problem Statement

Please use BabylonJS as your rendering engine.

Create 3 shapes in the scene. 

 - A sphere, 
 - a 3-dimensional arrow, and 
 - a box. 
 
 The sphere should be draggable via mouse along the X and Z axis of the scene. 
 
 After a user completes the drag, the arrow should automatically move (over time, as in an animation) so that it is exactly .5 meters away from the sphere's new position along the path of movement (as determined by new position minus old position; see diagram).

The box should remain static at a position of 0,0,0. As you can see in the diagram, a triangle is formed by following points
1.	The arrow's old position
2.	The arrow's new position
3.	The sphere's old position
After the arrow complete's movement, if the box is within the triangle formed by the preceding three points, the box should turn green. Otherwise, the box should turn yellow.

Please submit as an self-contained zip file. You may either keep it as simple as an index.html and index.js, or you may use webpack/npm so that the site may be viewable using "npm start".

<img src="diagram.jpg" title="Diagram of object motion">