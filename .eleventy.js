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

// Function to bundle and minify JS files (async — must be awaited)
async function bundleAndMinifyJS(files, outputFile) {
  let bundleContent = '';
  files.forEach(file => {
    bundleContent += fs.readFileSync(file, 'utf-8') + '\n';
  });

  try {
    const minified = await minify(bundleContent);
    const finalContent = minified.code || bundleContent;
    if (!minified.code) {
      console.error('Terser returned empty code, writing unminified bundle');
    }
    // Only write if content changed to avoid triggering 11ty watch loop
    const existing = fs.existsSync(outputFile) ? fs.readFileSync(outputFile, 'utf-8') : '';
    if (existing !== finalContent) {
      fs.writeFileSync(outputFile, finalContent);
    }
  } catch (error) {
    console.error('Error minifying JavaScript:', error);
    const existing = fs.existsSync(outputFile) ? fs.readFileSync(outputFile, 'utf-8') : '';
    if (existing !== bundleContent) {
      fs.writeFileSync(outputFile, bundleContent);
    }
  }
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData('env', process.env);
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.htmlTemplateEngine = "liquid";
  eleventyConfig.markdownTemplateEngine = "liquid";
  
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
    await bundleAndMinifyJS(jsFiles, 'site/assets/bundle.js');

    // Replace %%PLACEHOLDER%% tokens with env vars (local dev defaults for non-production)
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

    let bundleContent = fs.readFileSync('site/assets/bundle.js', 'utf-8');
    for (const [placeholder, value] of Object.entries(replacements)) {
      bundleContent = bundleContent.replaceAll(placeholder, value);
    }
    fs.writeFileSync('site/assets/bundle.js', bundleContent);

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