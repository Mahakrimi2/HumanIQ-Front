import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { HolidayService } from 'src/app/services/holiday.service';

@Component({
  selector: 'app-add-holiday-request',
  templateUrl: './add-holiday-request.component.html',
  styleUrls: ['./add-holiday-request.component.css'],
})
export class AddHolidayRequestComponent implements OnInit {
  holidayRequestForm!: FormGroup;
  holidayTypes: string[] = [];
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private holidayService: HolidayService,
    private http: HttpClient,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.holidayRequestForm = this.fb.group({
      type: ['', Validators.required],
      startDate: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required],
      file: [null],
    });

    this.holidayService.getHolidayTypes().subscribe(
      (types) => {
        this.holidayTypes = types;
      },
      (error) => {
        console.error('Error fetching holiday types:', error);
      }
    );
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.holidayRequestForm.patchValue({ certificate: file });
    }
  }

  onSubmit(): void {
    if (this.holidayRequestForm.valid) {
      const formData = new FormData();
        const userEmail = this.authService.getUsername();
        if (!userEmail) {
          alert('User email not found. Please log in again.');
          return;
        }
      // formData.append('email', userEmail);
      formData.append('type', this.holidayRequestForm.get('type')?.value);
      formData.append(
        'startDate',
        this.holidayRequestForm.get('startDate')?.value
      );
      formData.append(
        'duration',
        this.holidayRequestForm.get('duration')?.value
      );
      formData.append('reason', this.holidayRequestForm.get('reason')?.value);

      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }
      this.holidayService.createHolidayRequest(userEmail, formData).subscribe(
        (response: any) => {
          console.log('Holiday request created successfully:', response);
          alert('Holiday request submitted successfully!');
          this.holidayRequestForm.reset(); 
          this.selectedFile = null; 
        },
        (error: any) => {
          console.error('Error creating holiday request:', error);
          alert('An error occurred while submitting the request.');
        }
      );
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}
