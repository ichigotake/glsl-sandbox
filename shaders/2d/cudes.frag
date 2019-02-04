#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

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

void main(void) {
vec2 uv = gl_FragCoord.xy / resolution.xy;
vec2 p = uv;
p = fract(p*6.);


vec3 color = vec3(0.0);
for(float i=0.; i<18.0; i += 1.0){
   if(p.y>(i/8.0)) { // cube height
     if(mod(i, 4.0)==1.0){
       // 1.0 or -1.0
       float direction = step(floor(i/4.0), 0.5)*2.0-1.0;
       color = pal(p.x, direction);
     }else{
       color = vec3(0.0);
     }
   }
}

gl_FragColor = vec4(color, 1.0);
}
