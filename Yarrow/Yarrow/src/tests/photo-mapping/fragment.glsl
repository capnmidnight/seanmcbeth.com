uniform mediump samplerCube envMap;

in vec3 vDir;

void main() {
    vec3 uvw = vec3(-vDir.x, vDir.yz);
    gl_FragColor = texture(envMap, normalize(uvw));
}