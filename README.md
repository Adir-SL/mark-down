# `<mark-down>`

A zero-dependency vanilla JavaScript library that renders markdown as a native HTML element using the Web Components standard.

```html
<mark-down>
  # Hello, World!

  This is **bold**, *italic*, and `inline code`.

  - Zero dependencies
  - Shadow DOM isolated
  - Works everywhere
</mark-down>
```

---

## Installation

Download `mark-down.js` and `mark-down.css` and place them anywhere in your project. No npm, no bundler, no build step.

```
your-project/
├── index.html
├── mark-down.js
└── mark-down.css
```

The CSS file is loaded automatically by the JS from the same folder — you don't need to link it separately.

---

## Usage

Add the script to your `<head>` with the `defer` attribute:

```html
<head>
  <script src="mark-down.js" defer></script>
</head>
```

Then use `<mark-down>` anywhere in your `<body>`:

```html
<body>
  <h1>My Page</h1>

  <mark-down>
    ## About

    Welcome to my page. This content is written in **markdown**
    and rendered automatically by the library.

    - No configuration needed
    - Works alongside any HTML
  </mark-down>

  <p>Regular HTML continues here.</p>
</body>
```

---

## Supported Syntax

| Markdown | Output | Notes |
| --- | --- | --- |
| `# Heading 1` | H1 – H6 | One to six `#` characters |
| `**bold**` | **bold** | Also `__double underscores__` |
| `*italic*` | *italic* | Also `_single underscores_` |
| `***bold italic***` | ***bold italic*** | Triple asterisks |
| `~~strikethrough~~` | ~~strikethrough~~ | Double tildes |
| `` `inline code` `` | `inline code` | Single backtick; HTML-escaped |
| ```` ```lang … ``` ```` | Code block | Fenced; optional language hint |
| `- item` | Unordered list | Also `*` and `+` |
| `1. item` | Ordered list | Any digit + period |
| `··- sub-item` | Nested list | Indent sub-items with 2+ spaces; mix ordered and unordered |
| `- [ ] task` | Task list | `[ ]` unchecked, `[x]` checked |
| `> quote` | Blockquote | Markdown renders recursively inside |
| `> [!NOTE]` | Callout | `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, or `CAUTION` |
| `---` | Horizontal rule | Also `***` and `___` |
| `[text](url)` | Link | Standard inline link |
| `![alt](url)` | Image | Responsive, `max-width: 100%` |
| `\| col \| col \|` | Table | GFM pipe table with separator row |
| Two trailing spaces | Line break | Hard `<br>` within a paragraph |

---

## Features

### Zero dependencies
One `.js` file and one `.css` file. No npm, no bundler, no configuration of any kind.

### Web Components / Custom Elements
Built on the native [Custom Elements API](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define). Works in all modern browsers and alongside any framework — or no framework at all.

### Shadow DOM isolation
Each `<mark-down>` element renders inside a Shadow DOM, so styles never leak in or out. Your page's CSS and the markdown's CSS stay completely independent.

### Smart auto-dedent
Write naturally indented markdown inside your HTML without worrying about leading whitespace. The library measures the common indentation of all non-empty lines and strips it automatically.

```html
<!-- This works perfectly — the 6-space indent is stripped automatically -->
<div class="container">
  <mark-down>
    # Title
    Some content here.
  </mark-down>
</div>
```

### Inherits your color scheme
The default stylesheet uses `currentColor` and relative (`em`) units, so the rendered markdown adapts to your page's text color and font size without any extra configuration.

### Nested lists
Sub-lists are created by indenting items by 2 or more spaces. You can nest to any depth and freely mix ordered and unordered lists at each level:

```markdown
- Fruit
  - Apples
  - Bananas
- Bread
  1. Slice it
  2. Toast it
```

### Task lists
Use `- [ ]` for an unchecked item and `- [x]` for a checked one. Task list items can be nested just like regular list items:

```markdown
- [x] Download mark-down.js and mark-down.css
- [x] Add the script tag
- [ ] Write some markdown
  - [ ] Try a task list
  - [ ] Try a callout
```

### Callouts
GitHub-style alerts are written as a blockquote whose first line is `[!TYPE]`. Five types are supported — each renders with its own icon and color:

```markdown
> [!NOTE]
> Highlights information users should take into account.

> [!TIP]
> Optional info to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention.

> [!CAUTION]
> Negative potential consequences of an action.
```

### Dynamic content ready
The element uses `connectedCallback`, so `<mark-down>` elements added to the DOM dynamically (e.g. via JavaScript) are rendered automatically — no manual initialization needed.

### Tiny footprint
The entire parser and renderer is ~200 lines of readable, dependency-free JavaScript. Easy to audit, easy to fork, easy to understand.

---

## Styling

The CSS is loaded automatically from the same directory as the JS file. To customize styles, either:

**Option A** — Edit `mark-down.css` directly. Styles are scoped inside `.markdown-body` within the shadow DOM.

**Option B** — Set inherited CSS properties on the host element. Because the shadow stylesheet uses `currentColor` and `em` units throughout, four standard properties flow in from outside and affect the entire rendered output:

| Property | What it controls |
| --- | --- |
| `color` | All text, plus anything using `currentColor`: blockquote border, `<hr>`, h2 underline |
| `font-size` | The base size — all `em` values (headings, code, tables, spacing) scale from this |
| `font-family` | Overrides the default system font stack for body text |
| `line-height` | Base line spacing for paragraphs and body text |

```css
mark-down {
  color: #333;
  font-size: 18px;
  font-family: Georgia, serif;
  line-height: 1.8;
}
```

---

## Important: HTML tags inside `<mark-down>`

Because the browser parses `<mark-down>` content as HTML, any literal HTML tags inside the element must be escaped. For example:

```html
<!-- ✅ Correct -->
<mark-down>
  Use `&lt;mark-down&gt;` anywhere in your page.
</mark-down>

<!-- ❌ Wrong — the browser will try to parse <mark-down> as a real element -->
<mark-down>
  Use `<mark-down>` anywhere in your page.
</mark-down>
```

This is a standard HTML parsing constraint, not specific to this library.

---

## Browser Support

Works in all browsers that support Custom Elements v1 and Shadow DOM v1:

| Browser | Supported |
| --- | --- |
| Chrome / Edge | ✅ 67+ |
| Firefox | ✅ 63+ |
| Safari | ✅ 10.1+ |
| Opera | ✅ 54+ |

---

## License

MIT — free to use, modify, and distribute.
