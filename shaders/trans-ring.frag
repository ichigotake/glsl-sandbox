#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

// parameters

// OSC on /colorRate
uniform sampler2D osc_colorRate;
// OSC on /colorRate
uniform sampler2D osc_fuwaSpeed;
// OSC on /colorRate
uniform sampler2D osc_ringSpeed;
// OSC on /loopCount
uniform sampler2D osc_loopCount;

vec3 primaryColor = vec3(0.1, 0.5, 0.5);

// end of parameters

uniform float time;
uniform vec2 resolution;

const float PI = 3.14159265;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;
vec3 cPos = vec3(0.0, 0.0, 4.0);

float distFuncRing(vec3 p){
  float speed = max(texture2D(osc_ringSpeed, p).x, 0.1);
  vec2 t = vec2(time*speed, 0.005);
  vec2 r = vec2(length(p.xy) - t.x, p.z);
  r = mod(r, 4.0);
  return length(r-2.) - t.y;
}

void main(void){
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));

  float distance = 0.0;
  float rLen = 0.0;
  vec3 rPos = cPos;
  float loopCount = sampler2D(osc_loopCount, p).x;
  for(int i = 0; i < loopCount; i++){
    distance = distFuncRing(rPos);
    rLen += distance;
 	  rPos = cPos + ray * rLen;
  }

  if(abs(distance) < 0.001){
    //リング
    vec3 color = vec3(primaryColor);
    float colorRate = texture2D(osc_colorRate, p).x;
    color.x = colorRate;
    gl_FragColor = vec4(color, 1.0);
  }else{
    //ふわふわした光
    float speed = max(texture2D(osc_fuwaSpeed, p).x, 0.1);
    float beat = 1.0-sin(length(p)-time*speed);
    vec3 color = primaryColor - beat;
    gl_FragColor = vec4(color, 1.0);
  }
}
