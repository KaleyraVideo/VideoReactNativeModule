![Kaleyra Logo](https://github.com/KaleyraVideo/VideoReactNativeModule/blob/main/doc/img/kaleyra-video.png)

# Kaleyra Video React Native Module

[![npm version](https://img.shields.io/npm/v/@kaleyra/video-react-native-module?color=brightgreen&label=npm%20package)][LinkNpm]

## Our machine development setup

```
ruby = 2.7.6
node >= v18
react-native >= 0.74.x
yarn >= 1.22.17
```

## Minimum requirements
- Android 21+, gradle 8+, kotlin 1.9+
- iOS 15+, swift 5.x

## How to run the example

Execute the following commands from the repository root folder

```shell
yarn
yarn prepack
yarn link
cd example
# nano .env use your own keys
yarn
yarn link @kaleyra/video-react-native-module
yarn pods
yarn start
yarn ios
yarn android
```

### Reset react native build cache
```shell
react-native start --reset-cache
```

## How to install the module:

Open the **terminal** in your React-Native-App folder and run the following commands

```shell
npm install @kaleyra/video-react-native-module
```

# Android additional configuration may be required (depends on your integration)
 -  add tools:replace="android:allowBackup" to AndroidManifest.xml. See here for an [example](https://github.com/KaleyraVideo/VideoReactNativeModule/blob/main/example/android/app/src/main/AndroidManifest.xml#L8)
 -  add maven { url 'https://maven.bandyer.com/releases' } in build.gradle. See here for an [example](https://github.com/KaleyraVideo/VideoReactNativeModule/blob/1599d0f355e4a699a92404c450102e519cfe2866/example/android/build.gradle#L32)

### Standalone iOS framework

In case your application already provides the WebRTC framework in a third party module, a conflict may arise when trying to install the dependencies through Cocoapods.
In order to resolve the conflict you can download and install the Kaleyra Video iOS framework as a standalone package.
To enable the standalone framework you must change your application's Podfile declaring the `$KaleyraNoWebRTC` variable before the first target definition. You can give whatever value you want to the variable as long as it is defined before the target definitions.

```ruby
platform :ios, min_ios_version_supported
prepare_react_native_project!

$KaleyraNoWebRTC = ''

target 'KaleyraVideoReact' do
  config = use_native_modules!

  # Flags change depending on the env values.
  flags = get_default_flags()
[...]
end
```

> [!CAUTION]
> Use the standalone framework only as a last resort in case you have a WebRTC framework conflict. Because we cannot guarantee that the WebRTC framework you are using is compatible with our SDK, you are responsible for assess the compatibility with our module. However, WebRTC versions greater than or equal to M100 should work fine.

## How to remove the module:

```shell
npm uninstall @kaleyra/video-react-native-module
```

## How to use the Kaleyra Video module in your React Native app

You can refer to the Kaleyra Video module in your React Native app via

```javascript
KaleyraVideo
```

## Module setup

The first thing you need to do is to configure the module specifying your keys and your options.

##### Configure params

```javascript
var kaleyraVideo = KaleyraVideo.configure({
    environment: Environments.sandbox(), // production()
    appID: 'mAppId_xxx', // your mobile appId
    region: Regions.europe(), // india(), us()
    logEnabled: true, // enable the logger
    tools: { // by default no tools will be set
        chat: {
            audioCallOption: {
                type: AudioCallType.AUDIO, // AUDIO or AUDIO_UPGRADABLE
                recordingType: RecordingType.NONE, // NONE, MANUAL or AUTOMATIC
            },
            videoCallOption: {
                recordingType: RecordingType.NONE, // NONE, MANUAL or AUTOMATIC
            }
        },
        fileShare: true,
        whiteboard: true,
        screenShare: {
            inApp: true, // screenshare only the app
            wholeDevice: true // screenshare the whole device
        },
        feedback: true
    },

    // optional you can set one or more of the following capabilities, by default callkit is enabled
    iosConfig: {
        voipHandlingStrategy: VoipHandlingStrategy.AUTOMATIC, // implement to be able to receive voips
        callkit: {
            enabled: true, // enable callkit on iOS 10+
            appIconName: "logo_transparent", // optional but recommended
            ringtoneSoundName: "custom_ringtone.mp3" // optional
        }
    }
});
```

If screenShare.wholeDevice is set to true look [here][BroadcastAchor] for the required additional setup.

## Module listen for errors/events

To listen for events and/or errors register
Check the documentation [here][EventsDoc] for a complete list.

Example:

```javascript
kaleyraVideo.events.onCallModuleStatusChanged = (status: String) => {};
```

## iOS - VoIP Notifications

### Setup required for VoIP notifications

If you desire to use VoIP notifications on iOS platform as first thing you should configure kaleyraVideo passing a config object as follow:

```javascript
var kaleyraVideo = KaleyraVideo.configure({
    [...]
    iosConfig: {
        voipHandlingStrategy: VoipHandlingStrategy.AUTOMATIC,
        [...]
    }
});
```

The iOS project requires a little setup for use VoIP notifications. [Here][iOSProjectSetup] you can find a description of how the project should be configured.

### Listening for VoIP push token
In order to get your device push token, you must listen for the **KaleyraVideo.events.iOSVoipPushTokenUpdated** event registering a callback as follows:

```javascript
// The token is received in this listener only after calling kaleyraVideo.connect(_)
kaleyraVideo.events.oniOSVoipPushTokenUpdated = (token: string) => {
    // register the VoIP push token on your server
};
```
**Warning:** Make sure this listener is attached before calling kaleyraVideo.connect(_), otherwise the event reporting the device token could be missed.

The token provided in the callback is the **string** representation of your device token.
Here's an example of a device token: **dec105f879924349fd2fa9aa8bb8b70431d5f41d57bfa8e31a5d80a629774fd9**

### VoIP notification payload

[Here][iOSVoIPPayload] you can find an example of how your VoIP notifications payload should be structured.


## Module connect

To connect the plugin to the Kaleyra Video system you will need to provide a Session object.
The session needs a userID and a function returning a promise with the access token for that user.

> [!IMPORTANT]
> - The *userID* should aready exists in our service. Your backend needs to create it by invoking this api [create_user](https://developers.kaleyra.io/reference/video-v2-user-post)
> - The *accessToken* should be generated from your backend by invoking this api [get_credentials](https://developers.kaleyra.io/reference/video-v2-sdk-post). Be aware that it expires. The callback will be called multiple times every time a new token is needed to refresh the user session.

```javascript
kaleyraVideo.connect({
    userID: "usr_xxx",
    accessTokenProvider(userId: string): Promise<string> {
        // get token for user_xxx and invoke success or error depending on the result
        return Promise.resolve("jwt_xxx");
    },
});
```

## Start a call

To make a call you need to specify some params.

##### Start call params

```javascript
kaleyraVideo.startCall({
    callees: ['usr_yyy','usr_zzz'], //  an array of user ids of the users you want to call
    callType: CallType.AUDIO_VIDEO, // AUDIO, AUDIO_UPGRADABLE or AUDIO_VIDEO - the type of the call you want to start
    recordingType: RecordingType.NONE // NONE, MANUAL or AUTOMATIC
});
```

##### Start call with URL

```javascript
kaleyraVideo.startCallFrom("https://");
```

## Start a chat

To make a chat you need to specify some params.

##### Start chat params

```javascript
kaleyraVideo.startChat('usr_yyy');// the user_id of the user you want to create a chat with
```

## Set user details

This method will allow you to set your user details DB from which the sdk will read when needed to show the information.
> Be sure to have this always up to date, otherwise if an incoming call is received and the user is missing in this set the user ids will be printed on the UI.

```javascript
kaleyraVideo.addUsersDetails([
    {userID: "usr_yyy", name: "User1Name", imageUrl: "https://www.example.com/user1image.png"},
    {userID: "usr_zzz", name: "User2Name", imageUrl: "https://www.example.com/user2image.png"},
]);
```

## Remove all user details

This method will allow you to remove all the user info from the local app DB.

```javascript
kaleyraVideo.removeUsersDetails();
```


## Remove all the cached info in preferences and DBs

```javascript
kaleyraVideo.clearUserCache();
```

## Android change display mode

This method is useful for use-cases where you need to show a prompt and don't want it to be invalidated by the call going into pip.
For example: if you wish to show fingerprint dialog you should first put the current call in background, execute the fingerprint validation and then put back the call in foreground.

```javascript
kaleyraVideo.setDisplayModeForCurrentCall(CallDisplayMode.FOREGROUND); // FOREGROUND, FOREGROUND_PICTURE_IN_PICTURE or CallDisplayMode.BACKGROUND
```

## iOS Broadcast Screen sharing

To enable whole device screen share is required and additional setup.
Open the iOS Xcode project of your React Native application and follow [this guide][BroadcastSceenSharing].
After completing the procedure described in the guide above you need to add to your Podfile this lines:

```ruby

target 'KaleyraVideoReact' do
  pod 'BandyerBroadcastExtension'
  ...
end

target 'BroadcastExtension' do
  pod 'BandyerBroadcastExtension'
end
```

Furthermore, to allow a correct configuration of the SDK it is necessary to:
 - create a file called "KaleyraVideoConfig.plist"
 - add it to the same target of the application. (and NOT to the Extension)
 - set Extension Minimum Deployments to match the version of the Application

This file must have the following content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>broadcast</key>
	<dict>
		<key>appGroupIdentifier</key>
		<string><!-- PUT HERE THE BUNDLE ID OF YOUR APP GROUP --></string>
		<key>extensionBundleIdentifier</key>
		<string><!-- PUT HERE THE BUNDLE ID OF YOUR BROADCAST EXTENSION --></string>
	</dict>
</dict>
</plist>
```

## iOS Notifications
The module supports **on_call_incoming** notification.
You will need to set the **voipHandlingStrategy** and subscribe to **iOSVoipPushTokenUpdated** event to receive the voip token to use on your backend to notify the plugin.
 > Be aware that notifications VOIP notifications are different compared to push. They must be always handled by ensuring the invocation of the configure and connect methods in index.js or App.js.

## Android Notifications
When recevied a **on_call_incoming** or **on_message_sent** notification you just need to configure and connect the plugin and it will automatically show the notification.

## Proguard
```groovy
# Bandyer now Kaleyra proprietary SDK
-keep class com.bandyer.** { *; }
-keep interface com.bandyer.** { *; }
-keep enum com.bandyer.** { *; }

-keep class com.kaleyra.** { *; }
-keep interface com.kaleyra.** { *; }
-keep enum com.kaleyra.** { *; }
```

## TSDoc

The API documentation is available on the github pages link:
[https://kaleyravideo.github.io/VideoReactNativeModule/][TSDoc]

[LinkNpm]: https://www.npmjs.com/package/@kaleyra/video-react-native-module
[BroadcastAchor]: #ios-broadcast-screen-sharing
[BroadcastSceenSharing]: https://github.com/Bandyer/Bandyer-iOS-SDK/wiki/Screen-sharing#broadcast-screen-sharing
[iOSProjectSetup]: https://github.com/Bandyer/Bandyer-iOS-SDK/wiki/VOIP-notifications#project-setup
[iOSVoIPPayload]: https://github.com/Bandyer/Bandyer-iOS-SDK/wiki/VOIP-notifications#notification-payload-key-path
[EventsDoc]: https://kaleyravideo.github.io/VideoReactNativeModule/interfaces/src_events_Events.Events.html
[TSDoc]: https://kaleyravideo.github.io/VideoReactNativeModule/
