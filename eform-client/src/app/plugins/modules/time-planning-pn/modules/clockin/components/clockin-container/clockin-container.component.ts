import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { SiteDto } from 'src/app/common/models';
import {
  TimeClockInModel,
  TimeClockInUpdateModel,
} from '../../../../models/clockin';
import {   TimePlanningsRequestModel } from '../../../../models/';

import { TimePlanningPnPlanningsService } from '../../../../services';

@AutoUnsubscribe()
@Component({
  selector: 'app-ClockIn-container', 
  templateUrl: './clockIn-container.component.html', 
  styleUrls: ['./clockIn-container.component.scss'], 
})
export class ClockInContainerComponent implements OnInit, OnDestroy { 
  timePlanningsRequest: TimePlanningsRequestModel;
  availableSites: SiteDto[] = [];
  timePlannings: TimeClockInModel[] = [];
  ClockInForUpdate: TimeClockInUpdateModel[] = [];

  getTimePlannings$: Subscription;
  updateTimePlanning$: Subscription;

  constructor(private planningsService: TimePlanningPnPlanningsService) {}

  ngOnInit(): void {
    this.getClockIns();
  }

  getClockIns() {
    this.getTimePlannings$ = this.planningsService
      .getClockIn()
      .subscribe((data) => {
        if (data && data.success) {
          this.timePlannings = data.model;
        }
      });
  }

  onUpdateClockInPlanning(model: TimeClockInUpdateModel) {
    const indexForUpdate = this.ClockInForUpdate.findIndex(x => x.sdkSiteId === model.sdkSiteId);
    this.timePlannings[this.timePlannings.findIndex(x => x.sdkSiteId === model.sdkSiteId)] = model as unknown as TimeClockInModel;
    if (indexForUpdate === -1) {
      this.ClockInForUpdate.push(model);
    } else {
      this.ClockInForUpdate[indexForUpdate] = model;
    }
  }

  saveClockInPlanning() {
    this.updateTimePlanning$ = this.planningsService
      .updateClockIn(this.ClockInForUpdate)
      .subscribe((data) => {
        if (data && data.success) {
          this.getClockIns();
        }
      });
  }

  resetFlexPlanning() {
    this.ClockInForUpdate = [];
    this.getClockIns();
  }

  ngOnDestroy(): void {}
}
