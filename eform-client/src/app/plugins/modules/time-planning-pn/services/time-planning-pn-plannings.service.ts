import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationDataResult, OperationResult } from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';
import {
  TimeFlexesModel,
  TimeFlexesUpdateModel,
  TimePlanningModel,
  TimePlanningsRequestModel,
  TimePlanningsUpdateModel,
  TimePlanningUpdateModel,
} from '../models';
import { TimeClockInModel, TimeClockInUpdateModel } from '../models/clockin/time-clockin.model';

export let TimePlanningPnPlanningsMethods = {
  Plannings: 'api/time-planning-pn/plannings',
  SimplePlannings: 'api/time-planning-pn/plannings/index',
  IndexWorkingHours: 'api/time-planning-pn/working-hours/index',
  WorkingHours: 'api/time-planning-pn/working-hours',
  IndexFlex: 'api/time-planning-pn/flex/index',
  Flex: 'api/time-planning-pn/flex',
  IndexClockIn: 'api/time-planning-pn/clockin/index',
  ClockIn: 'api/time-planning-pn/clockin',  
};

@Injectable({
  providedIn: 'root',
})
export class TimePlanningPnPlanningsService {
  constructor(private apiBaseService: ApiBaseService) {}

  getPlannings(
    model: TimePlanningsRequestModel
  ): Observable<OperationDataResult<TimePlanningModel[]>> {
    return this.apiBaseService.post(
      TimePlanningPnPlanningsMethods.SimplePlannings,
      model
    );
  }

  getWorkingHours(
    model: TimePlanningsRequestModel
  ): Observable<OperationDataResult<TimePlanningModel[]>> {
    return this.apiBaseService.post(
      TimePlanningPnPlanningsMethods.IndexWorkingHours,
      model
    );
  }

  updatePlanning(model: TimePlanningUpdateModel): Observable<OperationResult> {
    return this.apiBaseService.put(
      TimePlanningPnPlanningsMethods.Plannings,
      model
    );
  }

  updateWorkingHours(
    model: TimePlanningsUpdateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.put(
      TimePlanningPnPlanningsMethods.WorkingHours,
      model
    );
  }

  getFlexes(): Observable<OperationDataResult<TimeFlexesModel[]>> {
    return this.apiBaseService.get(TimePlanningPnPlanningsMethods.IndexFlex);
  }

  getClockIn(): Observable<OperationDataResult<TimeClockInModel[]>> {
    return this.apiBaseService.get(TimePlanningPnPlanningsMethods.IndexClockIn); 
  }

  updateFlexes(model: TimeFlexesUpdateModel[]): Observable<OperationResult> {
    return this.apiBaseService.put(TimePlanningPnPlanningsMethods.Flex, model);
  }

  updateClockIn(model: TimeClockInUpdateModel[]): Observable<OperationResult> {
    return this.apiBaseService.put(TimePlanningPnPlanningsMethods.ClockIn, model);
}
}
