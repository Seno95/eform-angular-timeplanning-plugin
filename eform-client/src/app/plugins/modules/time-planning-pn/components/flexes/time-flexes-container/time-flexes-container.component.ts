import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { SiteDto } from 'src/app/common/models';
import {
  TimeFlexesModel,
  TimePlanningsRequestModel,
  TimeFlexesUpdateModel,
} from '../../../models';
import { TimePlanningPnPlanningsService } from '../../../services';

@AutoUnsubscribe()
@Component({
  selector: 'app-time-flexes-container',
  templateUrl: './time-flexes-container.component.html',
  styleUrls: ['./time-flexes-container.component.scss'],
})
export class TimeFlexesContainerComponent implements OnInit, OnDestroy {
  timePlanningsRequest: TimePlanningsRequestModel;
  availableSites: SiteDto[] = [];
  timePlannings: TimeFlexesModel[] = [];
  flexesForUpdate: TimeFlexesUpdateModel[] = [];

  getTimePlannings$: Subscription;
  updateTimePlanning$: Subscription;

  constructor(private planningsService: TimePlanningPnPlanningsService) {}

  ngOnInit(): void {
    this.getPlannings();
  }

  getPlannings() {
    this.getTimePlannings$ = this.planningsService
      .getFlexes()
      .subscribe((data) => {
        if (data && data.success) {
          this.timePlannings = data.model;
        }
      });
  }

  onUpdateFlexPlanning(model: TimeFlexesUpdateModel) {
    const indexForUpdate = this.flexesForUpdate.findIndex(x => x.date === model.date);
    this.timePlannings[this.timePlannings.findIndex(x => x.date === model.date)] = model as TimeFlexesModel;
    if(indexForUpdate === -1){
      this.flexesForUpdate.push(model);
    } else {
      this.flexesForUpdate[indexForUpdate] = model;
    }
  }

  saveFlexPlanning(){
    this.updateTimePlanning$ = this.planningsService
      .updateFlexes(this.flexesForUpdate)
      .subscribe((data) => {
        if (data && data.success) {
          this.getPlannings();
        }
      });
  }

  ngOnDestroy(): void {}
}
