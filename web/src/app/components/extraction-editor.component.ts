import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExtractedData } from '../services/chat.store';

@Component({
  selector: 'app-extraction-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="extraction-editor">
      <div class="editor-header">
        <h4>✏️ Edit Extracted Data</h4>
        <div class="editor-actions">
          <button 
            class="btn btn-secondary"
            (click)="onCancel.emit()"
            title="Cancel editing"
          >
            ❌ Cancel
          </button>
          <button 
            class="btn btn-primary"
            (click)="applyChanges()"
            title="Apply changes"
          >
            ✅ Apply
          </button>
        </div>
      </div>
      
      <div class="editor-content">
        <!-- Symptoms -->
        <div class="editor-section">
          <h5>🩺 Symptoms</h5>
          <div class="symptoms-editor">
            <div class="symptom-item" *ngFor="let symptom of editedSymptoms; trackBy: trackByIndex; let i = index">
              <input 
                type="text" 
                [(ngModel)]="editedSymptoms[i]" 
                class="symptom-input"
                placeholder="Enter symptom"
              />
              <button 
                class="btn btn-danger remove-btn"
                (click)="removeSymptom(i)"
                title="Remove symptom"
              >
                🗑️
              </button>
            </div>
            <button 
              class="btn btn-secondary add-btn"
              (click)="addSymptom()"
              title="Add symptom"
            >
              ➕ Add Symptom
            </button>
          </div>
        </div>

        <!-- Patient Info -->
        <div class="editor-section">
          <h5>👤 Patient Information</h5>
          <div class="patient-editor">
            <div class="form-row">
              <label>Name:</label>
              <input 
                type="text" 
                [(ngModel)]="editedPatient.name" 
                class="form-input"
                placeholder="Patient name"
              />
            </div>
            <div class="form-row">
              <label>Age:</label>
              <input 
                type="number" 
                [(ngModel)]="editedPatient.age" 
                class="form-input"
                placeholder="Age"
                min="0"
                max="150"
              />
            </div>
            <div class="form-row">
              <label>Gender:</label>
              <select [(ngModel)]="editedPatient.gender" class="form-input">
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div class="form-row">
              <label>ID:</label>
              <input 
                type="text" 
                [(ngModel)]="editedPatient.identificationNumber" 
                class="form-input"
                placeholder="ID or identification number"
              />
            </div>
          </div>
        </div>

        <!-- Consultation Reason -->
        <div class="editor-section">
          <h5>🎯 Consultation Reason</h5>
          <textarea 
            [(ngModel)]="editedConsultationReason" 
            class="form-textarea"
            rows="3"
            placeholder="Describe the consultation reason"
          ></textarea>
        </div>

        <!-- Additional Notes -->
        <div class="editor-section">
          <h5>📝 Additional Notes</h5>
          <textarea 
            [(ngModel)]="editedAdditionalNotes" 
            class="form-textarea"
            rows="3"
            placeholder="Relevant additional notes"
          ></textarea>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./extraction-editor.component.css']
})
export class ExtractionEditorComponent implements OnInit {
  @Input() data!: ExtractedData;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onApply = new EventEmitter<ExtractedData>();

  // Local copies for editing
  editedSymptoms: string[] = [];
  editedPatient: any = {};
  editedConsultationReason = '';
  editedAdditionalNotes = '';

  ngOnInit() {
    this.initializeEditor();
  }

  private initializeEditor() {
    // Clone the data to avoid modifying the original
    this.editedSymptoms = [...(this.data.symptoms || [])];
    this.editedPatient = { ...this.data.patient };
    this.editedConsultationReason = this.data.consultationReason || '';
    this.editedAdditionalNotes = this.data.additionalNotes || '';
  }

  addSymptom() {
    this.editedSymptoms.push('');
  }

  removeSymptom(index: number) {
    this.editedSymptoms.splice(index, 1);
  }

  applyChanges() {
    // Filter out empty symptoms
    const filteredSymptoms = this.editedSymptoms.filter(s => s.trim() !== '');
    
    const updatedData: ExtractedData = {
      symptoms: filteredSymptoms,
      patient: this.editedPatient,
      consultationReason: this.editedConsultationReason.trim(),
      additionalNotes: this.editedAdditionalNotes.trim() || undefined
    };

    this.onApply.emit(updatedData);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
