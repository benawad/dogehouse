const path = require("path");

const toPath = (_path) => path.join(process.cwd(), _path);

module.exports = {
    stories: ["../src/stories/**/*.story.@(ts|tsx|js|jsx|mdx)"],
    addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-postcss"],
    webpackFinal: async (config, { configType }) => {
        // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
        // You can change the configuration based on that.
        // 'PRODUCTION' is used when building the static version of storybook.

        // Added to support PostCSS v8.X
        /**
         * CSS handling, specifically overriding postcss loader
         */
        // Find the only Storybook webpack rule that tests for css
        const cssRule = config.module.rules.find((rule) =>
            "test.css".match(rule.test)
        );
        // Which loader in this rule mentions the custom Storybook postcss-loader?
        const loaderIndex = cssRule.use.findIndex((loader) => {
            // Loaders can be strings or objects
            const loaderString = typeof loader === "string" ? loader : loader.loader;
            // Find the first mention of "postcss-loader", it may be in a string like:
            // "@storybook/core/node_modules/postcss-loader"
            return loaderString.includes("postcss-loader");
        });
        // Simple loader string form, removes the obsolete "options" key
        cssRule.use[loaderIndex] = "postcss-loader";

        // SVG
        // Needed for SVG importing using svgr
        const indexOfRuleToRemove = config.module.rules.findIndex(
            (rule) => rule.test && rule.test.toString().includes("svg")
        );

        config.module.rules.splice(indexOfRuleToRemove, 1, {
            test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
            loader: require.resolve("file-loader"),
            options: {
                name: "static/media/[name].[hash:8].[ext]",
                esModule: false,
            },
        });
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: "@svgr/webpack",
                    options: {
                        svgo: false,
                    },
                },
            ],
        });

        return {
            ...config,
            resolve: {
                ...config.resolve,
                alias: {
                    ...config.resolve.alias,
                    //          "@emotion/core": toPath("node_modules/@emotion/react"),
                    //          "@emotion/styled": toPath("node_modules/@emotion/styled"),
                    //          "emotion-theming": toPath("node_modules/@emotion/react")
                },
            },
        };
    },
};