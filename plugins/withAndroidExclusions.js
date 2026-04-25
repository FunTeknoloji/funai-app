const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withAndroidExclusions(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      console.log('Applying Android Support Exclusions and Packaging Options...');

      // 1. Exclude duplicate support libraries at the configuration level
      const exclusionBlock = `
configurations.all {
    exclude group: 'com.android.support', module: 'support-v4'
    exclude group: 'com.android.support', module: 'support-compat'
    exclude group: 'com.android.support', module: 'versionedparcelable'
    exclude group: 'com.android.support', module: 'localbroadcastmanager'
    exclude group: 'com.android.support', module: 'animated-vector-drawable'
    exclude group: 'com.android.support', module: 'support-vector-drawable'
    exclude group: 'com.android.support', module: 'core-ui'
    exclude group: 'com.android.support', module: 'core-utils'
    exclude group: 'com.android.support', module: 'support-fragment'
    exclude group: 'com.android.support', module: 'support-media-compat'
}
`;
      if (!config.modResults.contents.includes("exclude group: 'com.android.support'")) {
        config.modResults.contents = exclusionBlock + config.modResults.contents;
      }

      // 2. Add packagingOptions to handle duplicate META-INF files
      if (!config.modResults.contents.includes("packagingOptions {")) {
        config.modResults.contents = config.modResults.contents.replace(
          /android {/,
          `android {
    packagingOptions {
        pickFirst 'META-INF/androidx.localbroadcastmanager_localbroadcastmanager.version'
        pickFirst 'META-INF/androidx.*'
        pickFirst 'META-INF/android.*'
        pickFirst 'META-INF/DEPENDENCIES'
        pickFirst 'META-INF/LICENSE'
        pickFirst 'META-INF/LICENSE.txt'
        pickFirst 'META-INF/license.txt'
        pickFirst 'META-INF/NOTICE'
        pickFirst 'META-INF/NOTICE.txt'
        pickFirst 'META-INF/notice.txt'
        pickFirst 'META-INF/ASL2.0'
    }`
        );
      }
    }
    return config;
  });
};
