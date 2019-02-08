/*{"osc":4444}*/
precision mediump float;

// parameters

// OSC on /cubes/direction
// spec: osc_cubes_direction != 0.0
// neutral: 1.0
uniform sampler2D osc_cubes_direction;

// OSC on /cubes/lines
// spec: 1 to 4
uniform sampler2D osc_cubes_lines;

// OSC on /cubes/scale
// spec: osc_cubes_scale >= 1.0
uniform sampler2D osc_cubes_scale;

// end of parameters

uniform vec2 resolution;
uniform float time;
const float PI = 3.14159265359;

vec3 pal(float target, float direction) {
  float x;
  float div = 9.0;
  target += mod(direction*time*.2, 1.0)+floor(target/div);

  // spec: div*2.0 == loop count
  for(float i=0.0; i<18.0; i += 1.0) {
    if(target>(i/div)) x = step(mod(i, 3.0), 1.0);
  }
  return vec3(1.0-x);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main(void) {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 p = uv;
  float scale = max(1.0, texture2D(osc_cubes_scale, p).x);
  p = fract(p*scale);

  vec3 color = vec3(0.0);
  float lines = max(1.0, texture2D(osc_cubes_lines, p).x);
  float direction = texture2D(osc_cubes_direction, p).x;
  if(direction == 0.0) direction = 1.0;
  for(float i=0.; i<18.0; i += 1.0){
   if(p.y>(i/8.0)) { // cube container height
     if(mod(i, lines)==1.0){
       // 1.0 or -1.0
       float direction = step(floor(i/4.0), 0.5)*2.0-direction;
       color = pal(p.x, direction);
     }else{
       color = vec3(0.0);
     }
   }
 }

 gl_FragColor = vec4(color, 1.0);
}
