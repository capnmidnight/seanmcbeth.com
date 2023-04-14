module.exports = {
    mode: "development",
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
        ],
    },
    devServer: {
        https: true,
        open: true
    }
};