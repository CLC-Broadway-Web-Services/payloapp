import { Component, OnInit } from '@angular/core';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { TaskviewService } from 'src/app/services/taskview.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  constructor(
    public global: GlobalFunctionsService,
    public taskService: TaskviewService
  ) { }

  ngOnInit() {}

  taskActionSheet(data) {
    this.taskService.toggleTaskView(data);
  }

}
