import { HTMLHint } from "htmlhint";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import defaultConfig, {
    createHtmlHintConfig,
    getHtmlHintConfigPath,
    type HtmlHintPreset,
    htmlHintPresets,
    loadHtmlHintConfig,
} from "../src/htmlhint-config.js";

const validDocument = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="description" content="A useful fixture">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="https://example.com/">
<title>Fixture</title>
</head>
<body><main><h1>Fixture</h1><img src="fixture.png" alt="Fixture"></main></body>
</html>`;

const fixture = { root: "" };

beforeAll(async () => {
    fixture.root = await mkdtemp(path.join(tmpdir(), "htmlhint-config-"));
});

afterAll(async () => {
    await rm(fixture.root, { force: true, recursive: true });
});

describe("hTMLHint presets", () => {
    it.each(htmlHintPresets)("loads and runs the %s preset", async (preset) => {
        const configPath = getHtmlHintConfigPath(preset);
        const config = await loadHtmlHintConfig(preset);

        expect(config).toStrictEqual(
            JSON.parse(await readFile(configPath, "utf8"))
        );
        expect(HTMLHint.verify(validDocument, config)).toStrictEqual([]);
    });

    it("keeps the default export aligned with recommended", async () => {
        expect(defaultConfig).toStrictEqual(await loadHtmlHintConfig());
    });

    it("lets a consumer override individual rules", () => {
        const config = createHtmlHintConfig("strict-document", {
            "title-require": false,
        });

        expect(config["title-require"]).toBe(false);
        expect(config["main-require"]).toBe(true);
    });

    it("makes the fragment preset accept an HTML fragment", async () => {
        const config = await loadHtmlHintConfig("fragment");

        expect(
            HTMLHint.verify('<button type="button">Save</button>', config)
        ).toStrictEqual([]);
    });

    it("reports meaningful accessibility failures", async () => {
        const config = await loadHtmlHintConfig("accessibility");
        const messages = HTMLHint.verify(
            '<!doctype html><html><head><meta charset="utf-8"><title>x</title></head><body><img src="x.png"></body></html>',
            config
        );

        expect(messages.map(({ rule }) => rule.id)).toStrictEqual(
            expect.arrayContaining([
                "alt-require",
                "html-lang-require",
                "main-require",
            ])
        );
    });

    it("rejects invented presets", () => {
        expect(() => getHtmlHintConfigPath("react" as HtmlHintPreset)).toThrow(
            RangeError
        );
    });

    it("runs the real CLI with a bundled config", async () => {
        const htmlPath = path.join(fixture.root, "index.html");
        await writeFile(htmlPath, validDocument);
        const cliPath = fileURLToPath(
            new URL("../node_modules/htmlhint/bin/htmlhint", import.meta.url)
        );
        const result = spawnSync(
            process.execPath,
            [
                cliPath,
                "--config",
                getHtmlHintConfigPath("strict-document"),
                htmlPath,
            ],
            { encoding: "utf8" }
        );

        expect(result.status).toBe(0);
        expect(result.stdout).toContain("no errors found");
    });
});
