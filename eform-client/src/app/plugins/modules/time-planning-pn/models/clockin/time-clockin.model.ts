import { CommonDictionaryModel } from 'src/app/common/models';

export class TimeClockInModel {
  sdkSiteId: number;
  worker: CommonDictionaryModel = new CommonDictionaryModel();
  date: string;
  clockInTime: number; 
  sumClockIn: number;
  paidOutClockIn: number;
  isActive: boolean; 
}
