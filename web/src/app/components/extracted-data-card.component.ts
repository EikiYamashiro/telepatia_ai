import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtractedData } from '../services/chat.store';
import { ExtractionEditorComponent } from './extraction-editor.component';

@Component({
  selector: 'app-extracted-data-card',
  standalone: true,
  imports: [CommonModule, ExtractionEditorComponent],
  template: `
    <div class="extracted-data-card">
      <!-- View Mode -->
      <div *ngIf="!isEditing" class="card-header">
        <h4>📋 Extracted Data</h4>
        <button 
          class="btn btn-secondary edit-btn"
          (click)="startEditing()"
          title="Edit data"
        >
          ✏️ Edit Data
        </button>
      </div>
      
      <!-- View Content -->
      <div *ngIf="!isEditing" class="card-content">
        <!-- Symptoms -->
        <div class="data-section" *ngIf="data.symptoms?.length">
          <h5>🩺 Symptoms</h5>
          <div class="symptoms-list">
            <span class="symptom-tag" *ngFor="let symptom of data.symptoms; trackBy: trackBySymptom">
              {{ symptom }}
            </span>
          </div>
        </div>

        <!-- Patient Info -->
        <div class="data-section" *ngIf="data.patient">
          <h5>👤 Patient Information</h5>
          <div class="patient-info">
            <div class="info-row" *ngIf="data.patient?.name">
              <span class="label">Name:</span>
              <span class="value">{{ data.patient.name }}</span>
            </div>
            <div class="info-row" *ngIf="data.patient?.age">
              <span class="label">Age:</span>
              <span class="value">{{ data.patient.age }} years</span>
            </div>
            <div class="info-row" *ngIf="data.patient?.gender">
              <span class="label">Gender:</span>
              <span class="value">{{ data.patient.gender }}</span>
            </div>
            <div class="info-row" *ngIf="data.patient?.identificationNumber">
              <span class="label">CPF:</span>
              <span class="value">{{ data.patient.identificationNumber }}</span>
            </div>
          </div>
        </div>

        <!-- Consultation Reason -->
        <div class="data-section" *ngIf="data.consultationReason">
          <h5>🎯 Consultation Reason</h5>
          <p>{{ data.consultationReason }}</p>
        </div>

        <!-- Additional Notes -->
        <div class="data-section" *ngIf="data.additionalNotes">
          <h5>📝 Additional Notes</h5>
          <p>{{ data.additionalNotes }}</p>
        </div>
      </div>

      <!-- Edit Mode -->
      <app-extraction-editor 
        *ngIf="isEditing"
        [data]="data"
        (onCancel)="cancelEditing()"
        (onApply)="applyChanges($event)"
      ></app-extraction-editor>

      <!-- Action Buttons -->
      <div class="action-buttons" *ngIf="!isEditing">
        <button 
          *ngIf="showGenerateDiagnosisButton"
          class="generate-diagnosis-btn" 
          (click)="onGenerateDiagnosisClick()"
          title="Generate diagnosis based on extracted data"
        >
          🧠 Generate Diagnosis
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./extracted-data-card.component.css']
})
export class ExtractedDataCardComponent {
  @Input() data!: ExtractedData;
  @Input() showGenerateDiagnosisButton = true; // Novo input para controlar visibilidade
  @Output() onEdit = new EventEmitter<void>();
  @Output() onGenerateDiagnosis = new EventEmitter<void>();
  @Output() onDataUpdated = new EventEmitter<ExtractedData>();

  isEditing = false;
  editedSymptoms: string[] = [];
  editedPatient: any = {};
  editedConsultationReason = '';
  editedAdditionalNotes = '';

  ngOnInit() {
    this.resetEditedData();
  }

  startEditing() {
    this.isEditing = true;
    this.resetEditedData();
  }

  cancelEditing() {
    this.isEditing = false;
    this.resetEditedData();
  }

  applyChanges(updatedData: ExtractedData) {
    this.onDataUpdated.emit(updatedData); // Emit updated data to parent
    this.data = updatedData; // Update local data to reflect changes
    this.isEditing = false; // Exit edit mode
  }

  onGenerateDiagnosisClick() {
    this.onGenerateDiagnosis.emit();
    // The button will be hidden by the parent component
  }

  private resetEditedData() {
    this.editedSymptoms = [...this.data.symptoms];
    this.editedPatient = { ...this.data.patient };
    this.editedConsultationReason = this.data.consultationReason || '';
    this.editedAdditionalNotes = this.data.additionalNotes || '';
  }

  trackBySymptom(index: number, symptom: string): string {
    return symptom;
  }
}
