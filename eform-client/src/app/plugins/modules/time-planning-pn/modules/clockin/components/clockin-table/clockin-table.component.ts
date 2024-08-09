import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TimeClockInModel } from '../../../../models/clockin/time-clockin.model';
import { TranslateService } from '@ngx-translate/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { TimePlanningPnPlanningsService } from '../../../../services/time-planning-pn-plannings.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-clockin-table',
  templateUrl: './clockin-table.component.html',
  styleUrls: ['./clockin-table.component.scss'],
})
export class ClockinTableComponent implements OnInit, OnDestroy {
  @Input() ClockInPlannings: TimeClockInModel[] = [];
  @Output()
  ClockInPlanningChanged: EventEmitter<TimeClockInModel> = new EventEmitter<TimeClockInModel>();

  tableHeaders: MtxGridColumn[] = [];

  constructor(
    private translateService: TranslateService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private timePlanningPnPlanningsService: TimePlanningPnPlanningsService
  ) {}

  ngOnInit(): void {
    this.timePlanningPnPlanningsService.getClockIn().subscribe(
      (response) => {
        if (response && response.success) {
          this.ClockInPlannings = response.model;
        } else {
          console.error('Failed to fetch clock-in data', response.message);
          this.ClockInPlannings = [];
        }

        this.initializeTableHeaders();
      },
      (error) => {
        console.error('Error fetching clock-in data', error);
        this.ClockInPlannings = [];
      }
    );
  }

  initializeTableHeaders(): void {
    this.tableHeaders = [
      {
        header: this.translateService.stream('Date'),
        field: 'date',
        type: 'date',
        typeParameter: { format: 'dd.MM.yyyy' }
      },
      {
        header: this.translateService.stream('Worker'),
        field: 'worker',
        formatter: (row: TimeClockInModel) => row.worker ? row.worker.name : 'Unknown',
      },
      {
        header: this.translateService.stream('Clock In Time'),
        field: 'clockInTime',
        formatter: (row: TimeClockInModel) => {
          const date = new Date(row.clockInTime);
          return isNaN(date.getTime()) ? '' : date.toLocaleTimeString();
        },
      },
      {
        header: this.translateService.stream('Active Status'),
        field: 'isActive',
        formatter: (row: TimeClockInModel) => row.isActive ? '<span class="active-indicator" style="color:green">●</span>' : '',
      },
    ];    
  }

  onClockInPlanningChanged(
    paidOutClockIn: number,
    ClockInPlanning: TimeClockInModel
  ) {
    this.ClockInPlanningChanged.emit({
      ...ClockInPlanning,
      paidOutClockIn: paidOutClockIn ?? ClockInPlanning.paidOutClockIn,
    });
  }

  ngOnDestroy(): void {}
}




