import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
// import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';


@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isShowingLoader = false;
  loader: any;

  constructor(
    public loadingController: LoadingController,
    // private spinnerDialog: SpinnerDialog
  ) { }

  async showLoader() {
    if (!this.isShowingLoader) {
      // this.spinnerDialog.show();
      this.isShowingLoader = true;
      this.loader = await this.loadingController.create({
        message: 'Please wait',
      });
      return await this.loader.present();
    }
  }
  async stopLoader() {
    // this.spinnerDialog.hide();
    if (this.loader) {
      this.loader.dismiss();
      this.loader = null;
      this.isShowingLoader = false;
    }
  }
}
