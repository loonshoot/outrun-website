require('dotenv').config();

const pluginBookshop = require("@bookshop/eleventy-bookshop");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const crypto = require('crypto');
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


module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData('env', process.env);
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.htmlTemplateEngine = "liquid";
  eleventyConfig.markdownTemplateEngine = "liquid";

  // Custom filter: where_exp (Jekyll-compatible) — filters array by expression
  eleventyConfig.addFilter("where_exp", function(array, itemName, expression) {
    if (!array) return [];
    // Parse simple expressions like "segment != ''"
    const match = expression.match(/^(\w+)\s*(!=|==)\s*['"](.*)['"]$/);
    if (!match) return array;
    const [, varName, operator, value] = match;
    return array.filter(item => {
      if (operator === '!=') return item !== value;
      if (operator === '==') return item === value;
      return true;
    });
  });
  
  // Add collections
  eleventyConfig.addCollection("learn", function(collectionApi) {
    return collectionApi.getFilteredByGlob("site/pages/learn/**/*.md");
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

  // Bundle and minify JS files before build (async event ensures completion before passthrough copy)
  let bundleHash = '';
  eleventyConfig.on('eleventy.before', async () => {
    const jsFiles = [
      ...findJSFiles('component-library/components'),
      ...findJSFiles('component-library/shared/config')
    ];

    // Concatenate JS files and replace %%PLACEHOLDER%% tokens BEFORE minification
    const isProd = process.env.ELEVENTY_ENV === 'production';
    const replacements = {
      '%%OUTRUN_WIDGET_API_KEY%%': process.env.OUTRUN_WIDGET_API_KEY || 'outrun-chat-widget-token-1772653365',
      '%%OUTRUN_WIDGET_STREAM_ID%%': process.env.OUTRUN_WIDGET_STREAM_ID || '1b771da2-46d8-4345-8289-73c778b5781c',
      '%%OUTRUN_WIDGET_WORKSPACE_ID%%': process.env.OUTRUN_WIDGET_WORKSPACE_ID || '69be3118-75e7-43a7-944a-303df92e17ca',
      '%%OUTRUN_WIDGET_ENDPOINT%%': process.env.OUTRUN_WIDGET_ENDPOINT || (isProd ? 'api.outrun.dev' : 'localhost:3001'),
      '%%OUTRUN_WIDGET_DEBUG%%': isProd ? 'false' : 'true',
      '%%OUTRUN_WIDGET_SOURCE_ID%%': process.env.OUTRUN_WIDGET_SOURCE_ID || '1b771da2-46d8-4345-8289-73c778b5781c',
      '%%OUTRUN_WIDGET_TOKEN%%': process.env.OUTRUN_WIDGET_TOKEN || 'outrun-chat-widget-token-1772653365',
    };

    let rawBundle = '';
    jsFiles.forEach(file => {
      rawBundle += fs.readFileSync(file, 'utf-8') + '\n';
    });
    for (const [placeholder, value] of Object.entries(replacements)) {
      rawBundle = rawBundle.replaceAll(placeholder, value);
    }

    // Minify the replaced content
    try {
      const minified = await minify(rawBundle);
      const finalContent = minified.code || rawBundle;
      if (!minified.code) {
        console.error('Terser returned empty code, writing unminified bundle');
      }
      const existing = fs.existsSync('site/assets/bundle.js') ? fs.readFileSync('site/assets/bundle.js', 'utf-8') : '';
      if (existing !== finalContent) {
        fs.writeFileSync('site/assets/bundle.js', finalContent);
      }
    } catch (error) {
      console.error('Error minifying JavaScript:', error);
      const existing = fs.existsSync('site/assets/bundle.js') ? fs.readFileSync('site/assets/bundle.js', 'utf-8') : '';
      if (existing !== rawBundle) {
        fs.writeFileSync('site/assets/bundle.js', rawBundle);
      }
    }

    const content = fs.readFileSync('site/assets/bundle.js', 'utf-8');
    bundleHash = crypto.createHash('md5').update(content).digest('hex').slice(0, 8);

    // In dev mode, copy local SDK from web-sdk package for testing
    if (process.env.ELEVENTY_ENV !== 'production') {
      const sdkSrc = path.resolve(__dirname, '../web-sdk/outrun.js');
      const sdkDest = path.resolve(__dirname, 'site/assets/js/outrun.js');
      if (fs.existsSync(sdkSrc)) {
        const srcContent = fs.readFileSync(sdkSrc, 'utf-8');
        const destContent = fs.existsSync(sdkDest) ? fs.readFileSync(sdkDest, 'utf-8') : '';
        if (srcContent !== destContent) {
          fs.writeFileSync(sdkDest, srcContent);
        }
      }
    }
  });

  // Cache-busting hash available in templates as {{ bundleHash }}
  eleventyConfig.addGlobalData('bundleHash', () => bundleHash);

  return {
    dir: {
      input: 'site',
      pages: 'pages'
    }
  }
};