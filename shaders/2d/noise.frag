precision mediump float;

uniform vec2 resolution;
uniform float time;

const float redScale   = 0.298912;
const float greenScale = 0.586611;
const float blueScale  = 0.114478;
const vec3  monochromeScale = vec3(redScale, greenScale, blueScale);

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

  // 縦断するノイズ
  vec2 v = p;
  v.y = fract(t) - fract(v-time*0.1).y + 0.99;
  v.y += random(vec2(v.x*t, v.y*t));
  v.y = step(v.y, 0.1);
  color = vec3(v.y);

  // 細長いノイズ
  p *= rotate2d(-0.03);
  p.y = fract(p*vSplit).y;
  p.y += random(vec2(p.x*t, p.y*t));
  p.y = step(p.y, 0.05);
  color = max(vec3(p.y), color);

  // 全体に散らすノイズ
  p.y = fract(p*vSplit).y;
  p.y += random(vec2(p.x*t, p.y*t));
  p.y = step(p.y, .03);
  color = max(vec3(p.y-0.8), color);

  gl_FragColor = vec4(color, 1.0);
}
