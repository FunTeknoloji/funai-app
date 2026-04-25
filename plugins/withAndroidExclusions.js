const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withAndroidExclusions(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      if (!config.modResults.contents.includes("exclude group: 'com.android.support'")) {
        config.modResults.contents = config.modResults.contents.replace(
          /android {/,
          `android {
    configurations.all {
        exclude group: 'com.android.support', module: 'support-v4'
        exclude group: 'com.android.support', module: 'support-compat'
        exclude group: 'com.android.support', module: 'versionedparcelable'
    }`
        );
      }
    }
    return config;
  });
};
