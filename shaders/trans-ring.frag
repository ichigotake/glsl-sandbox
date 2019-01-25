#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

 const float PI = 3.14159265;
 const float angle = 60.0;
 const float fov = angle * 0.5 * PI / 180.0;
 vec3 cPos = vec3(0.0, 0.0, 4.0);

 vec3 primaryColor = vec3(0.1, 0.5, 0.5);

 float distFuncRing(vec3 p){
   vec2 t = vec2(time*0.5, 0.005);
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
 	for(int i = 0; i < 16; i++){
 		distance = distFuncRing(rPos);
 		rLen += distance;
 		rPos = cPos + ray * rLen;
 	}

 	if(abs(distance) < 0.001){
    //リング
    gl_FragColor = vec4(vec3(primaryColor), 1.0);
 	}else{
    //ふわふわした光
    float beat = 1.0-sin(length(p)-time*0.1);
    vec3 color = primaryColor-beat;
    gl_FragColor = vec4(color, 1.0);
 	}
}
