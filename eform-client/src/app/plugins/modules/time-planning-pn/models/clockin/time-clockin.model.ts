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

export class TimeClockInUpdateModel {
  sdkSiteId: number;
  workerId: number; // Assuming worker update would be based on ID
  date: string;
  clockInHours: number;
  sumClockIn: number;
  paidOutClockIn: number;
  commentWorker: string;
  commentOffice: string;
  commentOfficeAll: string;
}
