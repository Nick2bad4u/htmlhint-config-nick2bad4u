# htmlhint-config-nick2bad4u

[![Continuous Integration](https://github.com/Nick2bad4u/htmlhint-config-nick2bad4u/actions/workflows/ci.yml/badge.svg)](https://github.com/Nick2bad4u/htmlhint-config-nick2bad4u/actions/workflows/ci.yml)

Reusable [HTMLHint](https://htmlhint.com/) policies for complete documents,
accessibility-focused checks, and HTML fragments.

## Install

```sh
npm install --save-dev htmlhint htmlhint-config-nick2bad4u
```

## Presets

| Preset            | Intended use                                               |
| ----------------- | ---------------------------------------------------------- |
| `recommended`     | Balanced syntax, safety, document, and form checks.        |
| `strict-document` | Complete public documents with metadata and no inline CSS. |
| `accessibility`   | Structural accessibility requirements without style rules. |
| `fragment`        | Components/fragments that do not include an HTML shell.    |

## CLI usage

HTMLHint does not extend an installed package automatically, so provide the
config path explicitly:

```json
{
 "scripts": {
  "lint:html": "htmlhint --config node_modules/htmlhint-config-nick2bad4u/presets/recommended.json \"**/*.html\""
 }
}
```

The shorter compatibility path also selects `recommended`:

```sh
htmlhint --config node_modules/htmlhint-config-nick2bad4u/recommended.json index.html
```

## JavaScript API

```js
import {
 createHtmlHintConfig,
 getHtmlHintConfigPath,
 loadHtmlHintConfig,
} from "htmlhint-config-nick2bad4u";
import { HTMLHint } from "htmlhint";

const config = createHtmlHintConfig("strict-document", {
 "inline-style-disabled": false,
});
const messages = HTMLHint.verify(source, config);

const accessibilityPath = getHtmlHintConfigPath("accessibility");
const fragmentConfig = await loadHtmlHintConfig("fragment");
```

Consumer rule keys replace the selected preset values. HTMLHint rule
configuration is flat, so no ambiguous deep-merge behavior is involved.

## Choosing a preset

- Use `strict-document` only for pages that own the full document shell.
- Use `fragment` for partial templates and component fixture HTML.
- `accessibility` is a useful additional gate, but HTMLHint is not a substitute
  for browser-based accessibility testing.

## Requirements

- Node.js `^22.22.3`, `^24.16.0`, or `>=26.3.0`
- HTMLHint `^1.9.2`

## License

[MIT](LICENSE)
