const pluginBookshop = require("@bookshop/eleventy-bookshop");

module.exports = function (eleventyConfig) {

	eleventyConfig.htmlTemplateEngine = "liquid";

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
