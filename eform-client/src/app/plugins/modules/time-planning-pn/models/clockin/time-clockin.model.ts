import { CommonDictionaryModel } from 'src/app/common/models';

export class TimeClockInModel {
  sdkSiteId: number;
  worker: CommonDictionaryModel = new CommonDictionaryModel();
  date: string;
  clockInHours: number;
  sumClockIn: number;
  paidOutClockIn: number;
  commentWorker: string;
  commentOffice: string;
  commentOfficeAll: string;
}