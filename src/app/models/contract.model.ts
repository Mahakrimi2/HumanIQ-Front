export class Contract {
  id!: number;
  contractType!: string;
  description!: string;
  startDate!: Date;
  endDate!: Date;
  workingHours!: number;
  benefits!: string;
  salary!: number;
  Signed!: boolean;
  status!: string;
  userId!: number;
  
  archived!:Boolean;
}
