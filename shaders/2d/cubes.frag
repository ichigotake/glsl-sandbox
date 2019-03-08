#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

void mainImage(out vec4 fragColor, in vec2 uv) {
  uv *= 4.0;
  vec3 color = vec3(0.0);

  float line = floor(mod(uv.y, 20.0));
  if(line == 5.0 && floor(mod(uv.x, 5.0)) != 1.0){
    color = vec3(1.0);
  }
  //cubes
  float square = floor(mod(abs(uv.y), 6.0));
  if(square == 2.0){
    // 1.0 or -1.0
    float direction = step(line-square, 0.0)*2.0-1.0;
    float cube = floor(mod((uv.x+time*direction)*direction, 4.0));
    color = vec3(0.5)*cube;
  }
  fragColor = vec4(color, 1.0);
}

void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    vec4 color;
    mainImage(color, uv);
    gl_FragColor = color;
}
