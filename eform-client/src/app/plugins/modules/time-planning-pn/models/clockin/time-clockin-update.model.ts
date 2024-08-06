import { CommonDictionaryModel } from 'src/app/common/models';

export class TimeClockInUpdateModel {
  sdkSiteId: number;
  worker: CommonDictionaryModel;
  date: string;
  sumClockIn: number;
  paidOutClockIn: number;
  commentOffice: string;
  commentOfficeAll: string;
}
