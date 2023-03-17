import { IApi } from "umi";
import type { Element } from "hast";
import { winPath, Mustache } from "@umijs/utils";

import { readFileSync } from "fs";
import { join, dirname } from "path";
const DIR_NAME = "plugin-route-mdx";

export default (api: IApi) => {
  api.describe({
    key: "routeMdx",
    config: {
      schema(Joi) {
        return Joi.object({});
      },
    },
  });

  api.modifyDefaultConfig(async (memo) => {
    const { default: remarkParse } = await import("remark-parse");
    const { default: remarkFrontmatter } = await import("remark-frontmatter");
    const { default: remarkDirective } = await import("remark-directive");
    const { default: remarkBreaks } = await import("remark-breaks");
    const { default: remarkGfm } = await import("remark-gfm");
    const { default: rehypeAutolinkHeadings } = await import(
      "rehype-autolink-headings"
    );
    const { default: rehypeRemoveComments } = await import(
      "rehype-remove-comments"
    );
    const { default: rehypePrismPlus } = await import("rehype-prism-plus");
    const { default: rehypeExternalLinks } = await import(
      "rehype-external-links"
    );
    memo.mdx = {
      loader: require.resolve("@mdx-js/loader"),
      loaderOptions: {
        // providerImportSource: "@mdx-js/react",
        remarkPlugins: [
          remarkParse,
          remarkFrontmatter,
          remarkDirective,
          remarkBreaks,
          remarkGfm,
        ],
        rehypePlugins: [
          rehypeAutolinkHeadings,
          rehypeRemoveComments,
          [rehypePrismPlus, { ignoreMissing: true }],
          [
            rehypeExternalLinks,
            {
              target(element: Element) {
                return element.properties &&
                  /^https?:\/\//.test(`${element.properties!.href}`)
                  ? "_blank"
                  : undefined;
              },
            },
          ],
        ],
      },
    };
    return memo;
  });
  api.onGenerateFiles(() => {
    const contextTpl = readFileSync(
      join(__dirname, "..", "templates", "ReactMarkDown.tpl"),
      "utf-8"
    );
    const options: any = {};
    [
      "react-markdown",
      "remark-parse",
      "remark-frontmatter",
      "remark-directive",
      "remark-breaks",
      "remark-gfm",
      "rehype-autolink-headings",
      "rehype-remove-comments",
      // "rehype-prism-plus",
      "rehype-external-links",
    ].forEach((k: string) => {
      // winPath(dirname(require.resolve('antd-mobile-alita'))),
      options[k] = winPath(dirname(require.resolve(`${k}`)));
    });

    // rehype-prism-plus/dist ??
    options["rehype-prism-plus"] = winPath(
      dirname(dirname(require.resolve("rehype-prism-plus")))
    );
    api.writeTmpFile({
      path: `${DIR_NAME}/index.tsx`,
      noPluginDir: true,
      content: Mustache.render(contextTpl, options),
    });
  });

  api.addHTMLStyles(() => {
    // 先修改 styles/prism-one.css 再复制过来。
    const addItem = {
      content: `
      html:not(.dark) {
        /** One Light colours (accurate as of commit eb064bf on 19 Feb 2021)
          From colors.less */
        --mono-1: hsl(230, 8%, 24%);
        --mono-2: hsl(230, 6%, 44%);
        --mono-3: hsl(230, 4%, 64%);
        --hue-1: hsl(198, 99%, 37%);
        --hue-2: hsl(221, 87%, 60%);
        --hue-3: hsl(301, 63%, 40%);
        --hue-4: hsl(119, 34%, 47%);
        --hue-5: hsl(5, 74%, 59%);
        --hue-5-2: hsl(344, 84%, 43%);
        --hue-6: hsl(35, 99%, 36%);
        --hue-6-2: hsl(35, 99%, 40%);
        --syntax-fg: hsl(230, 8%, 24%);
        --syntax-bg: hsl(230, 1%, 98%);
        --syntax-gutter-bg: hsl(230, 1%, 78%);
        --syntax-gutter: hsl(230, 1%, 62%);
        --syntax-guide: hsla(230, 8%, 24%, 0.2);
        --syntax-accent: hsl(230, 100%, 66%);
        --syntax-selection-color: hsl(230, 1%, 90%);
        --syntax-gutter-background-color-selected: hsl(230, 1%, 90%);
        --syntax-cursor-line: hsla(230, 8%, 24%, 0.05);
        /* Triangles pointing to the code */
        --previewer-border-color: hsl(0, 0, 95%);
        /* Background colour within the popup */
        --previewer-easing-bg: hsl(0, 0%, 100%);
        /* Diff Highlight plugin overrides */
        --token-prefix: hsla(353, 100%, 66%, 0.15);
        --token-prefix-moz-selection: hsla(353, 95%, 66%, 0.25);
        --token-prefix-inserted: hsla(137, 100%, 55%, 0.15);
    }
    
    html.dark {
        /* One Dark colours (accurate as of commit 8ae45ca on 6 Sep 2018)
          From colors.less */
        --mono-1: hsl(220, 14%, 71%);
        --mono-2: hsl(220, 9%, 55%);
        --mono-3: hsl(220, 10%, 40%);
        --hue-1: hsl(187, 47%, 55%);
        --hue-2: hsl(207, 82%, 66%);
        --hue-3: hsl(286, 60%, 67%);
        --hue-4: hsl(95, 38%, 62%);
        --hue-5: hsl(355, 65%, 65%);
        --hue-5-2: hsl(5, 48%, 51%);
        --hue-6: hsl(29, 54%, 61%);
        --hue-6-2: hsl(39, 67%, 69%);
        --syntax-fg: hsl(220, 14%, 71%);
        --syntax-bg: hsl(220, 13%, 18%);
        --syntax-gutter: hsl(220, 14%, 45%);
        --syntax-guide: hsla(220, 14%, 71%, 0.15);
        --syntax-accent: hsl(220, 100%, 66%);
        --syntax-selection-color: hsl(220, 13%, 28%);
        --syntax-gutter-background-color-selected: hsl(220, 13%, 26%);
        --syntax-cursor-line: hsla(220, 100%, 80%, 0.04);
    
        /* Triangles pointing to the code */
        --previewer-border-color: hsl(224, 13%, 17%);
        /* Background colour within the popup */
        --previewer-easing-bg: hsl(219, 13%, 22%);
        /* Diff Highlight plugin overrides */
        --token-prefix: hsla(353, 100%, 66%, 0.15);
        --token-prefix-moz-selection: hsla(353, 95%, 66%, 0.25);
        --token-prefix-inserted: hsla(137, 100%, 55%, 0.15);
    }
    
    /**
       * One Light theme for prism.js
       * Based on Atom's One Light theme: https://github.com/atom/atom/tree/master/packages/one-light-syntax
       */
    code[class*='language-'],
    pre[class*='language-'] {
        background: var(--syntax-bg);
        color: var(--mono-1);
        font-family: 'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono',
            monospace;
        direction: ltr;
        text-align: left;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;
        line-height: 1.5;
        -moz-tab-size: 2;
        -o-tab-size: 2;
        tab-size: 2;
        -webkit-hyphens: none;
        -moz-hyphens: none;
        -ms-hyphens: none;
        hyphens: none;
    }
    
    /* Selection */
    code[class*='language-']::-moz-selection,
    code[class*='language-'] *::-moz-selection,
    pre[class*='language-'] *::-moz-selection {
        background: var(--syntax-gutter-background-color-selected);
        color: inherit;
    }
    
    code[class*='language-']::selection,
    code[class*='language-'] *::selection,
    pre[class*='language-'] *::selection {
        background: var(--syntax-gutter-background-color-selected);
        color: inherit;
    }
    
    /* Code blocks */
    pre[class*='language-'] {
        padding: 1em;
        margin: 0.5em 0;
        overflow: auto;
        border-radius: 0.3em;
    }
    
    /* Inline code */
    :not(pre)>code[class*='language-'] {
        padding: 0.2em 0.3em;
        border-radius: 0.3em;
        white-space: normal;
    }
    
    .token.comment,
    .token.prolog,
    .token.cdata {
        color: var(--mono-3);
    }
    
    .token.doctype,
    .token.punctuation,
    .token.entity {
        color: var(--mono-1);
    }
    
    .token.attr-name,
    .token.class-name,
    .token.boolean,
    .token.constant,
    .token.number,
    .token.atrule {
        color: var(--hue-6);
    }
    
    .token.keyword {
        color: var(--hue-3);
    }
    
    .token.property,
    .token.tag,
    .token.symbol,
    .token.deleted,
    .token.important {
        color: var(--hue-5);
    }
    
    .token.selector,
    .token.string,
    .token.char,
    .token.builtin,
    .token.inserted,
    .token.regex,
    .token.attr-value,
    .token.attr-value>.token.punctuation {
        color: var(--hue-4);
    }
    
    .token.variable,
    .token.operator,
    .token.function {
        color: var(--hue-2);
    }
    
    .token.url {
        color: var(--hue-1);
    }
    
    /* HTML overrides */
    .token.attr-value>.token.punctuation.attr-equals,
    .token.special-attr>.token.attr-value>.token.value.css {
        color: var(--mono-1);
    }
    
    /* CSS overrides */
    .language-css .token.selector {
        color: var(--hue-5);
    }
    
    .language-css .token.property {
        color: var(--mono-1);
    }
    
    .language-css .token.function,
    .language-css .token.url>.token.function {
        color: var(--hue-1);
    }
    
    .language-css .token.url>.token.string.url {
        color: var(--hue-4);
    }
    
    .language-css .token.important,
    .language-css .token.atrule .token.rule {
        color: var(--hue-3);
    }
    
    /* JS overrides */
    .language-javascript .token.operator {
        color: var(--hue-3);
    }
    
    .language-javascript .token.template-string>.token.interpolation>.token.interpolation-punctuation.punctuation {
        color: var(--hue-5-2);
    }
    
    /* JSON overrides */
    .language-json .token.operator {
        color: var(--mono-1);
    }
    
    .language-json .token.null.keyword {
        color: var(--hue-6);
    }
    
    /* MD overrides */
    .language-markdown .token.url,
    .language-markdown .token.url>.token.operator,
    .language-markdown .token.url-reference.url>.token.string {
        color: var(--mono-1);
    }
    
    .language-markdown .token.url>.token.content {
        color: var(--hue-2);
    }
    
    .language-markdown .token.url>.token.url,
    .language-markdown .token.url-reference.url {
        color: var(--hue-1);
    }
    
    .language-markdown .token.blockquote.punctuation,
    .language-markdown .token.hr.punctuation {
        color: var(--mono-3);
        font-style: italic;
    }
    
    .language-markdown .token.code-snippet {
        color: var(--hue-4);
    }
    
    .language-markdown .token.bold .token.content {
        color: var(--hue-6);
    }
    
    .language-markdown .token.italic .token.content {
        color: var(--hue-3);
    }
    
    .language-markdown .token.strike .token.content,
    .language-markdown .token.strike .token.punctuation,
    .language-markdown .token.list.punctuation,
    .language-markdown .token.title.important>.token.punctuation {
        color: var(--hue-5);
    }
    
    /* General */
    .token.bold {
        font-weight: bold;
    }
    
    .token.comment,
    .token.italic {
        font-style: italic;
    }
    
    .token.entity {
        cursor: help;
    }
    
    .token.namespace {
        opacity: 0.8;
    }
    
    /* Plugin overrides */
    /* Selectors should have higher specificity than those in the plugins' default stylesheets */
    
    /* Show Invisibles plugin overrides */
    .token.token.tab:not(:empty):before,
    .token.token.cr:before,
    .token.token.lf:before,
    .token.token.space:before {
        color: var(--syntax-guide);
    }
    
    /* Toolbar plugin overrides */
    /* Space out all buttons and move them away from the right edge of the code block */
    div.code-toolbar>.toolbar.toolbar>.toolbar-item {
        margin-right: 0.4em;
    }
    
    /* Styling the buttons */
    div.code-toolbar>.toolbar.toolbar>.toolbar-item>button,
    div.code-toolbar>.toolbar.toolbar>.toolbar-item>a,
    div.code-toolbar>.toolbar.toolbar>.toolbar-item>span {
        background: var(--syntax-gutter-background-color-selected);
        color: var(--mono-2);
        padding: 0.1em 0.4em;
        border-radius: 0.3em;
    }
    
    div.code-toolbar>.toolbar.toolbar>.toolbar-item>button:hover,
    div.code-toolbar>.toolbar.toolbar>.toolbar-item>button:focus,
    div.code-toolbar>.toolbar.toolbar>.toolbar-item>a:hover,
    div.code-toolbar>.toolbar.toolbar>.toolbar-item>a:focus,
    div.code-toolbar>.toolbar.toolbar>.toolbar-item>span:hover,
    div.code-toolbar>.toolbar.toolbar>.toolbar-item>span:focus {
        background: var(--syntax-gutter-bg);
        /* custom: darken(var(--syntax-bg, 20%) */
        color: var(--mono-1);
    }
    
    /* Line Highlight plugin overrides */
    /* The highlighted line itself */
    .line-highlight.line-highlight {
        background: var(--syntax-cursor-line);
    }
    
    /* Default line numbers in Line Highlight plugin */
    .line-highlight.line-highlight:before,
    .line-highlight.line-highlight[data-end]:after {
        background: var(--syntax-gutter-background-color-selected);
        color: var(--mono-1);
        padding: 0.1em 0.6em;
        border-radius: 0.3em;
        box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.2);
        /* same as Toolbar plugin default */
    }
    
    /* Hovering over a linkable line number (in the gutter area) */
    /* Requires Line Numbers plugin as well */
    pre[id].linkable-line-numbers.linkable-line-numbers span.line-numbers-rows>span:hover:before {
        background-color: var(--syntax-cursor-line);
    }
    
    /* Line Numbers and Command Line plugins overrides */
    /* Line separating gutter from coding area */
    .line-numbers.line-numbers .line-numbers-rows,
    .command-line .command-line-prompt {
        border-right-color: var(--syntax-guide);
    }
    
    /* Stuff in the gutter */
    .line-numbers .line-numbers-rows>span:before,
    .command-line .command-line-prompt>span:before {
        color: var(--syntax-gutter);
    }
    
    /* Match Braces plugin overrides */
    /* Note: Outline colour is inherited from the braces */
    .rainbow-braces .token.token.punctuation.brace-level-1,
    .rainbow-braces .token.token.punctuation.brace-level-5,
    .rainbow-braces .token.token.punctuation.brace-level-9 {
        color: var(--hue-5);
    }
    
    .rainbow-braces .token.token.punctuation.brace-level-2,
    .rainbow-braces .token.token.punctuation.brace-level-6,
    .rainbow-braces .token.token.punctuation.brace-level-10 {
        color: var(--hue-4);
    }
    
    .rainbow-braces .token.token.punctuation.brace-level-3,
    .rainbow-braces .token.token.punctuation.brace-level-7,
    .rainbow-braces .token.token.punctuation.brace-level-11 {
        color: var(--hue-2);
    }
    
    .rainbow-braces .token.token.punctuation.brace-level-4,
    .rainbow-braces .token.token.punctuation.brace-level-8,
    .rainbow-braces .token.token.punctuation.brace-level-12 {
        color: var(--hue-3);
    }
    
    /* Diff Highlight plugin overrides */
    /* Taken from https://github.com/atom/github/blob/master/styles/variables.less */
    pre.diff-highlight>code .token.token.deleted:not(.prefix),
    pre>code.diff-highlight .token.token.deleted:not(.prefix) {
        background-color: var(--token-prefix);
    }
    
    pre.diff-highlight>code .token.token.deleted:not(.prefix)::-moz-selection,
    pre.diff-highlight>code .token.token.deleted:not(.prefix) *::-moz-selection,
    pre>code.diff-highlight .token.token.deleted:not(.prefix)::-moz-selection,
    pre>code.diff-highlight .token.token.deleted:not(.prefix) *::-moz-selection {
        background-color: var(--token-prefix-moz-selection);
    }
    
    pre.diff-highlight>code .token.token.deleted:not(.prefix)::selection,
    pre.diff-highlight>code .token.token.deleted:not(.prefix) *::selection,
    pre>code.diff-highlight .token.token.deleted:not(.prefix)::selection,
    pre>code.diff-highlight .token.token.deleted:not(.prefix) *::selection {
        background-color: var(--token-prefix-moz-selection);
    }
    
    pre.diff-highlight>code .token.token.inserted:not(.prefix),
    pre>code.diff-highlight .token.token.inserted:not(.prefix) {
        background-color: var(--token-prefix-inserted);
    }
    
    pre.diff-highlight>code .token.token.inserted:not(.prefix)::-moz-selection,
    pre.diff-highlight>code .token.token.inserted:not(.prefix) *::-moz-selection,
    pre>code.diff-highlight .token.token.inserted:not(.prefix)::-moz-selection,
    pre>code.diff-highlight .token.token.inserted:not(.prefix) *::-moz-selection {
        background-color: var(--token-prefix-inserted);
    }
    
    pre.diff-highlight>code .token.token.inserted:not(.prefix)::selection,
    pre.diff-highlight>code .token.token.inserted:not(.prefix) *::selection,
    pre>code.diff-highlight .token.token.inserted:not(.prefix)::selection,
    pre>code.diff-highlight .token.token.inserted:not(.prefix) *::selection {
        background-color: var(--token-prefix-inserted);
    }
    
    /* Previewers plugin overrides */
    /* Based on https://github.com/atom-community/atom-ide-datatip/blob/master/styles/atom-ide-datatips.less and https://github.com/atom/atom/blob/master/packages/one-light-ui */
    /* Border around popup */
    .prism-previewer.prism-previewer:before,
    .prism-previewer-gradient.prism-previewer-gradient div {
        border-color: var(--previewer-border-color);
    }
    
    /* Angle and time should remain as circles and are hence not included */
    .prism-previewer-color.prism-previewer-color:before,
    .prism-previewer-gradient.prism-previewer-gradient div,
    .prism-previewer-easing.prism-previewer-easing:before {
        border-radius: 0.3em;
    }
    
    /* Triangles pointing to the code */
    .prism-previewer.prism-previewer:after {
        border-top-color: var(--previewer-border-color);
    }
    
    .prism-previewer-flipped.prism-previewer-flipped.after {
        border-bottom-color: var(--previewer-border-color);
    }
    
    /* Background colour within the popup */
    .prism-previewer-angle.prism-previewer-angle:before,
    .prism-previewer-time.prism-previewer-time:before,
    .prism-previewer-easing.prism-previewer-easing {
        background: var(--previewer-easing-bg);
    }
    
    /* For angle, this is the positive area (eg. 90deg will display one quadrant in this colour) */
    /* For time, this is the alternate colour */
    .prism-previewer-angle.prism-previewer-angle circle,
    .prism-previewer-time.prism-previewer-time circle {
        stroke: var(--mono-1);
        stroke-opacity: 1;
    }
    
    /* Stroke colours of the handle, direction point, and vector itself */
    .prism-previewer-easing.prism-previewer-easing circle,
    .prism-previewer-easing.prism-previewer-easing path,
    .prism-previewer-easing.prism-previewer-easing line {
        stroke: var(--mono-1);
    }
    
    /* Fill colour of the handle */
    .prism-previewer-easing.prism-previewer-easing circle {
        fill: transparent;
    }
    
    table {
        color: var(--mono-1);
        box-sizing: border-box;
        table-layout: fixed;
        margin-block-start: 12px;
        margin-block-end: 24px;
        margin-inline-start: auto;
        margin-inline-end: auto;
        border-collapse: collapse;
        border-width: 1px;
        border-style: solid;
        border-color: var(--mono-3);
        word-break: break-word;
    }
    
    th {
        white-space: nowrap;
        background-color: var(--syntax-bg);
    }
    
    th,
    td {
        padding-block-start: 10px;
        padding-block-end: 10px;
        padding-inline-start: 16px;
        padding-inline-end: 16px;
        border-color: var(--syntax-selection-color);
        border-width: 1px;
        border-style: solid;
    }
    
    td {
        background-color: var(--previewer-easing-bg);
    
    }
    
    .markdown h1,
    .markdown h2,
    .markdown h3,
    .markdown h4,
    .markdown h5,
    .markdown h6 {
        position: relative;
        margin: 0;
        margin-block-start: 24px;
        margin-block-end: 12px;
        font-weight: 600;
    }
    
    .markdown h1,
    .markdown h2,
    .markdown h3 {
        letter-spacing: .05em;
    }
    
    .markdown h1 {
        margin-block-end: 24px;
        font-size: 32px;
        line-height: 48px;
    }
    
    .markdown h2 {
        font-size: 24px;
        line-height: 36px;
    }
    
    .markdown h3 {
        font-size: 20px;
        line-height: 36px;
    }
    
    .markdown h4 {
        font-size: 18px;
        line-height: 24px;
    }
`,
    };
    return [addItem];
  });
};
