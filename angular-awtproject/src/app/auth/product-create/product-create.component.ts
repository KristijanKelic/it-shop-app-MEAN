import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { mimeTypeValidator } from './mime-type.validator';
import { ProductService } from '../../product/product.service';
import { Product } from '../../product/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  isLoading = false;
  productId;
  product: Product;
  mode = 'create';
  formSubmittedStatus: Subscription;
  formSubmitted = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    /* Creating forms using reactive approach */
    this.formSubmittedStatus = this.productService
      .getformSubmitted()
      .subscribe(result => (this.formSubmitted = result));

    this.titleFormGroup = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(4)]
      })
    });
    this.contentFormGroup = new FormGroup({
      content: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(800),
          Validators.minLength(50)
        ]
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

    /* Subscribing to route parameters to check if url has id and popule form fileds with corresponding data,
      same component is used for creating and editing product so if we have id in route parameters that means
      that we are updating exsisting product */
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.productId = paramMap.get('id');
        this.isLoading = true;
        this.productService.getProduct(this.productId).subscribe(
          result => {
            this.isLoading = false;
            this.product = {
              _id: result.product._id,
              title: result.product.title,
              content: result.product.content,
              category: result.product.category,
              price: result.product.price,
              image: result.product.image,
              userId: result.product.creator
            };
            this.titleFormGroup.setValue({ title: this.product.title });
            this.contentFormGroup.setValue({ content: this.product.content });
            this.categoryFormGroup.setValue({
              category: this.product.category
            });
            this.priceFormGroup.setValue({ price: this.product.price });
            this.imageFormGroup.setValue({ image: this.product.image });
          },
          error => {
            this.isLoading = false;
            this.snackBar.open(error.error.message, '', {
              duration: 2000
            });
            this.router.navigate(['/']);
          }
        );
      }
    });
  }

  /* When we pick and image we create file reader to read it */
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

  /* One method to handle creation and update of product. The action depends on propery mode */
  onCreate() {
    const product = {
      title: this.titleFormGroup.get('title').value,
      content: this.contentFormGroup.get('content').value,
      category: this.categoryFormGroup.get('category').value,
      image: this.imageFormGroup.get('image').value,
      price: this.priceFormGroup.get('price').value,
      userId: null
    };
    if (this.mode === 'create') {
      this.productService.addProduct(product);
    } else {
      (product as Product)._id = this.product._id;
      this.productService.updateProduct(product);
    }
  }
}
