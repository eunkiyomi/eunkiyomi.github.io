---
layout: post
title: Use React Components in a Jekyll Blog
authors:
- eunki
---

## Demo

<div id="hello-react"></div>

```html
<div id="hello-react"></div>
```

## Procedure

### Setting Node

In the jekyll root, do `npm init`, which makes it to a node project.

### Setting React

First install react by `npm install react react-dom`.

Create src/entry.jsx

```js
import React from 'react';
import { createRoot } from 'react-dom/client';
import HelloReact from './components/HelloReact';

createRoot(document.getElementById('hello-react')).render(<HelloReact />);
```

Create src/components/HelloReact.jsx

{% raw %}
```jsx
import React, { useState } from 'react';

export default function HelloReact() {
  const [count, setCount] = useState(0);
    
  return (
    <div style={{width: '100%', border: '1px solid black'}}>
      <p>
        <button onClick={() => setCount(count + 1)}>
          Hello, React!
        </button>
        <span> You greeted {count} times</span>
      </p>
    </div>
  );
}
```
{% endraw %}

Update the default layout (_layouts/default.html) so that the blog pages always load entry.jsx. (Ref: [_layouts/default.html of GPJR](https://github.com/dellaert/gh-pages-jekyll-react/blob/c7f0892c085c61503ce54db94d32a04ce1aec05c/_layouts/default.html#L16) )

```html
<body>
  <!-- Rest of the code -->
	<script type="text/javascript" src="{{ site.baseurl }}/assets/js/bundle.js" charset="utf-8"></script>
</body>
```

### Setting Webpack

Install Webpack as a development dependency
```shell
npm install --save-dev webpack webpack-cli
```

Install Babel and required loaders
```shell
npm install --save-dev babel-core babel-loader css-loader @babel/preset-env @babel/preset-react @babel/cli @babel/core @babel/plugin-proposal-class-properties
```

Clone webpack.config.js from the [GPJR repository](https://github.com/dellaert/gh-pages-jekyll-react/blob/gh-pages/webpack.config.js).


## References Summaries

* [Github Pages + Jekyll + React](https://dellaert.github.io/gh-pages-jekyll-react/index) (GPJR)
  
  * In markdown, code like `<div id="c1"></div>`.
  * In src/entry.jsx, `ReactDOM.render(<C1 />, document.getElementById('c1'));`
  * This component is in src/components/c1.jsx.
  * Build through Webpack.
  
    ```
    yarn        # installs all the dependencies
    yarn build  # build and bundle the code using webpack
    yarn start  # start the jekyll server
    ```
  
* [지킬(Jekyll) 블로그를 운영중인 깃허브에 리액트 페이지 추가하기](https://donghyuna.github.io/react/jyikil,-reactsetup/)
  
  * Make completely new '/react-pages' endpoint.
  * Create a react project in the project directory by `npx create-react-app react-pages`, and manage it separately with Jekyll.

- [[Webpack] Webpack을 이용한 React 개발](https://goo-gy.github.io/2021-12-31-webpack-react)

  - Webpack is a bundler that integrates various modules (e.g., js, css, html, and image) to one Javascript file.

  - Babel, which interpretes JSX, can be applied to the webpack pipeline.

  - Construct an environment

    - React: `npm install react react-dom`

    - Webpack: `npm install --save-dev webpack webpack-cli`

    - webpack.config.js

      - Set mode, entry, and output.

        ```js
        module.exports = {
          mode: "development",
          entry: "./src/index.js",
          output: {
            filename: "bundle.js",
          },
        };
        ```

    - Babel

      - ```shell
        npm install --save-dev babel-loader @babel/preset-env @babel/preset-react
        ```

      - ```js
        module.exports = {
          ...
          module: {
            rules: [
                {
                    test: /\.jsx?/,
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            ]
          },
          ...
        };
        ```
