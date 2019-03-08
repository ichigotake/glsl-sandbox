#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 resolution;
uniform float time;

const float lineWeight = 0.05;

mat2 rotate2d(float _angle){ return mat2( cos(_angle),-sin(_angle), sin(_angle),cos(_angle)); }

void mainImage(out vec4 fragColor, in vec2 uv) {
  vec3 color = vec3(0.0);
  color += 1.0-length(uv)-0.9;
  uv *= rotate2d(time*0.1);

  // wtf
  uv /= length(uv/mod(time, 20.0));

  float x = mod(uv.x, 2.0);
  float y = mod(uv.y, 2.0);
  if(x <= lineWeight){
    float y = mod(uv.y+time, 4.0);
    color = vec3(0.0, 0.0, 0.4);
  }
  if(y <= lineWeight){
    float x = mod(uv.x+time, 4.0);
    color = vec3(x);
  }

  fragColor = vec4(color, 1.0);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
  vec4 color;
  mainImage(color, uv);
  gl_FragColor = color;
}
