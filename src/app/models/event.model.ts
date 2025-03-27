export interface Event {
  id?: number;
  title?: string;
  startDateTime?: string ;
  endDateTime?: string ;
  description?: string;
  location?: string;
  type: 'ONLINE' | 'IN_PERSON' | 'HYBRID';
  creator?: any;
}
