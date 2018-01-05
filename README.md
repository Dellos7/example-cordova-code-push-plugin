# cordova-code-push + Ionic example

## Prepare the Ionic APP

`ionic start codepush-ionic-test blank`

`cd codepush-ionic-test`

`ionic cordova plugin add cordova-plugin-code-push`

`sudo npm install --save @ionic-native/code-push`

`ionic cordova platform add ios`

`ionic cordova platform add android`

## Code push set up

`sudo npm install`

`sudo npm install -g code-push-cli`

`code-push login`

`code-push app add codepush-ionic-test-ios ios cordova`

`code-push app add codepush-ionic-test-android android cordova`

**See again the keys:**

`code-push deployment ls codepush-ionic-test-android -k`

`code-push deployment ls codepush-ionic-test-ios -k`

**config.xml**:
```xml
<platform name="android">
    <preference name="CodePushDeploymentKey" value="YOUR-ANDROID-DEPLOYMENT-KEY" />
</platform>
<platform name="ios">
    <preference name="CodePushDeploymentKey" value="YOUR-IOS-DEPLOYMENT-KEY" />
</platform>
```

**src/app/app.module.ts** (set `CodePush` as provider):

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { CodePush } from '@ionic-native/code-push';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CodePush,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

```

**src/app.component.ts** (alert for **updates**):

```typescript
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

import { CodePush, InstallMode, SyncStatus } from '@ionic-native/code-push';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              private codePush: CodePush,  private alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.checkCodePush();
    });
  }

  checkCodePush() {
    
     this.codePush.sync({
      updateDialog: {
       appendReleaseDescription: true,
       descriptionPrefix: "\n\nChange log:\n"   
      },
      installMode: InstallMode.IMMEDIATE
   }).subscribe(
     (data) => {
      console.log('CODE PUSH SUCCESSFUL: ' + data);
      
     },
     (err) => {
      console.log('CODE PUSH ERROR: ' + err);
      
     }
   );
  }

}
```

## Release the update

Modify anything in your app and...

`ionic cordova prepare ios`

`code-push release codepush-ionic-test-ios ./platforms/ios/www/ 0.0.1 --description "Your awesome change description"`

`ionic cordova prepare android`

`code-push release codepush-ionic-test-android ./platforms/android/assets/www/ 0.0.1 --description "Your awesome change description"`

> **Note**: the update will only be released for those devices matching the 0.0.1 version of your app.