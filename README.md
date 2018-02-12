# Angular Flex-CSS-Layout

[![npm version](https://badge.fury.io/js/%40greg-md%2Fng-flex-css-layout.svg)](https://badge.fury.io/js/%40greg-md%2Fng-flex-css-layout)
[![Build Status](https://travis-ci.org/greg-md/ng-flex-css-layout.svg?branch=master)](https://travis-ci.org/greg-md/ng-flex-css-layout)

**Flex-CSS-Layout** is an alternative behaviour of [Flex-Layout](https://github.com/angular/flex-layout) directives,
that will still work with Angular Universal and App Shell.
It is not meant to replace [Flex-Layout](https://github.com/angular/flex-layout). You can freely use both modules on your needs.

The Flex-CSS-Layout engine intelligently generates internal style sheets(inside of `<style>` tags) rather than inline styles
and leaves the CSS Media queries to be responsible of the layout.

# Table of Contents:

* [Installation](#installation)
* [How It Works](#how-it-works)
* [License](#license)
* [Huuuge Quote](#huuuge-quote)

## Installation

To install this library, run:

```bash
$ npm install @greg-md/ng-flex-css-layout --save
```

# How It Works

Please read [Flex-Layout](https://github.com/angular/flex-layout/wiki) documentation first.

To take advantage of Flex-CSS-Layout features, you will have to change the prefix of Flex-Layout directives
from `fx` to `fc`(which is **F**lex**C**ss).

Flex-CSS-Layout currently supported directives(including [Responsive API](https://github.com/angular/flex-layout/wiki/Responsive-API)):

| Flex-Layout  | Flex-CSS-Layout |
| ------------- | ------------- |
| fxLayout | fcLayout |
| fxLayoutAlign | fcLayoutAlign |
| fxLayoutGap | fcLayoutGap |
| fxFlex | fcFlex |
| fxFlexOrder | fcFlexOrder |
| fxFlexOffset | fcFlexOffset |
| fxFlexAlign | fcFlexAlign |
| fxFlexFill | fcFlexFill |

> **Note**: In some specific cases `fc*` directives may have different results then `fx*` directives.

## Setting up in a module

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// 1. Import FlexCssModule;
import { FlexCssModule } from '@greg-md/ng-flex-css-layout';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    // 2. Register FlexCssModule providers in root module;
    FlexCssModule.forRoot(),

    // 3. Import FlexCssModule directives to specific modules.
    FlexCssModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Using in views

```angular2html
<div fcLayout="column">
  <div fcFlex="33">One</div>

  <div fcFlex="33%" [fcLayout]="direction">
    <div fcFlex="22%">Two One</div>
    <div fcFlex="205px">Two Two</div>
    <div fcFlex="30">Two Three</div>
  </div>

  <div fcFlex>Three</div>
</div>
```

# License

MIT © [Grigorii Duca](http://greg.md)

# Huuuge Quote

![I fear not the man who has practiced 10,000 programming languages once, but I fear the man who has practiced one programming language 10,000 times. #horrorsquad](http://greg.md/huuuge-quote-fb.jpg)
