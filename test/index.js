import { expect } from 'chai';
import cdnTools from '../src/index';
import config from '../src/config';

const envKeys = Object.keys(config.env);

describe('cdnTools#getCdnDomain', () => {
  it('disabled prod cdn flag and no env inject will return blank', () => {
    const domain = cdnTools.getCdnDomain();

    expect(domain).to.equal('');
  });

  it('inject PHOENIX_BUILD_ENV=dev will return blank', () => {
    process.env.PHOENIX_BUILD_ENV = 'dev';
    const domain = cdnTools.getCdnDomain();
    process.env.PHOENIX_BUILD_ENV = undefined;

    expect(domain).to.equal('');
  });

  it('inject PHOENIX_BUILD_ENV=not_in_phoenix_envs will return blank', () => {
    process.env.PHOENIX_BUILD_ENV = 'others';
    const domain = cdnTools.getCdnDomain();
    process.env.PHOENIX_BUILD_ENV = undefined;

    expect(domain).to.equal('');
  });

  for (let i = 0; i < envKeys.length; i++) {
    const env = envKeys[i];

    it(`inject PHOENIX_BUILD_ENV=${env} will return ${
      config.prodEnvs.includes(env) || env === 'dev' ? 'blank' : config.env[env].domain
    }`, () => {
      process.env.PHOENIX_BUILD_ENV = env;
      const domain = cdnTools.getCdnDomain();
      process.env.PHOENIX_BUILD_ENV = undefined;

      expect(domain).to.equal(config.prodEnvs.includes(env) || env === 'dev' ? '' : config.env[env].domain);
    });
  }

  it('enable prod cdn flag but no env inject will return blank', () => {
    const domain = cdnTools.getCdnDomain(true);

    expect(domain).to.equal('');
  });

  for (let i = 0; i < envKeys.length; i++) {
    const env = envKeys[i];

    it(`inject PHOENIX_BUILD_ENV=${env} will return ${env === 'dev' ? 'blank' : config.env[env].domain}`, () => {
      process.env.PHOENIX_BUILD_ENV = env;
      const domain = cdnTools.getCdnDomain(true);
      process.env.PHOENIX_BUILD_ENV = undefined;

      expect(domain).to.equal(env === 'dev' ? '' : config.env[env].domain);
    });
  }

  for (let i = 0; i < envKeys.length; i++) {
    const env = envKeys[i];

    it(`inject PHOENIX_BUILD_ENV=${env} and PHOENIX_ENABLED_PROD_CDN=false will return ${
      config.prodEnvs.includes(env) || env === 'dev' ? 'blank' : config.env[env].domain
    }`, () => {
      process.env.PHOENIX_ENABLED_PROD_CDN = false;
      process.env.PHOENIX_BUILD_ENV = env;
      const domain = cdnTools.getCdnDomain(true);
      process.env.PHOENIX_BUILD_ENV = undefined;
      process.env.PHOENIX_ENABLED_PROD_CDN = undefined;

      expect(domain).to.equal(config.prodEnvs.includes(env) || env === 'dev' ? '' : config.env[env].domain);
    });
  }

  describe('cdnTools#getPublicPath', () => {
    it('disabled prod cdn flag and no env inject will return blank', () => {
      const domain = cdnTools.getPublicPath();

      expect(domain).to.equal('');
    });

    it('disabled prod cdn flag and no env inject but set appCode will return blank', () => {
      const domain = cdnTools.getPublicPath(false, 'walle');

      expect(domain).to.equal('');
    });

    for (let i = 0; i < envKeys.length; i++) {
      const env = envKeys[i];
      it(`disabled prod cdn flag and set PHOENIX_BUILD_ENV=${env} inject but not set appCode will return ${
        config.prodEnvs.includes(env) || env === 'dev' ? 'blank' : `${config.env[env].domain}/`
      }`, () => {
        process.env.PHOENIX_BUILD_ENV = env;
        const domain = cdnTools.getPublicPath();
        process.env.PHOENIX_BUILD_ENV = undefined;

        expect(domain).to.equal(config.prodEnvs.includes(env) || env === 'dev' ? '' : `${config.env[env].domain}/`);
      });
    }

    for (let i = 0; i < envKeys.length; i++) {
      const env = envKeys[i];
      it(`disabled prod cdn flag and set PHOENIX_BUILD_ENV=${env} and inject appCode will return ${
        config.prodEnvs.includes(env) || env === 'dev' ? 'blank' : `${config.env[env].domain}/`
      }`, () => {
        process.env.PHOENIX_BUILD_ENV = env;
        process.env.PHOENIX_APP_CODE = 'walle';
        const domain = cdnTools.getPublicPath(false);
        process.env.PHOENIX_BUILD_ENV = undefined;
        process.env.PHOENIX_APP_CODE = undefined;

        expect(domain).to.equal(config.prodEnvs.includes(env) || env === 'dev' ? '' : `${config.env[env].domain}/walle/`);
      });
    }

    for (let i = 0; i < envKeys.length; i++) {
      const env = envKeys[i];
      it(`enable prod cdn flag and set PHOENIX_BUILD_ENV=${env} inject appCode and set appCode will return ${
        config.prodEnvs.includes(env) || env === 'dev' ? 'blank' : `${config.env[env].domain}/`
      }`, () => {
        process.env.PHOENIX_BUILD_ENV = env;
        process.env.PHOENIX_APP_CODE = 'walle';
        const domain = cdnTools.getPublicPath(true, 'walle-set');
        process.env.PHOENIX_BUILD_ENV = undefined;
        process.env.PHOENIX_APP_CODE = undefined;

        expect(domain).to.equal(env === 'dev' ? '' : `${config.env[env].domain}/walle-set/`);
      });
    }
  });
});
