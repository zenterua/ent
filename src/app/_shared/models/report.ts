export interface ReportModel {
  reportId:string;	
  draft: boolean;
  submitter: string;
  musicUsage: Array<string>;
  amount: string;
  dateCreate:any;
  dateUpdate: any;
}