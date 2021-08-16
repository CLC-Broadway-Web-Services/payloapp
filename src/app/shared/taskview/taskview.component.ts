import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from 'src/app/interfaces/tasks';
import { CompressImageService } from 'src/app/services/CompressImage.service';
import { TaskviewService } from 'src/app/services/taskview.service';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";

@Component({
  selector: 'app-taskview',
  templateUrl: './taskview.component.html',
  styleUrls: ['./taskview.component.scss'],
})
export class TaskviewComponent implements OnInit {
  @Input() fullTask: Task;
  @Input() taskType: string;

  @ViewChild('uploadProof') uploadProof: any;

  constructor(
    public taskService: TaskviewService,
    private auth: AuthService,
    public modalController: ModalController,
    private compressImage: CompressImageService,
    private loader: LoaderService,
    private fireStore: AngularFireStorage,
  ) { }

  ngOnInit() {
    console.log(this.fullTask);
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  // openLink(link: string) {
  //   window.open(link, '_system', 'location=yes'); return false;
  // }

  uploadedImageProof;
  upload(event, fullTask: Task) {
    let image: File = event.target.files[0]
    // console.log(taskId);
    this.compressImage.compress(image)
      .pipe(take(1))
      .subscribe(compressedImage => {
        this.loader.showLoader().then(() => {
          var n = Date.now();
          // const file = event.target.files[0];
          const file = compressedImage;
          console.log(file);
          const filePath = `taskProofs/${fullTask.uid}/${n}`;
          const fileRef = this.fireStore.ref(filePath);
          const task = this.fireStore.upload(`taskProofs/${fullTask.uid}/${n}`, file);
          task
            .snapshotChanges()
            .pipe(
              finalize(() => {
                const downloadURL = fileRef.getDownloadURL();
                downloadURL.subscribe(url => {
                  if (url) {
                    this.uploadedImageProof = url;
                    this.auth.afs.doc(`campaign/${fullTask.campaignId}/tasks/${fullTask.id}`).set({
                      isSubmitted: true,
                      proof: this.uploadedImageProof
                    }, { merge: true }).then(() => {
                      this.loader.stopLoader();
                    }).catch((error) => {
                      console.log(error)
                      this.loader.stopLoader();
                    })
                  }
                });
              })
            )
        })
      })
  }
}

// console.log(compressedImage);
// var file: File = compressedImage;
// var myReader: FileReader = new FileReader();

// myReader.onloadend = (e) => {
//   this.myImage = myReader.result;
//   console.log(this.myImage);
// }
// myReader.readAsDataURL(file);
// this.myImage = compressedImage;