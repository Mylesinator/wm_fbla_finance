varying vec3 vLightDir;
varying vec3 vViewDir;
varying vec2 vUv;
varying vec3 vNormal;

uniform vec3 lightPosition;
uniform vec3 cameraPosition;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vLightDir = normalize(lightPosition - worldPosition.xyz);
    vViewDir = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}