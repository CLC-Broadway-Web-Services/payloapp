import { Wallet } from "./wallet";
import { Withdrawl } from "./Withdrawl";

export interface Profile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified?: boolean;
  city?: string;
  dob?: string;
  state?: string;
  country?: string;
  phoneNumber?: string;
  phoneNumberVerify?: boolean;
  myInviteCode: string;
  inviteCode: string;
  wallet?: Wallet;
  myWithdrawlsRequests?: Withdrawl[];
  myWithdrawlsCompleted?: Withdrawl[];
  myWithdrawlsRejected?: Withdrawl[];
  totalReferrals?: number;
  completedTasks?: number;
  claim: string;
}
