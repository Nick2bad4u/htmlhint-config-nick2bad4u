# Repository Instructions

This repository publishes `htmlhint-config-nick2bad4u`.

## Public surfaces

- Treat `.htmlhintrc`, every file under `presets/`, and the typed API as public.
- Keep every raw file accepted by HTMLHint's real `--config` option.
- Do not enable full-document rules in the fragment preset.
- Do not describe HTMLHint as a replacement for runtime accessibility tests.

## Verification

Run `npm run release:verify`. Tests must use both `HTMLHint.verify` and the real
CLI with positive and deliberately invalid fixtures.
