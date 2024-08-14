import { CommonDictionaryModel } from 'src/app/common/models';

export class TimeClockInModel {
  sdkSiteId: number;
  worker: CommonDictionaryModel = new CommonDictionaryModel();
  date: Date;
  clockInTime: Date;
  sumClockIn: number;
  paidOutClockIn: number;
  isActive: boolean; 
}

