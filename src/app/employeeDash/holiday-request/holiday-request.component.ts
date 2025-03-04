import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HolidayService } from 'src/app/services/holiday.service';

@Component({
  selector: 'app-holiday-request',
  templateUrl: './holiday-request.component.html',
  styleUrls: ['./holiday-request.component.css'],
})
export class HolidayRequestComponent {
onFileChange($event: Event) {
throw new Error('Method not implemented.');
}
  holidayRequestForm: FormGroup<any> | undefined;

  demandeCongeForm: any;
  holidayTypes!: string[];

  constructor(
    private fb: FormBuilder,
    private holidayService: HolidayService
  ) {}

  ngOnInit(): void {
    this.holidayRequestForm = this.fb.group({
      type: ['', Validators.required],
      startDate: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required],
      certificate: [null],
    });
    this.holidayService.getHolidayTypes().subscribe(
      (types) => {
        this.holidayTypes = types;
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des types de congé:',
          error
        );
      }
    );
  }

  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   this.holidayRequestForm.patchValue({
  //     certificate: file,
  //   });
  // }
  // onSubmit() {
  //   if (this.holidayRequestForm.valid) {
  //     console.log('Form submitted:', this.holidayRequestForm.value);
  //     // Envoyer les données au backend
  //   }
  // }
}
