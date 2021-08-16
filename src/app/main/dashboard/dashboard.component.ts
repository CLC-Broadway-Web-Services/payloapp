import { Component, OnInit } from '@angular/core';
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

  tasksForTodayAndRest = false;

  weeklyTasksPercentage = 0;
  weeklyTasksCompleted = 0;
  weeklyTasksTotal = 0;

  constructor(
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

        const completedTasks = tasks.filter((task) => {
          return task.isApproved;
        })
        const todaysTask = tasks.filter((task) => {
          return task.allotedDate == today;
        })
        const notCompletedTasksThisWeek = tasks.filter((task) => {
          return !task.isApproved && !task.isExpired && !task.isSubmitted;
        })

        this.todaysTaskOnly = todaysTask;
        this.allTasksNotCompleted = notCompletedTasksThisWeek;

        const totalTasksToShow = (todaysTask.length+notCompletedTasksThisWeek.length);

        if(totalTasksToShow > 0) {
          this.tasksForTodayAndRest = true;
        } else {
          this.tasksForTodayAndRest = false;
        }

        console.log(todaysTask)
        console.log(notCompletedTasksThisWeek)

        const totalTasksLength = tasks.length; // 100
        const completedTasksLength = completedTasks.length; // 40
        const tasksPercentage = totalTasksLength / 100;

        // this.weeklyTasksPercentage = Math.ceil(tasksPercentage*completedTasksLength);
        this.weeklyTasksPercentage = tasksPercentage * completedTasksLength;
        this.weeklyTasksCompleted = completedTasks.length;
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

}
