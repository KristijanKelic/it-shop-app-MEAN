import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { SignupComponent } from './signup/signup.component';

@Injectable()
export class SignUpGuard implements CanDeactivate<SignupComponent> {
  canDeactivate(component: SignupComponent): boolean {
    if (component.form.dirty && !component.formSubmitted) {
      return confirm('Discard changes?');
    }
    return true;
  }
}
