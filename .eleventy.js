require('dotenv').config();

const pluginBookshop = require("@bookshop/eleventy-bookshop");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const fs = require('fs');
const path = require('path');

// Function to recursively find all JS and CJS files in a directory
function findJSFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  items.forEach(item => {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      files = files.concat(findJSFiles(fullPath));
    } else if (path.extname(item.name) === '.js' || path.extname(item.name) === '.cjs') {
      files.push(fullPath);
    }
  });

  return files;
}

// Function to bundle all JS files into a single file
function bundleJS(files, outputFile) {
  let bundleContent = '';
  files.forEach(file => {
    bundleContent += fs.readFileSync(file, 'utf-8') + '\n';
  });
  fs.writeFileSync(outputFile, bundleContent);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData('env', process.env);
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.htmlTemplateEngine = "liquid";
  // eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
  eleventyConfig.addPlugin(pluginBookshop({
    bookshopLocations: ["component-library"],
    pathPrefix: ""
  }));
  eleventyConfig.addPassthroughCopy('site/assets');
  eleventyConfig.addPassthroughCopy('site/_cloudcannon');
  eleventyConfig.addPassthroughCopy({
    "component-library/shared/styles/tailwind.out.css": "site/assets/tailwind.css",
  });

  // Bundle JS files
  const jsFiles = findJSFiles('component-library/components'); // Assuming "components" is your directory
  bundleJS(jsFiles, 'site/assets/bundle.js');

  return {
    dir: {
      input: 'site',
      pages: 'pages'
    }
  }
};