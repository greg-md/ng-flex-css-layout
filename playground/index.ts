/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { FlexCssModule }  from '@greg-md/ng-flex-css-layout';

@Component({
  selector: 'app',
  template: `
    <div fcLayout="column">
      <div fcFlex="33">One</div>

      <div fcFlex="33%" [fcLayout]="direction">
        <div fcFlex="22%">Two One</div>
        <div fcFlex="205px">Two Two</div>
        <div fcFlex="30">Two Three</div>
      </div>

      <div fcFlex>Three</div>
    </div>

    <div fcHide [fcShow.gt-sm]="true">
      fcHide [fcShow.gt-sm]="true"
    </div>
  `
})
class AppComponent {
  direction = 'row';
}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, FlexCssModule.forRoot() ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
