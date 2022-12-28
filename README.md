# gulp-pug-rig

A template repo for building locally-compiled static sites using [Gulp](https://gulpjs.com/), [Pug](https://pugjs.org/), [Sass](https://sass-lang.com/), and [Webpack](https://webpack.js.org/).

There's a number of quality-of-life customizations built into the Gulp processes in this template repo using bespoke node packages.

1. [getting started](#getting-started)
    1. [setup](#setup)
    1. [compiling and browsersync](#compiling-and-browsersynce)
1. [pug](#pug)
    1. [auto-indexing of mixins](#auto-indexing-of-mixins)
    1. [auto-compiling into directory paths](#compiling-into-directory-paths)
        1. [naming-convention examples](#naming-convention-examples)
    1. [unique `<head>` content for each page](unique-head-content-for-each-page)
1. [sass](#sass)
    1. [auto-indexing of mixins, partials, and vendor styles](#auto-indexing-of-mixins-partials-and-vendor-styles)
    1. [tachyons utility classes](#tachyons-utility-classes)
    1. [`@extend` at-rule shorthand syntax](#extend-at-rule-shorthand-syntax)
        1. [sass shorthand examples](#sass-shorthand-examples)
1. [json-ld](#json-ld)
    1. [pug to json](#pug-to-json)
        1. [file-setup](#file-setup)
        1. [syntax examples](#syntax-examples)


## getting started

### setup
1. If you haven't already, [use nvm to install node and npm](https://www.codementor.io/mercurial/how-to-install-node-js-on-macos-sierra-mphz41ekk)
2. If you haven't already, globally install the gulp command line tools: `npm install --global gulp-cli`
3. Clone this repo
4. In the project folder, install the node package dependencies: `npm install`

### compiling and browsersync
Run the default Gulp task (`gulp` or `gulp default`) in the project root to compile all files, watch for future changes, and start up [Browsersync](https://browsersync.io/). See the [`/gulpfile.js`](https://github.com/sposhe/gulp-pug-rig/blob/master/gulpfile.js) file for the more granular compilation and watch tasks you can run.

Compiled files (for the most part) end up in the `/docs/` directory, which is helpful if the site is to be hosted on [GitHub Pages](https://pages.github.com/).

## pug

### auto-indexing of mixins
The [`component-indexer`](https://www.npmjs.com/package/component-indexer) module makes the `/src/pug/mixins/_index.pug` file automatically update to include `include` references to all the other Pug files in that `/src/pug/mixins/` directory when Gulp is running. Including that `/src/pug/mixins/_index.pug` file elsewhere will in turn make all mixins available within that scope.

### auto-compiling into directory paths
Instead of compiling to HTML files like `/about.html` and `/about-our-team.html` that exist in the root directory and have to have a file extension in the URL, the [`gulp-url-builder`](https://www.npmjs.com/package/gulp-url-builder) package makes it possible to easily compile as index files in (optionally nested) directories based on a Pug file naming convention. So those previously mentioned pages can instead exist at `/about/` and `/about/our-team/`.

The Pug files in the `/src/pug/views/` directory are what get compiled into HTML pages. Name files with hyphens delimiting words. If the file should exist in a directory path, prepend the necessary directory names to the Pug file name, delimiting each with underscores.

#### naming-convention examples
All hypothetical pug files below exist in the `/src/pug/views/` directory.

| pug filename | compiles to | accessible at |
| --- | --- | --- |
| `index.pug` | `/docs/index.html` | `/` |
| `about.pug` | `/docs/about/index.html` | `/about/` |
| `about_our-team.pug` | `/docs/about/our-team/index.html` | `/about/our-team/` |

### unique `<head>` content for each page
The `/src/pug/templates/_root.pug` file has a `head` block inside the `<head>` element. The contents and attributes of the `<title>` element, OpenGraph meta tags, and canonical link all rely on variables passed up from the Pug view file extending that template. See [`/src/pug/views/index.pug`](https://github.com/sposhe/gulp-pug-rig/blob/master/src/pug/views/index.pug) for an example of how to extend the root template with the necessary variables.

## sass

### auto-indexing of mixins, partials, and vendor styles
The [`component-indexer`](https://www.npmjs.com/package/component-indexer) module makes the `_index.pug` file in the `/mixins/`, `/partials/`, and `/views/` directories automatically update to include `import` references to all other Sass files in those directories. This makes importing everything into the main `styles.scss` file easier.

Note that partials are imported in alphabetical order, which could cause cascade issues if you aren't careful. The auto-indexing of any directory can be turned off if needed.

Normalize is automatically included as a vendor stylesheet.

### tachyons utility classes
The [Tachyons](https://tachyons.io/) utility class library is automatically included as a vendor stylesheet. All of the classes have been transformed into [placeholder selectors](https://sass-lang.com/documentation/style-rules/placeholder-selectors) which means the classes can't be used directly in HTML. Instead they must be extended using the [`@extend` at-rule](https://sass-lang.com/documentation/at-rules/extend) within other selectors. Because the library has been transformed into placeholder selectors, any unused utility classes will automatically be ignored when Sass compiles.

### `@extend` at-rule shorthand syntax
The [gulp-sass-extend-shorthand](https://www.npmjs.com/package/gulp-sass-extend-shorthand) module provides a shorthand for extending classes and placeholder selectors in Sass. This makes it much quicker to frequently extend a utility class library that has been transformed into placeholder selectors.

In order for a file to be processed by this package, it must be prefixed with `%`. These files are processed by the Sass Gulp tasks first, and are then output as regular Sass files with the expanded syntax and the same filename (with the `%` replaced with a `_`). These new files can be imported into other Sass files as needed.

#### sass shorthand examples
Additionally see [`/src/scss/partials/%hello-world.scss`](https://github.com/sposhe/gulp-pug-rig/blob/master/src/scss/partials/%hello-world.scss) for an example of how to use this syntax while referencing Tachyons utilities.

##### example: basic syntax
```scss
// shorthand
.myClass {
  .myMixin;
}
```
```scss
// is expanded to
.myClass {
  @extend .myMixin;
}
```

##### example: placeholder selectors
```scss
// shorthand
.myClass {
  %myPlaceholderSelector;
}
```
```scss
// is expanded to
.myClass {
  @extend %myPlaceholderSelector;
}
```

##### example: inline list syntax
```scss
// shorthand
.myClass {
  .mixinA, .mixinB, .mixinC;
}
```
```scss
// is expanded to
.myClass {
  @extend .mixinA;
  @extend .mixinB;
  @extend .mixinC;
}
```

##### example: stacked list syntax
```scss
// shorthand
.myClass {
  .mixinA,
  .mixinB,
  .mixinC;
}
```
```scss
// is expanded to
.myClass {
  @extend .mixinA;
  @extend .mixinB;
  @extend .mixinC;
}
```

##### example: using `!optional`
```scss
// shorthand
.myClass {
  .mixinA, .mixinB !optional;
  .mixinC;
}
```
```scss
// is expanded to
.myClass {
  @extend .mixinA !optional;
  @extend .mixinB !optional;
  @extend .mixinC;
}
```

## json-ld
[JSON-LD](https://json-ld.org/) is a format for providing linked data in JSON format—commonly used to add [Schema.org](https://schema.org/) structured data to webpages via inclusion within a `<script>` element in the document `<head>`.

JSON-LD can take awhile to write, so this template provides a way to author JSON-LD using Pug syntax.

### pug to json
Files with the `.json.pug` compound extension within the `/src/json/` directory are processed by Gulp and then output as two true JSON files within the same directory—one minified, one formatted. This Gulp task is run before the Pug tasks, so Pug files can `include` the minified JSON within `script` elements to add the structured data to each page.

#### file setup
XML is used as an intermediary between Pug and JSON, and as such, each `.json.pug` must explicitly provide an XML doctype.

The JSON-LD markup must be wrapped in `root` and `entity` elements because of how the intermediary process works. See [`/src/json/index.json.pug`](https://github.com/sposhe/gulp-pug-rig/blob/master/src/json/index.json.pug) for an example.

#### syntax examples

##### properties and values
Pug elements become JSON property names, and the text content of those elements become the values of those properties.
```pug
foo bar
```
becomes
```json
{
  "foo": "bar"
}
```

##### nested objects
Nested Pug elements become nested objects.
```pug
lorem
  foo bar
  consecutor
    amit nunc
```
becomes
```json
{
  "lorem": {
    "foo": "bar",
    "consecutor": {
      "amit": "nunc"
    }
  }
}
```

##### arrays
Duplicate pug elements are combined into arrays.
```pug
palette
  id 1
  colors red
  colors green
  colors blue
```
becomes
```json
{
  "palette": {
    "id": "1",
    "colors": [
      "red",
      "green",
      "blue"
    ]
  }
}
```

##### syntax for syntax tokens
JSON-LD [syntax tokens](https://www.w3.org/TR/json-ld/#syntax-tokens-and-keywords)—property names that start with `@`, such as `@context`—must be written in a special format because XML is used as an intermediary and `@` is invalid in XML element names. Instead, syntax tokens need to be prefixed with `at-`. So instead of writing `@context`, write `at-context`.
```pug
at-context http://www.schema.org
at-type Person
name Jean-Luc Picard
jobTitle Captian
```
becomes
```json
{
  "@context": "http://www.schema.org",
  "@type": "Person",
  "name": "Jean-Luc Picard",
  "jobTitle": "Captian"
}
```







