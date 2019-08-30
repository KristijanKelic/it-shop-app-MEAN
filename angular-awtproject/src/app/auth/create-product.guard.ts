import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { ProductCreateComponent } from './product-create/product-create.component';

@Injectable()
export class CreateProductGuard implements CanDeactivate<ProductCreateComponent> {
  canDeactivate(component: ProductCreateComponent): boolean {
    if (component.titleFormGroup.dirty && !component.formSubmitted) {
      return confirm('Discard changes?');
    }
    return true;
  }
}
