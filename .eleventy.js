const pluginBookshop = require("@bookshop/eleventy-bookshop");
const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
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

	return {
		dir: {
			input: 'site',
			pages: 'pages'
		}
	}
};
