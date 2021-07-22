export class Task {
  approvedBy?: string = '';
  campaignId: string = '';
  inProgress: boolean = false;
  isAlloted:  boolean = true;
  isApproved:  boolean = false;
  isRejected:  boolean = false;
  isSubmitted:  boolean = false;
  platform: string = '';
  platformTask: string = '';
  proof?: string = '';
  rejectReason?: string = '';
  rejectedBy?: string = '';
  uid: string = '';
  url: string = '';
}
