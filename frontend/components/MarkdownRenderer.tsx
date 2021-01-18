import React from 'react';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import sanitizeHtml from 'sanitize-html';

// See https://github.com/jonschlinkert/remarkable/blob/58b6945f203ca7a0bb5a0785df90a3a6a8b9e59c/lib/ruler.js#L195
// for `enable` function,
// https://github.com/jonschlinkert/remarkable/blob/58b6945f203ca7a0bb5a0785df90a3a6a8b9e59c/lib/configs/default.js
// for list of possible rules to enable, and
// https://github.com/jonschlinkert/remarkable#manage-rules
// for an explanation of enabling rules.
let md = new Remarkable();
md.core.ruler.enable(['block', 'inline'], true);
md.inline.ruler.enable(['backticks', 'emphasis', 'text', 'escape'], true);
md.block.ruler.enable(['paragraph'], true);
md.use(linkify);

let MarkdownRenderer: React.FC<{ children: string }> = (props) => {
  if (
    props.children.includes('*') ||
    props.children.includes('_') ||
    props.children.includes('`') ||
    props.children.includes('http://') ||
    props.children.includes('https://')
  ) {
    let rendered = md.renderInline(props.children);
    let sanitized = sanitizeHtml(rendered, {
      allowedTags: ['strong', 'em', 'code', 'a'],
      allowedAttributes: { a: ['href'] },
      disallowedTagsMode: 'escape',
    });

    console.log(rendered);
    return (
      <span
        dangerouslySetInnerHTML={{ __html: sanitized }}
        className="markdownUserContent"
      ></span>
    );
  } else {
    return <span>{props.children}</span>;
  }
};

export default MarkdownRenderer;
