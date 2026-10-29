---
description: Append this session to the activity log
argument-hint: [optional note]
allowed-tools: Read, Edit, Bash(date:*), Bash(git branch:*)
---

Append one row to the table in `docs/journal/activity-log.md` for this session.

- **Date:** today (`date +%F`)
- **Issue:** from the current branch name, or `—`
- **Agent(s):** which agents worked in this session
- **Model:** main model used
- **Time:** ask the user if unknown
- **Usage:** ask the user to paste the output of `/usage` or `/cost`, then record the key number
- **Outcome:** done / partial / blocked / failed
- **Interv.:** number of times the user corrected or unblocked you this session — be honest
- **Note:** one line; use "$ARGUMENTS" if given, otherwise the most useful lesson from the session

Only append — never edit existing rows. Show the added row when done.
