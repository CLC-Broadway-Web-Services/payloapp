export class Task {
  id?: string;
  approvedBy?: string = '';
  campaignId: string = '';
  inProgress: boolean = false;
  isAlloted: boolean = true;
  isApproved: boolean = false;
  isRejected: boolean = false;
  isSubmitted: boolean = false;
  isExpired: boolean = false;
  platform: string = '';
  platformTask: string;
  proof?: string = '';
  rejectReason?: string = '';
  rejectedBy?: string = '';
  uid: string = '';
  userEmail: string = '';
  userName: string = '';
  url: string = '';
  allotedDateNum: number = Date.now();
  allotedDate: string = '';
  approvedDate: number = 0;
  pointPerTask: number = 0;
  howToTask: {
    title: string,
    image: string,
    description: string
  }
}
