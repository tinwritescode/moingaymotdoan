# 01: Reading streak on the home page

**What to build:** A reader with history sees, at the top of Continue reading, how many days in a row they have read a đoạn, their record, and a Monday–Sunday week strip. The streak comes from the reading logs (Bible chapters only, mood guides do not count). Before reading today the card says what to read next to keep the flame; after reading it says today is lit. Works in vi and en.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Streak, record and week marks derived from logs; a day counts once however many đoạn were read
- [x] Today / Done states on the home card with a link to the next đoạn
- [x] Old `stats.streak` removed; every streak number comes from the streak provider
- [x] Unit tests for the streak rules; component tests for the card states
