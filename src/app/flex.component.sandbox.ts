import { sandboxOf } from 'angular-playground';
import { FlexCssModule } from '@greg-md/ng-flex-css-layout';
import { AppComponent } from './app.component';

export default sandboxOf(AppComponent, {
  imports: [
    FlexCssModule.forRoot(),
    FlexCssModule,
  ]
})
.add('fcFlex="49%"', {
  template: `
    <div fcLayout="row wrap" fcLayoutAlign="space-between" style="border: 1px solid red;">
      <div fcFlex="49%" style="border: 1px solid blue;">A</div>
      <div fcFlex="49%" style="border: 1px solid blue;">B</div>
      <div fcFlex="49%" style="border: 1px solid blue;">C</div>
    </div>
  `,
});
