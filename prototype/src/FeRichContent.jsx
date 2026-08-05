import { Fragment } from "react";

export function TextWithBreaks({ text }) {
  return String(text || "").split("\n").map((line, index, lines) => (
    <Fragment key={`${index}-${line.slice(0, 12)}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </Fragment>
  ));
}
