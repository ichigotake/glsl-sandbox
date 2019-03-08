#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

const float lineWeight = 0.05;

void mainImage(out vec4 fragColor, in vec2 uv) {
  uv = abs(uv);
  uv += length(uv+time);

  vec3 color = vec3(0.0);
  float x = mod(uv.x, 2.0);
  float y = mod(uv.y, 2.0);
  if(x <= lineWeight){
    float y = mod(uv.y+time, 4.0);
    color = vec3(y);
  }
  if(y <= lineWeight){
    float x = mod(uv.x+time, 4.0);
    color = vec3(x);
  }
  if(x <= 0.9 && y <= 0.9){
    color = vec3(0.0);
  }

  fragColor = vec4(color, 1.0);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
  vec4 color;
  mainImage(color, uv);
  gl_FragColor = color;
}
