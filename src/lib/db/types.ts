export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDateTime: Date;
  endDateTime: Date | null;
  currency: string;
  totalPrice: number;
  maxAttendees: number;
  creatorId: string;
  createdAt: Date;
}
