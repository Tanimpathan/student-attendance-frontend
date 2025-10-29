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
  options?: string[];
  isRepeatable?: boolean;
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
  Object = Object;

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
    const group: Record<string, FormGroup | FormArray> = {};
    Object.keys(this.schema).forEach((section) => {
      group[section] = this.buildGroup(this.schema[section]);
    });
    this.form = this.fb.group(group);
  }

  buildGroup(fields: FormField[]) {
    const group: any = {};
    fields.forEach((field) => {
      if (field.isRepeatable) {
        // Create FormArray for repeatable fields with one initial row
        group[field.name] = this.fb.array([this.createFieldControl(field)]);
      } else {
        group[field.name] = this.createFieldControl(field);
      }
    });
    return this.fb.group(group);
  }

  createFieldControl(field: FormField) {
    return field.required ? this.fb.control(null, Validators.required) : this.fb.control(null);
  }

  getFieldArray(section: string, fieldName: string): FormArray {
    const sectionGroup = this.form.get(section) as FormGroup;
    return sectionGroup.get(fieldName) as FormArray;
  }

  addRow(section: string, field: FormField) {
    const fieldArray = this.getFieldArray(section, field.name);
    fieldArray.push(this.createFieldControl(field));
  }

  removeRow(section: string, fieldName: string, index: number) {
    const fieldArray = this.getFieldArray(section, fieldName);
    if (fieldArray.length > 1) {
      fieldArray.removeAt(index);
    } else {
      alert('At least one row is required!');
    }
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

    const type = prompt(`Enter field type (text, number, email, select):`, 'text') || 'text';
    const isRepeatable = confirm('Should this field be repeatable (add/remove rows)?');

    const newField: FormField = {
      name: fieldName,
      label: fieldName,
      type,
      required: false,
      isRepeatable
    };

    if (type === 'select') {
      const opts = prompt('Enter comma-separated options (e.g. Red,Green,Blue):', '');
      newField.options = opts ? opts.split(',').map(o => o.trim()) : [];
    }

    this.schema[section].push(newField);

    const sectionGroup = this.form.get(section) as FormGroup;
    if (isRepeatable) {
      sectionGroup.addControl(fieldName, this.fb.array([this.createFieldControl(newField)]));
    } else {
      sectionGroup.addControl(fieldName, this.createFieldControl(newField));
    }

    console.log(`✅ Added ${type} field "${fieldName}" to section "${section}" (Repeatable: ${isRepeatable})`);
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
    console.log('Final Form Value:', this.form.value);
    console.log('Current Schema:', this.schema);
    console.log('Form Valid:', this.form.valid);
  }
}