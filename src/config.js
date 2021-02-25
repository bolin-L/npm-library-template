const DEV_CND_HOST = 'dev-s.17win.com';
const TEST_CND_HOST = 'test-s.17win.com';
const RELEASE_CND_HOST = 'release-s.17win.com';
const PRE_CND_HOST = 'pre-s.17win.com';
const PRODUCTION_CND_HOST = 's.17win.com';
const STABLE_CND_HOST = 'stable.17win.com';

export default {
  env: {
    dev: {
      host: DEV_CND_HOST,
      domain: `https://${DEV_CND_HOST}`,
    },
    test: {
      host: TEST_CND_HOST,
      domain: `https://${TEST_CND_HOST}`,
    },
    release: {
      host: RELEASE_CND_HOST,
      domain: `https://${RELEASE_CND_HOST}`,
    },
    pre: {
      host: PRE_CND_HOST,
      domain: `https://${PRE_CND_HOST}`,
    },
    prod: {
      host: PRODUCTION_CND_HOST,
      domain: `https://${PRODUCTION_CND_HOST}`,
    },
    stable: {
      host: STABLE_CND_HOST,
      domain: `https://${STABLE_CND_HOST}`,
    },
  },
  prodEnvs: ['pre', 'prod', 'stable'],
};
