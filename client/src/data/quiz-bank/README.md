# Quiz question bank

This folder holds the structured CPACC and WAS quiz bank, separate from the legacy CPACC-only `data/questions.json` consumed by the current game.

- `cpacc.json` and `was.json` contain the current draft bank (300 CPACC and 30 WAS). The CPACC bank is at its initial 300-item target; next expand the WAS bank to 300 items.
- `taxonomy.json` defines stable certification, domain and section IDs used by this batch. Extend it from the complete BoKs as coverage grows.
- `sources.json` maps question source IDs to the supplied BoKs and linked supporting resources.
- `question.schema.json` defines the question-record contract.

All items are marked `draft`. The CPACC bank follows the BoK's 40/40/20 domain weighting. It is separate from gameplay and is not yet wired into the game. For long sessions, the game should track item IDs for the whole session to prevent exact repeats, while allowing concepts to recur through distinct questions. A cooldown by concept can reduce back-to-back near-duplicates.


