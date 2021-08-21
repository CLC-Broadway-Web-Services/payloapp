import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Task } from 'src/app/interfaces/tasks';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { TaskviewService } from 'src/app/services/taskview.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  allTasks: Task[] = [];
  todaysTaskOnly: Task[] = [];
  allTasksNotCompleted: Task[] = [];
  submittedTasks: Task[] = [];
  completedTasks: Task[] = [];
  rejectedTasks: Task[] = [];

  tasksForTodayAndRest = false;

  weeklyTasksPercentage = 0;
  weeklyTasksCompleted = 0;
  weeklyTasksTotal = 0;

  constructor(
    public alertController: AlertController,
    public global: GlobalFunctionsService,
    public taskService: TaskviewService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.userTasks.asObservable().subscribe((tasks: Task[]) => {
      if (tasks && tasks.length > 0) {
        console.log(tasks);
        this.allTasks = tasks;
        // this.todaysTaskOnly = tasks;
        // this.allTasksNotCompleted = tasks;

        const todayDate = Date.now();
        const today = this.formatDate(todayDate);
        console.log(today);

        const todaysTask = tasks.filter((task) => {
          return task.allotedDate == today && !task.isSubmitted && !task.isApproved && !task.isRejected;
        })
        const notCompletedTasksThisWeek = tasks.filter((task) => {
          return task.allotedDate != today && !task.isSubmitted && !task.isApproved && !task.isRejected;
        })
        const submittedTasksThisWeek = tasks.filter((task) => {
          return task.isSubmitted && !task.isApproved && !task.isRejected;
        })
        const completedTasksThisWeek = tasks.filter((task) => {
          return task.isSubmitted && task.isApproved && !task.isRejected;
        })
        const rejectedTasksThisWeek = tasks.filter((task) => {
          return task.isSubmitted && task.isRejected;
        })


        this.todaysTaskOnly = todaysTask;
        this.allTasksNotCompleted = notCompletedTasksThisWeek;
        this.submittedTasks = submittedTasksThisWeek;
        this.completedTasks = completedTasksThisWeek;
        this.rejectedTasks = rejectedTasksThisWeek;

        const totalTasksToShow = (todaysTask.length + notCompletedTasksThisWeek.length);

        if (totalTasksToShow > 0) {
          this.tasksForTodayAndRest = true;
        } else {
          this.tasksForTodayAndRest = false;
        }

        console.log(tasks);
        // console.log(notCompletedTasksThisWeek)

        // const totalTasksLength = tasks.length; // 100
        // const completedTasksLength = completedTasksThisWeek.length; // 40
        // const tasksPercentage = totalTasksLength / 100;

        // const percentage = ((completedTasks.length/tasks.length)*100).toFixed(2)
        const percentage = (completedTasksThisWeek.length / tasks.length) * 100

        // this.weeklyTasksPercentage = Math.ceil(tasksPercentage*completedTasksLength);
        // this.weeklyTasksPercentage = tasksPercentage * completedTasksLength;
        this.weeklyTasksPercentage = percentage;
        this.weeklyTasksCompleted = completedTasksThisWeek.length;
        this.weeklyTasksTotal = tasks.length;
      }
    })
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    // return [day, month, year].join('-');
    return [day, month, year].join('');
  }
  taskActionSheet(data) {
    this.taskService.toggleTaskView(data);
  }

  async showAlertForTask(alertType, message = '') {
    let title = '';
    let data = '';
    if (alertType == 'submitted') {
      title = 'Task Submitted.';
      data = 'Please wait till your submitted screenshot will be approved or rejected after verification.';
    }
    if (alertType == 'rejected') {
      title = 'Task Rejected.';
      data = 'your task is rejected, please read the reason below <br/> ' + message;
    }
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: title,
      message: data,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }

}
