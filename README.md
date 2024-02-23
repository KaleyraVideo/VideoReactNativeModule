![Kaleyra Logo](https://github.com/KaleyraVideo/VideoReactNativeModule/blob/main/doc/img/kaleyra-video.png)

# Kaleyra Video React Native Module

[![npm version](https://img.shields.io/npm/v/@kaleyra/video-react-native-module?color=brightgreen&label=npm%20package)][LinkNpm]

## Our machine development setup

```
ruby = 2.7.6
node >= v16
react >= 0.71.x
yarn >= 1.22.17
```

## How to run the example

Execute the following commands from the repository root folder

```shell
yarn
yarn prepack
yarn link
cd example
# nano .env use your own keys
yarn link @kaleyra/video-react-native-module
yarn android/ios
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

In case your application already provides the WebRTC framework in a third party module, a conflict may arise when trying to install the depedencies through Cocoapods.
In order to resolve the conflict you can download and install the Kaleyra Video iOS framework as a standalone package.
To enable the standalone framework you must change your application's Podfile declaring the `$KaleyraNoWebRTC` variable before the first target definition. You can give whatever value you want to the variable as long as it is defined before the target definitions.

```ruby
platform :ios, min_ios_version_supported
prepare_react_native_project!

# use_frameworks! is required for using Bandyer framework, linkage static is required by React Native instead.
use_frameworks! :linkage => :static

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
});
```
**Warning:** Make sure this listener is attached before calling kaleyraVideo.connect(_), otherwise the event reporting the device token could be missed.

The token provided in the callback is the **string** representation of your device token. 
Here's an example of a device token: **dec105f879924349fd2fa9aa8bb8b70431d5f41d57bfa8e31a5d80a629774fd9**

### VoIP notification payload

[Here][iOSVoIPPayload] you can find an example of how your VoIP notifications payload should be structured.


## Module connect

To connect the plugin to the Kaleyra Video system you will need to provide a Session object.
The session needs a userID and a function returning a promise with the access token for that user

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
    {userID: "usr_yyy", firstName: "User1Name", lastName: "User1Surname"},
    {userID: "usr_zzz", firstName: "User2Name", lastName: "User2Surname"},
]);
```

## Remove all user details

This method will allow you to remove all the user info from the local app DB.

```javascript
kaleyraVideo.removeUsersDetails();
```

## Set user details format

This method will allow you to specify how you want your user details to be displayed.
> Be aware that you can specify only keywords which exist in the UserDetails type.

For example: if you wish to show only the firstName while your dataset contains also the lastName you may change it here.

```javascript
kaleyraVideo.setUserDetailsFormat({
    default: "${firstName} ${lastName}",
    androidNotification: "${firstName} ${lastName}" // optional if you wish to personalize the details in the notification.
});
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

## Verify user

To verify a user for the current call.

```javascript
kaleyraVideo.verifyCurrentCall(true);
```

## iOS Podfile Setup

Please pay attention to the Podfile setup for your iOS application. Is required to add this to your Podfile:

```ruby
use_frameworks! :linkage => :static
```

## iOS Broadcast Screen sharing

To enable whole device screen share is required and additional setup.
Open the iOS Xcode project of your React Native application and follow [this guide][BroadcastSceenSharing].
After completing the procedure described in the guide above you need to add to your Podfile this lines:

```ruby
target 'BroadcastExtension' do
  use_frameworks! :linkage => :dynamic

  pod 'BandyerBroadcastExtension'
end
```

Furthermore, to allow a correct configuration of the SDK it is necessary to create a file called "KaleyraVideoConfig.plist" and add it to the same target of the application. This file must have the following content:

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

## Android Notifications
Supports only **on_call_incoming** and **on_message_sent** notification types.

```javascript
kaleyraVideo.handlePushNotificationPayload(payload);
```

Example of acceptable payload
```json
{
  "google.delivered_priority":"high",
  "content-available":"1",
  "google.sent_time":1663347601917,
  "google.ttl":60,
  "google.original_priority":"high",
  "from":"320",
  "title":"",
  "google.message_id":"0:1123%ac212d7bf9fd7ecd",
  "message":"{\"kaleyra\":{\"payload\":{\"event\":\"on_call_incoming\",\"room_id\":\"room_b36f162\",\"data\":{\"initiator\":\"user1\",\"users\":[{\"user\":{\"userAlias\":\"user2\"},\"status\":\"invited\"},{\"user\":{\"userAlias\":\"user1\"},\"status\":\"invited\"}],\"roomAlias\":\"room_b37a64c6f162\",\"options\":{\"duration\":0,\"record\":true,\"recordingType\":\"manual\",\"recording\":\"manual\",\"creationDate\":\"2022-09-16T17:00:01.457Z\",\"callType\":\"audio_upgradable\",\"live\":true}}},\"user_token\":\"eyJhtokenksadfjoiasdjfoaidjfsoasidjfoi\"}}",
  "google.c.sender.id":"320"
}
```

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
