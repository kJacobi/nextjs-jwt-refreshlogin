const withImages = require("next-images");
const withSass = require('@zeit/next-sass')
const withCSS = require("@zeit/next-css");
const webpack = require("webpack");
require("dotenv").config();
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports =
    withImages(
        withSass(
            withCSS(
                {
                    cssModules: true,
                    serverRuntimeConfig: {
                        // Will only be available on the server side
                    },
                    publicRuntimeConfig: {
                        // Will be available on both server and client
                        API_BASE_URL: process.env.API_BASE_URL,
                        TOKEN_COOKIE_NAME: process.env.TOKEN_COOKIE_NAME,
                        DAYS_COOKIEEXPIRE: process.env.DAYS_COOKIEEXPIRE,
                    },
                    webpack: (config, { isServer }) => {
                        // Fixes npm packages that depend on `fs` module
                        // config.node = {
                        //   fs: "empty"         
                        // };
                        if (!isServer) {
                            config.node = {
                                fs: 'empty'
                            }
                        }

                        /**
                         * Returns environment variables as an object
                         */
                        const env = Object.keys(process.env).reduce((acc, curr) => {
                            acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
                            return acc;
                        }, {});

                        /** Allows you to create global constants which can be configured
                         * at compile time, which in our case is our environment variables
                         */
                        config.plugins.push(new webpack.DefinePlugin(env));
                        return config;
                    }
                }
            )
        )
    );