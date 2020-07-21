console.log(process.env.NODE_ENV);

module.exports = {
  // 生成环境部署路径，默认为'/'
  publicPath: './',
  // 当运行 build 时生成的生产环境构建文件的目录
  outputDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: './',
  // 指定生成的 index.html 的输出路径 (相对于 outputDir)
  indexPath: 'index.html',
  // 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存,可设置false关闭
  filenameHashing: true,
  // 在 multi-page （多页面应用）模式下构建应用
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'cr-talent-web',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
    // 当使用只有入口的字符串格式时，
    // 模板会被推导为 `public/subpage.html`
    // 并且如果找不到的话，就回退到 `public/index.html`。
    // 输出文件名会被推导为 `subpage.html`。
    // subpage: 'src/subpage/main.js'
  },
  // 是否在开发环境下通过 [eslint-loader](https://github.com/webpack-contrib/eslint-loader) 在每次保存时 lint 代码
  lintOnSave: true,
  // 调整 webpack 配置最简单的方式就是在 vue.config.js 中的 configureWebpack 选项提供一个对象：1.如果这个值是一个对象，则会通过 [webpack-merge](https://github.com/survivejs/webpack-merge) 合并到最终的配置中
  // 2、如果这个值是一个函数，则会接收被解析的配置作为参数。该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。
  configureWebpack: () => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
  },
  // devServer: {
  //   open: true, // 是否自动弹出浏览器页面
  //   host: 'localhost', // 表示启动的时候使用的域名，默认可以不写，则是使用localhost和本机IP
  //   port: '8081', // 设置端口号
  //   https: false, // 是否使用https协议
  //   hotOnly: false, // 是否开启热更新
  //   proxy: {
  //     '/gateway/account-admin': {
  //       target: 'https://portal-test.crcloud.com',
  //       changeOrigin: true, // 是否跨域，虚拟的站点需要更管origin
  //       // pathRewrite: {
  //       //   '^/gateway/account-admin': '',
  //       // }
  //     },
  //   },
  // },
};