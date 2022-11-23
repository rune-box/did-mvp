const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    externals: {
        // lodash: {
        //   commonjs: 'lodash',
        //   commonjs2: 'lodash',
        //   amd: 'lodash',
        //   root: '_',
        // },
        react: 'React',
        'react-dom': 'ReactDOM',
        //"react-dom": { commonjs: "react-dom", commonjs2: "react-dom", amd: 'react-dom', root: ['ReactDom'] },
        // "react-redux": { commonjs: "react-redux", commonjs2: "react-redux", amd:"react-redux"},
        // redux: { commonjs: "redux", commonjs2: "redux", amd: 'redux'},
        //"prop-types": { commonjs: "prop-types", commonjs2: "prop-types",amd: 'prop-types' }
        //"chakra-ui-steps": "chakra-ui-steps",
        //arweave: "arweave",
        ethers: "ethers",
        //"@cosmjs/amino": "@cosmjs/amino",
        // "@cosmjs/launchpad": "@cosmjs/launchpad",
        // "@polkadot/util": "@polkadot/util",
        // "@polkadot/extension-dapp": "@polkadot/extension-dapp"
    },
});