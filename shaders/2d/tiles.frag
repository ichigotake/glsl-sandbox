precision mediump float;

uniform vec2 resolution;
uniform float time;

void mainImage(out vec4 fragColor, in vec2 uv) {
  float beat = time/60.*128.*0.5;
  uv *= 1.5;
  uv.y -= beat*1.0;

  float diff = mod(floor(beat), 2.0) * 0.2;
  vec3 color = vec3(0.0);
  float x = mod(floor(uv.x), 4.0);
  float y = mod(floor(uv.y), 4.0);
  if(x == 0.0 && y == 3.0){
    color = vec3(0.5-diff);
  }
  if(x == 1.0 && y == 2.0){
    color = vec3(0.3+diff);
  }
  if(x == 2.0 && y == 1.0){
    color = vec3(0.5-diff);
  }
  if(x == 3.0 && y == 0.0){
    color = vec3(0.3+diff);
  }
  fragColor = vec4(color, 1.0);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
  vec4 color;
  mainImage(color, uv);
  gl_FragColor = color;
}
