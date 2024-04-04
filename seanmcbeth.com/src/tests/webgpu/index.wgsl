struct Ball {
    pos: vec2<f32>,
    speed: f32,
    dir: f32,
    flags: u32,
    pad: u32
}

struct Uniforms {
    dt: f32,
    limit: f32,
    attract: f32,
    repel: f32,
    grav: f32,
    k0: f32,
    k1: f32,
    k2: f32
}

const NUM_BALLS = 200;
const WORK_GROUP_SIZE = 128;

const PINNED = 0;
const GRABBED = 1;
const MOVING = 2;

@group(0) @binding(0) var<storage, read> ballsIn: array<Ball, NUM_BALLS>;
@group(0) @binding(1) var<storage, read_write> ballsOut: array<Ball, NUM_BALLS>;

@group(1) @binding(0) var<uniform> uniforms: Uniforms;
@group(1) @binding(1) var<storage, read> connections: array<array<f32, NUM_BALLS>, NUM_BALLS>;

fn isFlagSet(flags: u32, flag: u32) -> bool {
    var mask = 1u << flag;
    return (flags & mask) != 0;
}

fn attractFunc(connected: bool, distance: f32) -> f32 {
    if connected {
        return uniforms.k0 * pow(distance, uniforms.k1);
    }
    else{
        return 0.0;
    }
}

fn repelFunc(distance: f32) -> f32 {
    return uniforms.k2 / distance;
}
 
@compute @workgroup_size(WORK_GROUP_SIZE)
fn main(
    @builtin(global_invocation_id) id: vec3u
) {
    var i = id.x;
    var ballIn = ballsIn[i];
    var pos = ballIn.pos;
    var vel = vec2(0.0, 0.0);
    var speed = 0.0;

    if !isFlagSet(ballIn.flags, PINNED) {

        vel -= uniforms.grav * normalize(pos);

        for (var j = 0u; j < NUM_BALLS; j++) {
            if j != i {
                var other = ballsIn[j];
                var delta = other.pos - pos;
                var distance = length(delta);
                if distance > 0.0 {
                    var weight = connections[i][j];
                    var connected = weight > 0.0;
                    weight = abs(weight);
                    var invWeight = 1.0 - weight;
                    var f = weight * uniforms.attract * attractFunc(connected, distance) 
                        - invWeight * uniforms.repel * repelFunc(distance);

                    // Convert the displacement vector to the calculated force vector
                    // and accumulate forces.
                    vel += f * delta / distance;
                }
            }
        }

        speed = length(vel);
        if(speed > 0.0) {
            vel *= min(uniforms.limit, speed) / speed;
        }
        speed = length(vel);

        pos += uniforms.dt * vel;
    }

    ballsOut[i].pos = pos;
    ballsOut[i].speed = speed;
    ballsOut[i].dir = atan2(vel.y, vel.x);
    ballsOut[i].flags = ballIn.flags;
}