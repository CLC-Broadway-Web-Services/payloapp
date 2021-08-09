export interface Withdrawl {
  id?: string;
  uid: string;
  amount: number;
  points: number;
  convertionRate: number;
  isRequested: boolean; // In Process
  isCompleted?: boolean; // Completed / popup to show transaction details
  transactionId?: string;
  transactionProof?: string;
  transactionProofType?: string; // image/text
  isRejected?: boolean; // Rejected / popup to show Reject reason
  rejectReason?: string;
  isOnHold?: boolean; // On Hold / popup to show onHold reason
  onHoldReason?: string;
  upi_id: string;
  timeUpdated?: number;
  timeCreated: number;
}
