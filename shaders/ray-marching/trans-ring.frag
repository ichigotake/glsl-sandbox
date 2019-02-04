/*{"osc":4444}*/
precision mediump float;

// parameters

// OSC on /bpm
// uniform sampler2D osc_bpm;

// OSC on /ringDirection
// reccomended: 2.0 > osc_ringDirection > -2.0
const float ringDirection = -1.0;

// uniform sampler2D osc_ringDirection;

// OSC on /fuwaRate
// uniform sampler2D osc_fuwaRate;
const float fuwaRate = 0.1;

vec3 primaryColor = vec3(0.1, 0.5, 0.5);

// end of parameters

uniform float time;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const float PI = 3.14159265;
const float angle = 90.0;
const float fov = angle * 0.5 * PI / 180.0;
vec3 cPos = vec3(0.0, 0.0, 4.0);

float bpm(vec2 p) {
  return 150.0 / 60.0;
  // return texture2D(osc_bpm, p).x / 60.0;
}

float distFuncRing(vec3 p){
  // float ringDirection = texture2D(osc_ringDirection, vec2(p.z, p.z)).x;
  vec2 t = vec2(ringDirection*time*bpm(vec2(p.x, p.y)), 0.005);
  vec2 r = vec2(length(p.xy) - t.x, p.z);
  r = mod(r, 4.0);
  return length(r-2.) - t.y;
}

mat2 rotate2D(float angle) {
  return mat2(
    cos(angle), -sin(angle),
    sin(angle),  cos(angle)
    );
}

void main(void){
  float pRate = 2.0;
  vec2 p = (gl_FragCoord.xy * pRate - resolution) / min(resolution.x, resolution.y);
  p *= rotate2D(time*bpm(p)*0.4);
  vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));

  float distance = 0.0;
  float rLen = 0.0;
  vec3 rPos = cPos;
  for(int i = 0; i < 16; i++){
    distance = distFuncRing(rPos);
    rLen += distance;
 	  rPos = cPos + ray * rLen;
  }

  if(abs(distance) < 0.0001){
    //リング
    vec3 color = vec3(primaryColor);
    gl_FragColor = vec4(color, 1.0);
  }else{
    //ふわふわした光
    vec3 fuwa = rPos;
    fuwa.x = max(abs(rPos.z), 0.7);
    fuwa.z = abs(rPos.y);
    fuwa.y = abs(rPos.y);
    vec3 color = primaryColor / fuwa;
    // float fuwaRate = texture2D(osc_fuwaRate, p).x;
    gl_FragColor = vec4(color/length(p)-fuwaRate, 1.0);
  }
}
