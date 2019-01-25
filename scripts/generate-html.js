const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const rootDir = path.join( __dirname, '..');
const shadersDir = path.join(rootDir, 'shaders/');
const outputDir = path.join(rootDir, 'docs/');

let outputShaders = [];

let generate = (filename) => {
  let outputPath = path.join(outputDir, filename).replace(/\.frag$/, '.html');
  let templatePath = path.join(rootDir, 'templates', 'shader.html.ejs');
  let template = ejs.compile(fs.readFileSync(templatePath, {encoding: "utf-8"}));
  let params = {
    'fragmentShader': fs.readFileSync(path.join(shadersDir, filename)),
  };
  fs.writeFileSync(outputPath, template(params), {encoding: "utf-8"});
  console.log(outputPath);
  outputShaders.push({
    filename: path.basename(outputPath),
    name: filename.replace('-', ' ').replace(/\.frag/, ''),
  });
};

let readFile = (filename) => {
  let files = fs.readdirSync(filename);
  files.forEach((filename) => {
    let shadersPath = path.join(shadersDir, filename);
    if (fs.statSync(shadersPath).isDirectory()) {
      readFileSync(shadersPath, generate);
    } else {
      generate(filename);
    }
  });
};

readFile(shadersDir);
let index = fs.readFileSync(path.join(rootDir, 'templates', 'index.html.ejs'), {encoding: "utf-8"});
let template = ejs.compile(index);
let params = {
  'shaders': outputShaders,
};
fs.writeFileSync(path.join(outputDir, 'index.html'), template(params), {encoding: "utf-8"});
