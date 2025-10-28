import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent implements OnInit {
  form!: FormGroup;
  schema: Record<string, FormField[]> = {};
  loading = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.loadSchemaFromApi();
  }

  loadSchemaFromApi() {
    of({})
      .pipe(delay(500))
      .subscribe((data) => {
        this.schema = data;
        this.buildForm();
        this.loading = false;
      });
  }

  buildForm() {
    const group: Record<string, FormGroup> = {};
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

  addField(section: string) {
    const fieldName = prompt(`Enter field name for "${section}"`);
    if (!fieldName) return;

    // Choose field type
    const type = prompt(`Enter field type (text, number, select):`, 'text') || 'text';

    const newField: FormField = {
      name: fieldName,
      label: fieldName,
      type,
      required: false,
    };

    if (type === 'select') {
      const opts = prompt('Enter comma-separated options (e.g. Red,Green,Blue):', '');
      newField.options = opts ? opts.split(',').map(o => o.trim()) : [];
    }

    this.schema[section].push(newField);

    const sectionGroup = this.form.get(section) as FormGroup;
    sectionGroup.addControl(fieldName, this.fb.control(null));

    console.log(`✅ Added ${type} field "${fieldName}" to section "${section}"`);
  }

  removeSection(section: string) {
    delete this.schema[section];
    this.form.removeControl(section);
  }

  removeInput(section: string, field: FormField) {
    this.schema[section] = this.schema[section].filter(f => f.name !== field.name);
    const sectionGroup = this.form.get(section) as FormGroup;
    if (sectionGroup?.contains(field.name)) {
      sectionGroup.removeControl(field.name);
    }
  }

  onSubmit() {
    console.log('✅ Final Form Value:', this.form.value);
    console.log('📘 Current Schema:', this.schema);
  }
}
