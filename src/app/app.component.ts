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
    let alert = this.alertCtrl.create({
      title: 'CODE PUSH CHECK',
      subTitle: 'Code push check function.',
      buttons: ['Dismiss']
    });
    alert.present();
     this.codePush.sync({
      updateDialog: {
       appendReleaseDescription: true,
       descriptionPrefix: "\n\nChange log:\n"   
      },
      installMode: InstallMode.IMMEDIATE
   }).subscribe(
     (data) => {
      console.log('CODE PUSH SUCCESSFUL: ' + data);
      let alertSuccess = this.alertCtrl.create({
        title: 'CODE PUSH SUCCESS',
        subTitle: 'Code push success!' + data.toString(),
        buttons: ['Dismiss']
      });
      alertSuccess.present();
     },
     (err) => {
      console.log('CODE PUSH ERROR: ' + err);
      let alertError = this.alertCtrl.create({
        title: 'CODE PUSH error',
        subTitle: 'Code push error!' + err.toString(),
        buttons: ['Dismiss']
      });
      alertError.present();
     }
   );
  }

}

