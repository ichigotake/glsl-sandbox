#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

// parameters

// OSC on /colorRate
uniform sampler2D osc_colorRate;
// OSC on /bpm
uniform sampler2D osc_bpm;

vec3 primaryColor = vec3(0.2, 0.5, 0.5);
// mainで再代入する
float bpm = 100.0/60.0;

// end of parameters

uniform float time;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const float PI = 3.14159265;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;
vec3 cPos = vec3(0.0, 0.5, 3.0);

float distFuncRing(vec3 p){
  float bpm = 150.0/60.0;
  vec2 t = vec2(time*bpm, 0.005);
  vec2 r = vec2(length(p.xy) - t.x, p.z);
  r = mod(r, 4.0);
  return length(r-2.) - t.y;
}

void main(void){
  bpm = texture2D(osc_bpm, p).x / 60.0;

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));

  float distance = 0.0;
  float rLen = 0.0;
  vec3 rPos = cPos;
  for(int i = 0; i < 24; i++){
    distance = distFuncRing(rPos);
    rLen += distance;
 	  rPos = cPos + ray * rLen;
    rPos /= 1.2;
  }

  if(abs(distance) < 0.0001){
    //リング
    vec3 color = vec3(primaryColor);
    gl_FragColor = vec4(color, 1.0);
  }else{
    //ふわふわした光
    float speed = 2.0;
    rPos.x = abs(rPos.y*0.07);
    float beat = 1.0-sin(length(p)-time*speed);
    vec3 color = primaryColor / rPos;
    color.z = color.x*1.5;
    vec4 buff = texture2D(backbuffer, p);
    color.x = buff.x*0.9;
    gl_FragColor = vec4(color, 1.0);
  }
}
