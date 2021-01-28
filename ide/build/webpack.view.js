const path = require("path");

module.exports = {
    entry: {
        deploy: "./src/view/app/deploy.tsx",
        poolmgr: "./src/view/app/poolmgr.tsx"
    },
    output: {
        path: path.resolve(__dirname, '..', 'view'),
        filename: "[name].js"
    },
    devtool: "eval-source-map",
    resolve: {
        extensions: [".js", ".ts", ".tsx", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
                options: {}
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                defaultVendors: {
                    filename: 'bundle.js'
                }
            }
        },
    },
    performance: {
        hints: false
    }
};
