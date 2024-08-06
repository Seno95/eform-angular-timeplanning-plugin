import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { TimeClockInModel } from '../../../../../models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@AutoUnsubscribe()
@Component({
  selector: 'app-ClockIn-comment-office-update-modal',
  templateUrl: './ClockIn-comment-office-update-modal.component.html',
  styleUrls: ['./ClockIn-comment-office-update-modal.component.scss'],
})
export class ClockInCommentOfficeUpdateModalComponent implements OnInit, OnDestroy {
  timeClockIn: TimeClockInModel = new TimeClockInModel();

  constructor(
    public dialogRef: MatDialogRef<ClockInCommentOfficeUpdateModalComponent>,
    @Inject(MAT_DIALOG_DATA) timeClockIn: TimeClockInModel,
  ) {
    this.timeClockIn = { ...timeClockIn };
  }

  ngOnInit() {
  }

  onUpdateClockInPlanning() {
    this.hide(true);
  }

  hide(result = false) {
    this.dialogRef.close({ result: result, model: { ...this.timeClockIn } });
    this.timeClockIn = new TimeClockInModel();
  }

  ngOnDestroy(): void {
  }
}
