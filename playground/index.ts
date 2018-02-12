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
    <div fcLayout="column" class="zero">
      <div fcFlex="33" class="one"></div>

      <div fcFlex="33%" [fcLayout]="direction" class="two">
        <div fcFlex="22%"    class="two_one"></div>
        <div fcFlex="205px"  class="two_two"></div>
        <div fcFlex="30"     class="two_three"></div>
      </div>

      <div fcFlex class="three"></div>
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
