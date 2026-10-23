# Eunki's Salon

Go to [⭐️ blog ⭐️](https://eunkiyomi.github.io/).

A [Jekyll](https://jekyllrb.com/) site hosted on GitHub Pages, using the
[no-style-please](https://github.com/riggraz/no-style-please) remote theme.

## Install

You need Ruby and Bundler. This repo pins Ruby 3.3.6 in `.ruby-version`.
Ruby 4.x can't install the `github-pages` gem set.

```sh
# Install Ruby 3.3.6 with rbenv (Homebrew on macOS)
brew install rbenv ruby-build
rbenv install            # installs the version in .ruby-version

# Let rbenv pick the Ruby version in your shell, then open a new terminal
echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc

# Install the gems
bundle install
```

Check with `ruby -v` that you're on 3.3 before running `bundle install`. If
it still says 4.x, your shell isn't using rbenv yet.

If you have a `Gemfile.lock` from an older setup and Jekyll crashes with
``undefined method `[]' for nil`` in `logger.rb`, update the gems:

```sh
bundle update github-pages
```

## Run locally

```sh
bundle exec jekyll serve
```

Then open <http://localhost:4000>. Pages rebuild when you save a file.
`_config.yml` is the exception: restart the server after you change it.

Useful flags:

- `--livereload` reloads the browser after each rebuild.
- `--drafts` also shows posts in `_drafts/`.
- `--future` also shows posts dated in the future.

The theme is fetched from GitHub on each build, so you need an internet
connection.

To build without serving, run `bundle exec jekyll build`. The output goes to
`_site/`.

## Write a post

Add a Markdown file to `_posts/` named `YYYY-MM-DD-title.md`, with front matter
at the top:

```markdown
---
layout: post
title: "My new post"
---

Post body goes here.
```

## Rebuild the JavaScript bundle (optional)

`assets/js/bundle.js` is built from the React code in `src/` and is committed,
so you only need this step if you change `src/`.

`package.json` is gitignored, so you have to install the build dependencies
yourself (requires Node.js):

```sh
npm init -y
npm install react@18.2.0 react-dom@18.2.0
npm install --save-dev webpack@5 webpack-cli@5 babel-loader@9 css-loader@6 style-loader \
  @babel/core@7 @babel/preset-env@7 @babel/preset-react@7 @babel/plugin-proposal-class-properties
npx webpack
```

Webpack writes the new bundle to `assets/js/bundle.js`. Commit it with your
changes.

## Deploy

Push to `main`. GitHub Pages builds and publishes the site, which is served at
the custom domain in `CNAME`.
