import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TimeFlexesModel } from '../../../../models';
import {
  ClockinCommentOfficeAllUpdateModalComponent,
  ClockinCommentOfficeUpdateModalComponent,
} from '..';
import { TranslateService } from '@ngx-translate/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { dialogConfigHelper } from 'src/app/common/helpers';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { TimeClockInModel } from '../../../../models/clockin/time-clockin.model';

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
  editCommentOfficeModal: ClockinCommentOfficeUpdateModalComponent;

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

  ClockinCommentOfficeUpdateModalComponentAfterClosedSub$: Subscription;
  ClockinCommentOfficeAllUpdateModalComponentAfterClosedSub$: Subscription;

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

  onCommentOfficeClick(model: TimeClockInModel) {
    this.ClockinCommentOfficeUpdateModalComponentAfterClosedSub$ = this.dialog
      .open(ClockinCommentOfficeUpdateModalComponent, { ...dialogConfigHelper(this.overlay, model) })
      .afterClosed()
      .subscribe((x) => (x.result ? this.onClockInPlanningChanged(null, x.model) : undefined));
  }

  onCommentOfficeAllClick(model: TimeClockInModel) {
    this.ClockinCommentOfficeAllUpdateModalComponentAfterClosedSub$ = this.dialog
      .open(ClockinCommentOfficeAllUpdateModalComponent, { ...dialogConfigHelper(this.overlay, model) })
      .afterClosed()
      .subscribe((x) => (x.result ? this.onClockInPlanningChanged(null, x.model) : undefined));
  }

  ngOnDestroy(): void {}
}

