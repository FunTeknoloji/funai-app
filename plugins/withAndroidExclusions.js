const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withAndroidExclusions(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      console.log('Applying Comprehensive Android Support Exclusions and Packaging Options...');

      // 1. Force pickFirst for all version files and common metadata
      const packagingBlock = `
    packagingOptions {
        pickFirst 'META-INF/*.version'
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
        exclude 'META-INF/MANIFEST.MF'
    }`;

      // 2. Comprehensive exclusion of legacy support libraries
      const exclusionBlock = `
configurations.all {
    resolutionStrategy.force 'androidx.core:core:1.13.1'
    exclude group: 'com.android.support'
}
`;

      if (!config.modResults.contents.includes("exclude group: 'com.android.support'")) {
        config.modResults.contents = exclusionBlock + config.modResults.contents;
      }

      if (!config.modResults.contents.includes("packagingOptions {")) {
        config.modResults.contents = config.modResults.contents.replace(
          /android {/,
          `android {${packagingBlock}`
        );
      } else {
          // If packagingOptions already exists, we might need to be more careful,
          // but in standard Expo templates it usually doesn't until we add it.
      }
    }
    return config;
  });
};
