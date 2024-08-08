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
import { dialogConfigHelper } from 'src/app/common/helpers';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

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

  tableHeaders: MtxGridColumn[] = [
    { header: this.translateService.stream('Date'), field: 'date', type: 'date', typeParameter: { format: 'dd.MM.yyyy' } },
    {
      header: this.translateService.stream('Worker'),
      field: 'worker',
      formatter: (row: TimeClockInModel) => row.worker ? row.worker.name : '',
    },
    { header: this.translateService.stream('SumClockIn'), field: 'sumClockIn' },
    { header: this.translateService.stream('Comment office'), field: 'commentOffice' },
  ];

  constructor(
    private translateService: TranslateService,
    private dialog: MatDialog,
    private overlay: Overlay,
  ) {}

  ngOnInit(): void {}

  onClockInPlanningChanged(paidOutClockIn: number, ClockInPlanning: TimeClockInModel) {
    this.ClockInPlanningChanged.emit({
      ...ClockInPlanning,
      paidOutClockIn: paidOutClockIn ?? ClockInPlanning.paidOutClockIn,
    });
  }

  ngOnDestroy(): void {}
}


