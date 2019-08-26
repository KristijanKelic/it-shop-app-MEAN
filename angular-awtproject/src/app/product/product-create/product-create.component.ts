import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { mimeTypeValidator } from './mime-type.validator';
import { ProductService } from '../product.service';

@Component({
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  titleFormGroup: FormGroup;
  contentFormGroup: FormGroup;
  categoryFormGroup: FormGroup;
  priceFormGroup: FormGroup;
  imageFormGroup: FormGroup;

  imagePreviewUrl;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.titleFormGroup = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(4)]
      })
    });
    this.contentFormGroup = new FormGroup({
      content: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(200)]
      })
    });
    this.categoryFormGroup = new FormGroup({
      category: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.priceFormGroup = new FormGroup({
      price: new FormControl(null, {
        validators: [Validators.required, Validators.min(1)]
      })
    });
    this.imageFormGroup = new FormGroup({
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeTypeValidator]
      })
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.imageFormGroup.patchValue({ image: file });
    this.imageFormGroup.get('image').updateValueAndValidity();

    // CREATING READER FOR READING FILE
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  onCreate() {
    console.log(this.imageFormGroup.value);
  }
}
