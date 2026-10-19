# Quiz question bank

This folder holds the structured CPACC, WAS, and ADS quiz banks, separate from the legacy CPACC-only `data/questions.json` consumed by the current game.

- `cpacc.json`, `was.json`, and `ads.json` contain structured draft banks. The ADS bank has 400 items: 20 questions for each of the 20 numbered ADS BoK sections.
- `taxonomy.json` defines stable certification, domain, and section IDs for the supported banks.
- `sources.json` maps question source IDs to the supplied Bodies of Knowledge and supporting resources.
- `question.schema.json` defines the shared question-record contract, including the ADS certification and five-domain ID pattern.

All ADS items are marked `draft`. The ADS bank follows the ADS BoK domain weights (25/25/25/15/10). These structured banks are separate from gameplay and are not wired into the game. The ADS set uses application-style scenarios; its records may be reviewed and revised before approval.
