import type { UnknownRecord } from "type-fest";

import { fileURLToPath } from "node:url";
import { arrayIncludes, arrayJoin } from "ts-extras";

import accessibilityConfig from "../presets/accessibility.json" with { type: "json" };
import fragmentConfig from "../presets/fragment.json" with { type: "json" };
import recommendedConfig from "../presets/recommended.json" with { type: "json" };
import strictDocumentConfig from "../presets/strict-document.json" with { type: "json" };

/** Portable HTMLHint rule map. */
export type HtmlHintConfig = Readonly<Record<string, HtmlHintRuleValue>>;

/** Bundled policy choices. */
export type HtmlHintPreset =
    | "accessibility"
    | "fragment"
    | "recommended"
    | "strict-document";

/** Values accepted by HTMLHint's rule map. */
export type HtmlHintRuleValue =
    | boolean
    | number
    | Readonly<UnknownRecord>
    | string;

/** All bundled preset names in stable display order. */
export const htmlHintPresets: readonly HtmlHintPreset[] = Object.freeze([
    "recommended",
    "strict-document",
    "accessibility",
    "fragment",
]);

const presetConfigs: Readonly<Record<HtmlHintPreset, HtmlHintConfig>> = {
    accessibility: accessibilityConfig,
    fragment: fragmentConfig,
    recommended: recommendedConfig,
    "strict-document": strictDocumentConfig,
};

const presetPaths: Readonly<Record<HtmlHintPreset, string>> = {
    accessibility: fileURLToPath(
        new URL("../presets/accessibility.json", import.meta.url)
    ),
    fragment: fileURLToPath(
        new URL("../presets/fragment.json", import.meta.url)
    ),
    recommended: fileURLToPath(
        new URL("../presets/recommended.json", import.meta.url)
    ),
    "strict-document": fileURLToPath(
        new URL("../presets/strict-document.json", import.meta.url)
    ),
};

const isPreset = (value: unknown): value is HtmlHintPreset =>
    arrayIncludes(htmlHintPresets, value);

/** Create a preset with consumer rule overrides. */
export function createHtmlHintConfig(
    preset: HtmlHintPreset = "recommended",
    overrides: HtmlHintConfig = {}
): HtmlHintConfig {
    return structuredClone({ ...presetConfigs[preset], ...overrides });
}

/**
 * Return the absolute path to one bundled JSON preset.
 *
 * @throws {@link RangeError} If `preset` is not bundled.
 */
export function getHtmlHintConfigPath(
    preset: HtmlHintPreset = "recommended"
): string {
    if (!isPreset(preset)) {
        throw new RangeError(
            `Unknown HTMLHint preset: ${String(valueForMessage(preset))}. Expected one of: ${arrayJoin(htmlHintPresets, ", ")}.`
        );
    }

    return presetPaths[preset];
}

/** Load a fresh copy of one bundled preset. */
export function loadHtmlHintConfig(
    preset: HtmlHintPreset = "recommended"
): Promise<HtmlHintConfig> {
    return Promise.resolve(structuredClone(presetConfigs[preset]));
}

function valueForMessage(value: unknown): unknown {
    return value;
}

/** Recommended balanced policy. */
const defaultConfig: HtmlHintConfig = Object.freeze(createHtmlHintConfig());

export default defaultConfig;
