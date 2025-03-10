require('dotenv').config();

const pluginBookshop = require("@bookshop/eleventy-bookshop");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const fs = require('fs');
const path = require('path');
const { minify } = require('terser'); // Import terser for minification

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

// Function to bundle and minify JS files
function bundleAndMinifyJS(files, outputFile) {
  let bundleContent = '';
  files.forEach(file => {
    bundleContent += fs.readFileSync(file, 'utf-8') + '\n';
  });

  // Minify the bundled content (using async/await)
  minify(bundleContent)
    .then(minified => {
      if (minified.error) {
        console.error('Error minifying JavaScript:', minified.error);
        // Optionally: Write the original unminified code if minification fails
        fs.writeFileSync(outputFile, bundleContent); // Or handle the error differently
      } else {
        fs.writeFileSync(outputFile, minified.code);
      }
    })
    .catch(error => {
      console.error('Error minifying JavaScript:', error);
      // Handle the error appropriately (e.g., write the unminified code)
    });
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData('env', process.env);
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.htmlTemplateEngine = "liquid";
  eleventyConfig.markdownTemplateEngine = "liquid";
  
  // Configure markdown files to output as HTML
  eleventyConfig.addExtension("md", {
    outputFileExtension: "html"
  });
  
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

  // Bundle and minify JS files
  const jsFiles = [
    ...findJSFiles('component-library/components'), 
    ...findJSFiles('component-library/shared/config') 
  ];
  bundleAndMinifyJS(jsFiles, 'site/assets/bundle.js');

  return {
    dir: {
      input: 'site',
      pages: 'pages'
    }
  }
};