import { Fragment } from "react";

function fallbackBlocks(value) {
  const text = String(value || "").replace(/\r\n?/g, "\n").trim();
  if (!text) return [];
  return text.split(/\n{2,}/).map((part) => ({ type: "paragraph", text: part.trim() })).filter((block) => block.text);
}

export function TextWithBreaks({ text }) {
  return String(text || "").split("\n").map((line, index, lines) => (
    <Fragment key={`${index}-${line.slice(0, 12)}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </Fragment>
  ));
}

export function FeRichContent({ blocks, fallback, className = "", compact = false }) {
  const content = Array.isArray(blocks) && blocks.length > 0 ? blocks : fallbackBlocks(fallback);
  return (
    <div className={`fe-rich-content ${compact ? "is-compact" : ""} ${className}`.trim()}>
      {content.map((block, index) => {
        const key = `${block.type || "paragraph"}-${index}`;
        if (block.type === "code") {
          return (
            <div className="fe-code-block" key={key}>
              <div className="fe-block-label">{block.language === "pseudocode" ? "擬似言語" : "コード"}</div>
              <pre tabIndex={0}><code>{block.text || block.code || ""}</code></pre>
            </div>
          );
        }
        if (block.type === "table") {
          const headers = Array.isArray(block.headers) ? block.headers : [];
          const rows = Array.isArray(block.rows) ? block.rows : [];
          return (
            <div className="fe-table-block" key={key}>
              {block.caption && <p className="fe-table-caption">{block.caption}</p>}
              <div className="fe-table-scroll" tabIndex={0}>
                <table>
                  {headers.length > 0 && <thead><tr>{headers.map((cell, cellIndex) => <th key={`${key}-h-${cellIndex}`}>{cell}</th>)}</tr></thead>}
                  <tbody>{rows.map((row, rowIndex) => <tr key={`${key}-r-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`${key}-r-${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody>
                </table>
              </div>
            </div>
          );
        }
        if (block.type === "list") {
          return <ul className="fe-content-list" key={key}>{(block.items || []).map((item, itemIndex) => <li key={`${key}-${itemIndex}`}><TextWithBreaks text={item} /></li>)}</ul>;
        }
        if (block.type === "note") {
          return <aside className="fe-content-note" key={key}><TextWithBreaks text={block.text} /></aside>;
        }
        if (block.type === "image" && block.src) {
          return (
            <figure className="fe-content-figure" key={key}>
              <img src={block.src} alt={block.alt || "問題資料"} loading="lazy" />
              {block.caption && <figcaption>{block.caption}</figcaption>}
            </figure>
          );
        }
        return <p key={key}><TextWithBreaks text={block.text ?? block.value ?? ""} /></p>;
      })}
    </div>
  );
}
