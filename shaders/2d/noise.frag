precision mediump float;

uniform vec2 resolution;
uniform float time;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

mat2 rotate2d(float _angle){
    return mat2(
        cos(_angle),-sin(_angle),
        sin(_angle),cos(_angle));
}

void main(void) {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 p = uv;

  float vSplit = 4.2;

  vec3 color = vec3(0.0);
  float t = time*0.0001;

  vec2 liner = p;
  liner.y = fract(t) - fract(liner-time*0.1).y + 0.7;
  liner.y += random(vec2(liner.x*t, liner.y*t));
  liner.y = step(liner.y, 0.3);
  color = vec3(liner.y);

  p *= rotate2d(-0.03);
  p.y = fract(p*vSplit).y;
  p.y += random(vec2(p.x*t, p.y*t));
  p.y = step(p.y, 0.3);
  color = max(vec3(p.y), color);

  gl_FragColor = vec4(color, 1.0);
}
