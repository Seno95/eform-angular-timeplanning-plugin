import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  TemplateRef,
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
  @Output() ClockInPlanningChanged: EventEmitter<TimeClockInModel> = new EventEmitter<TimeClockInModel>();

  @ViewChild('timePlanningClockInDateTpl', { static: true }) timePlanningClockInDateTpl!: TemplateRef<any>;
  @ViewChild('timePlanningClockInWorkerTpl', { static: true }) timePlanningClockInWorkerTpl!: TemplateRef<any>;
  @ViewChild('timePlanningClockInTimeTpl', { static: true }) timePlanningClockInTimeTpl!: TemplateRef<any>;
  @ViewChild('timePlanningActiveStatusTpl', { static: true }) timePlanningActiveStatusTpl!: TemplateRef<any>;

  tableHeaders: MtxGridColumn[] = [];

  constructor(
    private translateService: TranslateService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private timePlanningPnPlanningsService: TimePlanningPnPlanningsService
  ) {}

  ngOnInit(): void {
    this.initializeTableHeaders();
    this.timePlanningPnPlanningsService.getClockIn().subscribe(
      (response) => {
        if (response && response.success) {
          this.ClockInPlannings = response.model.map(item => {
            if (item.clockInTime) {
              item.clockInTime = new Date(item.clockInTime);
            }
            return item;
          });
          console.log(this.ClockInPlannings);
        } else {
          console.error('Failed to fetch clock-in data', response.message);
          this.ClockInPlannings = [];
        }
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
        cellTemplate: this.timePlanningClockInDateTpl,
      },
      {
        header: this.translateService.stream('Worker'),
        field: 'worker',
        cellTemplate: this.timePlanningClockInWorkerTpl,
      },
      {
        header: this.translateService.stream('Clock In Time'),
        field: 'clockInTime',
        cellTemplate: this.timePlanningClockInTimeTpl,
      },
      {
        header: this.translateService.stream('Active Status'),
        field: 'isActive',
        cellTemplate: this.timePlanningActiveStatusTpl,
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
