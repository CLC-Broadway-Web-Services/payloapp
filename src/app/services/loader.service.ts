import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isShowingLoader = false;
  loader: any;

  constructor(
    public loadingController: LoadingController,
  ) { }

  async showLoader() {
    if (!this.isShowingLoader) {
      this.isShowingLoader = true;
      this.loader = await this.loadingController.create({
        message: 'Please wait',
        // duration: 4000
      });
      return await this.loader.present();
    }
  }
  async stopLoader() {
    if (this.loader) {
      this.loader.dismiss();
      this.loader = null;
      this.isShowingLoader = false;
    }
  }
}
