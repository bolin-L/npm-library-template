import config from './config';

/**
 * 根据发布大盘注入与当前项目CDN上线阶段开关判断是否返回CDN域名
 * @param {Boolean} enableProdCdn 是否发布线上CDN
 */
function getCurEnvCdnConfig(enableProdCdn = false) {
  // 发布大盘执行打包脚本前会注入
  const env = process.env.PHOENIX_BUILD_ENV;

  // 当CDN资源访问异常时，可以通过修改打包脚本注入环境变量重新发布快速降级到Nginx
  const phoenixEnabledProdCdn = process.env.PHOENIX_ENABLED_PROD_CDN !== undefined ? process.env.PHOENIX_ENABLED_PROD_CDN : true;

  // 1. dev环境目前使用程度与方式还不统一，暂时不发布
  // 2. cdn测试与生产环境分步上，生产环境需要明确指定enableProdCdn才会发布cdn
  if (
    env === 'dev'
    || !config.env[env]
    || ((!enableProdCdn || `${phoenixEnabledProdCdn}` === 'false') && config.prodEnvs.includes(env))
  ) {
    return '';
  }

  return config.env[env].domain;
}

export default {
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

  getCdnDomain: getCurEnvCdnConfig,
};
