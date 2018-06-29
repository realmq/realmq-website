# realmq website

A static site build with hugo, gulp and deployed via netlify to https://realmq.com.
The theme is based on [TheSaas][TheSaas].

## Getting started

In order to hack realmq website locally you need to have hugo static site generator installed.

```bash
# Linux
$ snap install hugo

# macOS
$ brew install hugo
```
If you are not covered read this [installation guide][Hugo Installation Guide].

Next, install the asset build tools:

```bash
$ yarn
# or
$ npm i
```

Then build the project:

```bash
$ yarn build
# or
$ npm run build
```

Finally run the dev pipeline with live reload upon file change.

```bash
$ yarn dev
# or
$ npm run-script dev
```

## Directory Structure

```
|- content          # gonnabe website content/pages
|- data             # .yml, .json and .toml data files
|- layouts          # html templates
|-- 404.html        # 404 error page
|-- index.html      # Home page
|- public           # deploy directory of generated pages and assets
|- src              # asset source directory (scss, img)
|-- img             # images
|-- scss            # entrypoint and theme adjustments
|-- thesaas         # base theme scss sources
|- static           # build directory (css, img)
|- config.toml      # hugo config file
|- gulpfile.js      # asset build pipeline
```

For more information on hugo's directories: [read this article][Hugo Directory Structure]

## Asset build pipeline

* **COMPILE**: The scss files from `src/scss/*` will be compiled into css to `static/css`
* **COPY**: The images from `src/img` will be copies to `static/img`
* **REV**: All generated assets will be [revisioned](Gulp Rev) by appending content hash to their file names.
* **REV**: Revisioned css files will be rewritten to resolve the revisioned assets.
* **REV**: A manifest containing a map of all revisioned assets will be generated to `data/assets.json`

Within templates you have to reference assets via their rev mapping:

```html
<img src="/{{ index .Site.Data.assets "img/some-image.png" }}">
```

There is also a short code:

```html
<img src="{{< asset "img/some-image.png" >}}">
```

## Helpful Resources

* [Hugo Page][Hugo]

[Gulp Rev]: https://www.npmjs.com/package/gulp-rev
[Hugo]: https://gohugo.io
[Hugo Directory Structure]: https://gohugo.io/getting-started/directory-structure/
[Hugo Installation Guide]: https://gohugo.io/getting-started/installing/
[TheSaas]: https://gitlab.com/realmq/thesaas-theme
