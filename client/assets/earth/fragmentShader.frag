varying vec3 vLightDir;
varying vec3 vViewDir;
varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D colorTexture;
uniform sampler2D bumpMap;
uniform sampler2D lightsTexture;
uniform float bumpScale;
uniform float bumpStrength;

void main() {
    vec2 dSTdx = dFdx(vUv);
    vec2 dSTdy = dFdy(vUv);
    float Hll = bumpScale * texture2D(bumpMap, vUv).x;
    float dBx = bumpScale * texture2D(bumpMap, vUv + dSTdx).x - Hll;
    float dBy = bumpScale * texture2D(bumpMap, vUv + dSTdy).x - Hll;
    vec2 gradient = vec2(dBx, dBy);
    
    vec3 tangentSpaceNormal = normalize(vec3(gradient, sqrt(1.0 - dot(gradient, gradient))));
    vec3 perturbedNormal = normalize(vNormal + tangentSpaceNormal * bumpStrength);
    
    // Lighting calculations
    vec3 ambientColor = vec3(0.2); // Ambient lighting
    float lightingFactor = max(dot(perturbedNormal, vLightDir), 0.0); // Lighting factor
    vec3 diffuseColor = lightingFactor * vec3(1.0); // Diffuse lighting

    vec3 reflectDir = reflect(-vLightDir, perturbedNormal); // Reflection vector
    float spec = pow(max(dot(vViewDir, reflectDir), 0.0), 32.0); // Specular highlight
    vec3 specularColor = spec * vec3(0.5); // Specular intensity

    // Combine lighting components
    vec3 lighting = ambientColor + diffuseColor + specularColor;

    // Sample base color texture
    vec4 dayColor = texture2D(colorTexture, vUv);
    vec4 nightColor = texture2D(lightsTexture, vUv);
    
    // Adjust the night texture for higher contrast and brightness
    nightColor.rgb = (nightColor.rgb - 0.5) * 2.0 + 0.5; // Increase contrast
    nightColor.rgb = nightColor.rgb * 1.5; // Increase brightness

    // Blend day and night textures based on lighting factor
    vec4 blendedColor = mix(nightColor, dayColor, lightingFactor);

    // Output final color
    gl_FragColor = vec4(blendedColor.rgb * lighting, blendedColor.a);
}