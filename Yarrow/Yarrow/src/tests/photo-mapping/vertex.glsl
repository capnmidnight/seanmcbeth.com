out vec3 vDir;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    vDir = normalize(position);
}