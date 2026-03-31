/**
 * mark-down.js
 * Vanilla JS library that renders <mark-down> elements as HTML.
 * Usage: <mark-down>## Hello\n\nSome **bold** text.</mark-down>
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Parser: Markdown -> HTML (no dependencies)
  // ---------------------------------------------------------------------------

  function parseMarkdown(md) {
    // Normalize line endings
    let src = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Preserve code blocks before any other processing
    const codeBlocks = [];
    src = src.replace(/```([\w]*)\n?([\s\S]*?)```/g, function (_, lang, code) {
      const idx = codeBlocks.length;
      codeBlocks.push(
        '<pre><code' + (lang ? ' class="language-' + escapeHtml(lang) + '"' : '') + '>' +
        escapeHtml(code.replace(/^\n/, '').replace(/\n$/, '')) +
        '</code></pre>'
      );
      return '\x00CODE' + idx + '\x00';
    });

    // Inline code (must come before other inline processing)
    const inlineCodes = [];
    src = src.replace(/`([^`]+)`/g, function (_, code) {
      const idx = inlineCodes.length;
      inlineCodes.push('<code>' + escapeHtml(code) + '</code>');
      return '\x00INLINE' + idx + '\x00';
    });

    const lines = src.split('\n');
    const output = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Blank line
      if (line.trim() === '') {
        i++;
        continue;
      }

      // Fenced code block placeholder
      if (/^\x00CODE\d+\x00$/.test(line.trim())) {
        output.push(line.trim());
        i++;
        continue;
      }

      // Headings
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        output.push('<h' + level + '>' + inlineFormat(headingMatch[2], inlineCodes) + '</h' + level + '>');
        i++;
        continue;
      }

      // Horizontal rule
      if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
        output.push('<hr>');
        i++;
        continue;
      }

      // Blockquote
      if (/^>\s?/.test(line)) {
        const quoteLines = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) {
          quoteLines.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }
        output.push('<blockquote>' + parseMarkdown(quoteLines.join('\n')) + '</blockquote>');
        continue;
      }

      // Unordered list
      if (/^[-*+]\s/.test(line)) {
        const items = [];
        while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
          items.push('<li>' + inlineFormat(lines[i].replace(/^[-*+]\s/, ''), inlineCodes) + '</li>');
          i++;
        }
        output.push('<ul>' + items.join('') + '</ul>');
        continue;
      }

      // Ordered list
      if (/^\d+\.\s/.test(line)) {
        const items = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          items.push('<li>' + inlineFormat(lines[i].replace(/^\d+\.\s/, ''), inlineCodes) + '</li>');
          i++;
        }
        output.push('<ol>' + items.join('') + '</ol>');
        continue;
      }

      // Table (header row | --- row | data rows)
      if (i + 1 < lines.length && /^\|?[\s\-|:]+\|?$/.test(lines[i + 1]) && lines[i].includes('|')) {
        const headerCells = parseTableRow(lines[i]);
        i += 2; // skip separator
        const rows = [];
        while (i < lines.length && lines[i].includes('|')) {
          rows.push(parseTableRow(lines[i]));
          i++;
        }
        let table = '<table><thead><tr>';
        headerCells.forEach(function (cell) {
          table += '<th>' + inlineFormat(cell, inlineCodes) + '</th>';
        });
        table += '</tr></thead>';
        if (rows.length) {
          table += '<tbody>';
          rows.forEach(function (row) {
            table += '<tr>';
            row.forEach(function (cell) {
              table += '<td>' + inlineFormat(cell, inlineCodes) + '</td>';
            });
            table += '</tr>';
          });
          table += '</tbody>';
        }
        table += '</table>';
        output.push(table);
        continue;
      }

      // Paragraph (collect consecutive non-special lines)
      const paraLines = [];
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !/^#{1,6}\s/.test(lines[i]) &&
        !/^[-*+]\s/.test(lines[i]) &&
        !/^\d+\.\s/.test(lines[i]) &&
        !/^>\s?/.test(lines[i]) &&
        !/^(\*{3,}|-{3,}|_{3,})$/.test(lines[i].trim()) &&
        !/^\x00CODE\d+\x00$/.test(lines[i].trim())
      ) {
        paraLines.push(lines[i]);
        i++;
      }
      if (paraLines.length) {
        // Hard line breaks: two trailing spaces become <br>
        const paraHtml = paraLines
          .map(function (l) { return inlineFormat(l, inlineCodes); })
          .join('\n')
          .replace(/  \n/g, '<br>\n');
        output.push('<p>' + paraHtml + '</p>');
      }
    }

    // Restore code blocks
    let html = output.join('\n');
    codeBlocks.forEach(function (block, idx) {
      html = html.replace('\x00CODE' + idx + '\x00', block);
    });

    return html;
  }

  function parseTableRow(line) {
    return line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(function (cell) { return cell.trim(); });
  }

  function inlineFormat(text, inlineCodes) {
    // Restore inline code placeholders first (so we don't format inside them)
    let out = text;

    // Images before links
    out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (_, alt, src) {
      return '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(alt) + '">';
    });

    // Links
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, href) {
      return '<a href="' + escapeHtml(href) + '">' + escapeHtml(label) + '</a>';
    });

    // Bold + italic (***text***)
    out = out.replace(/\*{3}(.+?)\*{3}/g, '<strong><em>$1</em></strong>');

    // Bold (**text** or __text__)
    out = out.replace(/\*{2}(.+?)\*{2}/g, '<strong>$1</strong>');
    out = out.replace(/_{2}(.+?)_{2}/g, '<strong>$1</strong>');

    // Italic (*text* or _text_)
    out = out.replace(/\*(.+?)\*/g, '<em>$1</em>');
    out = out.replace(/_(.+?)_/g, '<em>$1</em>');

    // Strikethrough
    out = out.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Restore inline code
    if (inlineCodes) {
      out = out.replace(/\x00INLINE(\d+)\x00/g, function (_, idx) {
        return inlineCodes[parseInt(idx, 10)];
      });
    }

    return out;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ---------------------------------------------------------------------------
  // Custom Element: <mark-down>
  // ---------------------------------------------------------------------------

  class MarkDownElement extends HTMLElement {
    connectedCallback() {
      this._render();
    }

    _render() {
      // Read raw text content (not innerHTML, to avoid double-parsing)
      const raw = this.textContent;

      // Dedent: remove common leading whitespace so indented usage looks clean
      const dedented = dedent(raw);

      const shadow = this.attachShadow({ mode: 'open' });

      // Inject the stylesheet link if a base URL is known, else inline minimal styles
      const linkEl = document.createElement('link');
      linkEl.rel = 'stylesheet';
      linkEl.href = resolveStylesheetHref();
      shadow.appendChild(linkEl);

      const container = document.createElement('div');
      container.className = 'markdown-body';
      container.innerHTML = parseMarkdown(dedented);
      shadow.appendChild(container);
    }
  }

  function dedent(str) {
    const lines = str.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n');
    const indent = lines
      .filter(function (l) { return l.trim().length > 0; })
      .reduce(function (min, l) {
        const match = l.match(/^(\s*)/);
        return Math.min(min, match ? match[1].length : 0);
      }, Infinity);
    const safeIndent = isFinite(indent) ? indent : 0;
    return lines.map(function (l) { return l.slice(safeIndent); }).join('\n');
  }

  function resolveStylesheetHref() {
    // Find the <script> tag that loaded this file and derive the CSS path
    const scripts = document.querySelectorAll('script[src]');
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].getAttribute('src');
      if (src && src.indexOf('mark-down') !== -1) {
        return src.replace(/mark-down\.js$/, 'mark-down.css');
      }
    }
    // Fallback: same directory
    return 'mark-down.css';
  }

  customElements.define('mark-down', MarkDownElement);
})();
