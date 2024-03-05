struct Ball {
    pos: vec2<f32>,
    vel: vec2<f32>,
    dir: f32,
    flags: u32
}

struct Uniforms {
    dt: f32
}

const NUM_BALLS = 3000;
const WORK_GROUP_SIZE = 256;

const PINNED = 0;
const GRABBED = 1;
const MOVING = 2;

@group(0) @binding(0) var<storage, read> ballsIn: array<Ball, NUM_BALLS>;
@group(0) @binding(1) var<storage, read> connections: array<array<u32, NUM_BALLS>, NUM_BALLS>;
@group(0) @binding(2) var<storage, read_write> ballsOut: array<Ball, NUM_BALLS>;

@group(1) @binding(0) var<uniform> uniforms: Uniforms;

fn isFlagSet(flags: u32, flag: u32) -> bool {
    var mask = 1u << flag;
    return (flags & mask) != 0;
}
 
@compute @workgroup_size(WORK_GROUP_SIZE)
fn main(
    @builtin(global_invocation_id) id: vec3u
) {
    var index = id.x;
    var ballIn = ballsIn[index];
    var vPos = ballIn.pos;
    var vVel = ballIn.vel;
    
    if(isFlagSet(ballIn.flags, PINNED)) {
        vVel = vec2(0, 0);
    }
    else {
        var subConnections = connections[index];
        for(var i = 0u; i < NUM_BALLS; i++) {
            if(i != index && subConnections[i] == 1) {
                var other = ballsIn[i];
                var oPos = other.pos;
                var delta = oPos - vPos;
                var len = length(delta);
                if(len > 0) {
                    len = len * sqrt(len);
                    delta /= len;
                    vVel += 0.00001 * delta;
                }
            }
        }
    }

    vPos += uniforms.dt * vVel;

    if(vPos.x < 0 || vPos.x > 1) {
        vVel.x *= -1;
        if(vPos.x < 0) {
            vPos.x = 0;
        }
        else {
            vPos.x = 1;
        }
    }
    
    if(vPos.y < 0 || vPos.y > 1) {
        vVel.y *= -1;
        if(vPos.y < 0) {
            vPos.y = 0;
        }
        else {
            vPos.y = 1;
        }
    }

    ballsOut[index].pos = vPos;
    ballsOut[index].vel = vVel;
    ballsOut[index].dir = atan2(vVel.y, vVel.x);
    ballsOut[index].flags = ballIn.flags;
}