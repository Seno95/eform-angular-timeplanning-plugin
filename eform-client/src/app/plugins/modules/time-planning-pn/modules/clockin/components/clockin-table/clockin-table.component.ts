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

@AutoUnsubscribe()
@Component({
  selector: 'app-clockin-table',
  templateUrl: './clockin-table.component.html',
  styleUrls: ['./clockin-table.component.scss'],
})
export class ClockinTableComponent implements OnInit, OnDestroy {
  @Input() flexPlannings: TimeFlexesModel[] = [];
  @Output()
  flexPlanningChanged: EventEmitter<TimeFlexesModel> = new EventEmitter<TimeFlexesModel>();
  editCommentOfficeModal: ClockinCommentOfficeUpdateModalComponent;

  tableHeaders: MtxGridColumn[] = [
    { header: this.translateService.stream('Date'), field: 'date', type: 'date', typeParameter: { format: 'dd.MM.yyyy' } },
    {
      header: this.translateService.stream('Worker'),
      field: 'worker',
      formatter: (row: TimeFlexesModel) => row.worker ? row.worker.name : '',
    },
    { header: this.translateService.stream('SumFlex'), field: 'sumFlex' },
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

  onFlexPlanningChanged(paidOutFlex: number, flexPlanning: TimeFlexesModel) {
    this.flexPlanningChanged.emit({
      ...flexPlanning,
      paidOutFlex: paidOutFlex ?? flexPlanning.paidOutFlex,
    });
  }

  onCommentOfficeClick(model: TimeFlexesModel) {
    this.ClockinCommentOfficeUpdateModalComponentAfterClosedSub$ = this.dialog
      .open(ClockinCommentOfficeUpdateModalComponent, { ...dialogConfigHelper(this.overlay, model) })
      .afterClosed()
      .subscribe((x) => (x.result ? this.onFlexPlanningChanged(null, x.model) : undefined));
  }

  onCommentOfficeAllClick(model: TimeFlexesModel) {
    this.ClockinCommentOfficeAllUpdateModalComponentAfterClosedSub$ = this.dialog
      .open(ClockinCommentOfficeAllUpdateModalComponent, { ...dialogConfigHelper(this.overlay, model) })
      .afterClosed()
      .subscribe((x) => (x.result ? this.onFlexPlanningChanged(null, x.model) : undefined));
  }

  ngOnDestroy(): void {}
}

