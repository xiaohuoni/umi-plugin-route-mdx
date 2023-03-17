import ReactMarkdown from '{{{ react-markdown }}}';
import React from 'react';
import remarkParse from '{{{ remark-parse }}}';
import remarkFrontmatter from '{{{ remark-frontmatter }}}';
import remarkDirective from '{{{ remark-directive }}}';
import remarkBreaks from '{{{ remark-breaks }}}';
import remarkGfm from '{{{ remark-gfm }}}';
import rehypeAutolinkHeadings from '{{{ rehype-autolink-headings }}}';
import rehypeRemoveComments from '{{{ rehype-remove-comments }}}';
import rehypePrismPlus from '{{{ rehype-prism-plus }}}';
import rehypeExternalLinks from '{{{ rehype-external-links }}}';

export function Markdown(props) {
  const plugin = {
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
              ? '_blank'
              : undefined;
          },
        },
      ],
    ],
  };
  return <ReactMarkdown {...plugin} className="markdown" {...props} />;
}
