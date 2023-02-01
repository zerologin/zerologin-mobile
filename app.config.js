export default {
    expo: {
        name: 'Zerologin',
        slug: 'zerologin',
        scheme: 'keyauth',
        version: '1.0.0',
        jsEngine: 'hermes',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'light',
        splash: {
            image: './assets/splash.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
        },
        updates: {
            fallbackToCacheTimeout: 0,
        },
        assetBundlePatterns: ['**/*'],
        ios: {
            buildNumber: '1',
            supportsTablet: true,
            bundleIdentifier: 'co.zerologin.app.ios',
        },
        android: {
            versionCode: 6,
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#FFFFFF',
            },
            package: 'co.zerologin.app.android',
        },
        web: {
            favicon: './assets/favicon.png',
        },
        extra: {
            eas: {
                projectId: '6ef6cd46-2fb4-4255-bc44-746c377145cd',
            },
        },
        plugins: [
            [
                'expo-build-properties',
                {
                    android: {
                        compileSdkVersion: 33,
                        targetSdkVersion: 33,
                        buildToolsVersion: '33.0.0',
                    },
                    ios: {
                        deploymentTarget: '13.0',
                    },
                },
            ],
        ],
    },
}
