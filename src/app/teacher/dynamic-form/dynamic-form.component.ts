import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent implements OnInit {
  form!: FormGroup;
  schema: Record<string, FormField[]> = {}; // e.g. { user: [...], address: [...] }
  loading = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.loadSchemaFromApi();
  }

  loadSchemaFromApi() {
    // ✅ Simulated API returning empty object
    of({})
      .pipe(delay(500))
      .subscribe((data) => {
        this.schema = data;
        this.buildForm();
        this.loading = false;
      });
  }

  buildForm() {
    // ✅ Create form dynamically from schema
    const group: Record<string, FormGroup | FormArray> = {};
    Object.keys(this.schema).forEach((section) => {
      group[section] = this.buildGroup(this.schema[section]);
    });
    this.form = this.fb.group(group);
  }

  buildGroup(fields: FormField[]) {
    const group: any = {};
    fields.forEach((field) => {
      group[field.name] = field.required
        ? [null, Validators.required]
        : [null];
    });
    return this.fb.group(group);
  }

  // ➕ Add a new section (like "user" or "address")
  addSection() {
    const sectionName = prompt('Enter new section name:');
    if (!sectionName) return;

    if (this.schema[sectionName]) {
      alert('Section already exists!');
      return;
    }

    this.schema[sectionName] = [];
    this.form.addControl(sectionName, this.fb.group({}));
  }

  // ➕ Add field inside a specific section
  addField(section: string) {
    const fieldName = prompt(`Enter field name for "${section}"`);
    if (!fieldName) return;

    const newField: FormField = {
      name: fieldName,
      label: fieldName,
      type: 'text',
      required: false,
    };

    this.schema[section].push(newField);
    const sectionGroup = this.form.get(section) as FormGroup;
    sectionGroup.addControl(fieldName, this.fb.control(null));
  }

  removeSection(section: string) {
    delete this.schema[section];
    this.form.removeControl(section);
  }

  removeInput = (section: any, field: any) => {
    // 1️⃣ Remove the field from the schema
    this.schema[section] = this.schema[section].filter(f => f.name !== field.name);

    // 2️⃣ Remove the control from the actual form group
    const sectionGroup = this.form.get(section) as FormGroup;
    if (sectionGroup?.contains(field.name)) {
      sectionGroup.removeControl(field.name);
    }

    console.log(`Removed field "${field.name}" from section "${section}"`);
  }

  onSubmit() {
    console.log('✅ Final form value:', this.form.value);
    console.log('📘 Current schema:', this.schema);
  }
}
