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
├── src/
│   ├── mark-down.js
│   └── mark-down.css
└── themes/          ← optional
    ├── md-theme-dark.css
    ├── md-theme-minimal.css
    └── md-theme-warm.css
```

The CSS file is loaded automatically by the JS from the same folder — you don't need to link it separately.

---

## Usage

Add the script to your `<head>` with the `defer` attribute:

```html
<head>
  <script src="src/mark-down.js" defer></script>
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
- [x] Download mark-down.js and mark-down.css into `src/`
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

## Theming

`mark-down.css` exposes every visual value — colors, fonts, sizes, radii, borders — as a CSS custom property. Override any of them from your own stylesheet and the change cascades into the shadow DOM automatically. If a variable isn't set, it falls back to the default value, so you only need to declare what you actually want to change.

### Using a pre-built theme

Download one of the included theme files and link it in your `<head>` **after** the script tag:

```html
<script src="src/mark-down.js" defer></script>
<link rel="stylesheet" href="themes/md-theme-dark.css">
```

Three themes are included:

| File | Description |
| --- | --- |
| `themes/md-theme-dark.css` | Dark mode — GitHub-dark-style palette, lighter link and callout colors |
| `themes/md-theme-minimal.css` | Minimal — serif font, no border-radius, transparent code backgrounds |
| `themes/md-theme-warm.css` | Warm — sepia tones, serif font, earthy palette throughout |

### Writing your own theme

Create a CSS file that sets any of the variables below on the `mark-down` element:

```css
/* my-theme.css */
mark-down {
  color: #1a1a1a;                /* text color — inherited by shadow DOM */

  --md-font-family:   Georgia, serif;
  --md-line-height:   1.8;
  --md-link-color:    #b03a2e;

  --md-code-bg:       rgba(176, 58, 46, 0.08);
  --md-pre-bg:        rgba(176, 58, 46, 0.05);

  --md-table-border-color: #c4a882;
}
```

### Available variables

| Variable | Default | Controls |
| --- | --- | --- |
| `--md-bg` | `transparent` | Background color of the rendered output |
| `--md-color` | `inherit` | Text color of the rendered output |
| `--md-padding` | `0` | Inner padding — set alongside `--md-bg` so content doesn't touch the edges |
| `--md-font-family` | system sans-serif stack | Body font |
| `--md-font-size` | `1rem` | Base font size (all `em` values scale from this) |
| `--md-line-height` | `1.7` | Line spacing |
| `--md-mono-font-family` | system monospace stack | Code font |
| `--md-heading-font-weight` | `600` | Heading weight |
| `--md-h1-font-size` … `--md-h6-font-size` | `2em` … `0.85em` | Individual heading sizes |
| `--md-link-color` | `#0969da` | Link color |
| `--md-blockquote-border-color` | `currentColor` | Blockquote left border color |
| `--md-blockquote-border-width` | `4px` | Blockquote left border width |
| `--md-code-font-size` | `0.875em` | Inline and block code size |
| `--md-code-bg` | `rgba(128,128,128,0.15)` | Inline code background |
| `--md-code-radius` | `4px` | Inline code border-radius |
| `--md-pre-bg` | `rgba(128,128,128,0.12)` | Code block background |
| `--md-pre-radius` | `6px` | Code block border-radius |
| `--md-img-radius` | `4px` | Image border-radius |
| `--md-table-font-size` | `0.95em` | Table font size |
| `--md-table-border-color` | `#c8c8c8` | Table border color |
| `--md-table-radius` | `6px` | Table border-radius |
| `--md-table-header-bg` | `rgba(128,128,128,0.1)` | Table header row background |
| `--md-table-stripe-bg` | `rgba(128,128,128,0.05)` | Table alternating row background |
| `--md-callout-radius` | `6px` | Callout border-radius |
| `--md-callout-note-color` | `#0969da` | Note callout border + title color |
| `--md-callout-note-bg` | `rgba(9,105,218,0.08)` | Note callout background |
| `--md-callout-tip-color` | `#1a7f37` | Tip callout border + title color |
| `--md-callout-tip-bg` | `rgba(26,127,55,0.08)` | Tip callout background |
| `--md-callout-important-color` | `#8250df` | Important callout border + title color |
| `--md-callout-important-bg` | `rgba(130,80,223,0.08)` | Important callout background |
| `--md-callout-warning-color` | `#9a6700` | Warning callout border + title color |
| `--md-callout-warning-bg` | `rgba(154,103,0,0.08)` | Warning callout background |
| `--md-callout-caution-color` | `#cf222e` | Caution callout border + title color |
| `--md-callout-caution-bg` | `rgba(207,34,46,0.08)` | Caution callout background |
| `--md-checkbox-color` | `#0969da` | Task list checkbox accent color |
| `--md-checkbox-filter` | `none` | CSS filter on the checkbox — set to `invert(1)` for dark backgrounds |

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
