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
  creator?: User;
  attendees?: EventAttendee[];
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  uploadedPfp: boolean;
}

export interface EventAttendee {
  id: string;
  userId: string;
  eventId: string;
  createdAt: Date;
  old: boolean;
  user?: User;
  event?: Event;
}
