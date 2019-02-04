const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const rootDir = path.join( __dirname, '..');
const shadersDir = path.join(rootDir, 'shaders/');
const outputDir = path.join(rootDir, 'docs/');

let outputShaders = [];

let compile = (shaderPath) => {
  let outputPath = path.join(outputDir, shaderPath.replace(rootDir, '')).replace(/\.frag$/, '.html');
  let templatePath = path.join(rootDir, 'templates', 'shader.html.ejs');
  let template = ejs.compile(fs.readFileSync(templatePath, {encoding: "utf-8"}));
  let params = {
    'fragmentShader': fs.readFileSync(shaderPath),
  };

  console.log(outputPath);
  mkdirp.sync(path.dirname(outputPath), (err) => console.log(err));
  fs.writeFileSync(outputPath, template(params), {encoding: "utf-8"});
  let p = outputPath.replace(outputDir, '');
  outputShaders.push({
    filename: p.replace('shaders/', ''),
    path: p,
  });
};

let build = (filename) => {
  let files = fs.readdirSync(filename);
  files.forEach((f) => {
    let shaderPath = path.join(filename, f);
    if (fs.statSync(shaderPath).isDirectory()) {
      console.log('SHADER', shaderPath);
      build(shaderPath);
    } else {
      compile(shaderPath);
    }
  });
};

build(shadersDir);
let index = fs.readFileSync(path.join(rootDir, 'templates', 'index.html.ejs'), {encoding: "utf-8"});
let template = ejs.compile(index);
let params = {
  'shaders': outputShaders,
};
fs.writeFileSync(path.join(outputDir, 'index.html'), template(params), {encoding: "utf-8"});
