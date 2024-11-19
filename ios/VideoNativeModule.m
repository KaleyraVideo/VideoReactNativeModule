// Copyright © 2018-2023 Kaleyra S.p.a. All Rights Reserved.
// See LICENSE for licensing information

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(VideoNativeModule, NSObject)

RCT_EXTERN_METHOD(configure:(NSString *)json)

RCT_EXTERN_METHOD(setAccessTokenResponse:(NSString *)json)

RCT_EXTERN_METHOD(connect:(NSString *)userID)

RCT_EXTERN_METHOD(disconnect)

RCT_EXTERN_METHOD(reset)

RCT_EXTERN_METHOD(startCall:(NSString *)json)

RCT_EXTERN_METHOD(setDisplayModeForCurrentCall:(NSString *)mode)

RCT_EXTERN_METHOD(startCallUrl:(NSString *)url)

RCT_EXTERN_METHOD(addUsersDetails:(NSString *)json)

RCT_EXTERN_METHOD(removeUsersDetails)

RCT_EXTERN_METHOD(startChat:(NSString *)userID)

RCT_EXTERN_METHOD(clearUserCache)

RCT_EXTERN_METHOD(getCurrentVoIPPushToken:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
