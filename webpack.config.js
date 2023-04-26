const { NODE_URL } = require("./server");

module.exports = {
    plugins: [
        // new webpack.DefinePlugin({
        //     'process.env.NODE_APP_PUBLIC_URL': JSON.stringify(process.env.NODE_APP_PUBLIC_URL),
        //     'process.env.NODE_APP_API_URL': JSON.stringify(process.env.NODE_APP_API_URL),
        // })
    ]
}