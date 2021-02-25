## 获取各个环境CDN域名配置

项目需要部署到CDN时，可以通过该工具来生成 `publicPath`, 或者获取对应环境的CDN域名

### 安装

```
yarn add @afe/cdn-tools
```

### 使用

```
// webpack.config.js

import cdnTools from '@afe/cdn-tools';

...,
  output: {
    ...,
    publicPath: cdnTools.getPulicPath(), // https://${cdnHost}/${appCode}/
  }

```

如果使用的是CUI，CUI是把`publicPath`拆分成了 `CDN`与`publicPath`两个字段，所以需要分别设置

```
// app.config.js
import cdnTools from '@afe/cdn-tools';


{
  ...,
  CDN: cdnTools.getCdnDomain(),
  publicPath: `/${appCode}/`
}

```

## 实现原理

在发布大盘打包构建时，发布大盘会在运行打包脚本注入当前部署环境值与应用的appCode，脚本会根据注入的环境变量与appCode返回对应的`publicPath`, 本地打包时，可以手动注入对应的环境变量即可模拟发布大盘的打包结果

**注入的环境变量**

```
process.env.PHOENIX_BUILD_ENV = ${dev|test|relese|pre|prod|stable}
process.env.PHOENIX_APP_CODE = ${appCode}

```

## 注意

* 为了更稳妥的部署到CDN，需要先发布到测试环境验证通过后再部署到线上CDN，是否要发布到线上CDN，可以通过 `getPublicPath`、`getCdnDomain`修改，第一个参数传入true即可，否则默认不发布到线上CDN

* 对于已经部署到线上CDN的项目，`getPublicPath`、`getCdnDomain`的参数请手动设置为true

* 对于原本项目设置`publicPath`不符合`/${appCode}/`的项目，可以通过`getPublicPath`第二个参数来控制

* 当CDN静态资源不可访问时，可以在发布大盘上关闭部署CDN开关，打包命令前添加 `PHOENIX_PHOENIX_ENABLED_PROD_CDN=false`环境变量，再重新构建发布，即可快速降级到Nginx访问

* dev环境不发布CDN


```
/**
   * 根据当前项目CDN上线阶段开关与appCode返回PublicPath
   * @param {Boolean} enableProdCdn 是否发布线上CDN
   * @param {String} appCode appCode，发布大盘默认会注入到环境变量，如果不一致，手动配置覆盖
   * 
   * @returns {String} 对应环境的`publicPath`或者空字符
   */
  getPublicPath: (enableProdCdn = false, appCode = '') => {
    const domain = getCurEnvCdnConfig(enableProdCdn);
    appCode = appCode || process.env.PHOENIX_APP_CODE;

    // 
    return domain ? `${domain}/${appCode ? `${appCode}/` : ''}` : domain;
  },

```