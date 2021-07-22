export interface Profile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified?: boolean;
  city?: string;
  dob?: string;
  state?: string;
  phoneNumber?: string;
  myInviteCode: string;
  inviteCode: string;
}
