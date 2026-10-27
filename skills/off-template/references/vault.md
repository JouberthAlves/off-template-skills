# The vault: when to offer it, and how to show it works

The vault is the person's memory across sessions: their rules, the mistakes
you were corrected on, the niches already researched and the styles already
used. People say no to it when it is asked for in the abstract ("do you want
an Obsidian vault?") and yes when they see what it saves. So: never ask for it
up front, offer it at the moment something would be lost, and make every
save and every reuse visible.

## Ask once

Read `Vault:` in `design/setup.md` first.

- A path: use that vault. Read it in step 0 of the flow.
- `no`: never offer again in this project. The lines in "Without a vault"
  below still apply, once per delivery.
- Missing or `not asked yet`: you may offer, at most once per session, at the
  first of the moments below.

Write the answer to `design/setup.md` the moment you get it (`Vault: <path>`,
`Vault: no`, or `Vault: not now` — "not now" lets you offer again in a later
session, never in this one).

## When to offer

Offer at the first of these that happens, in one or two lines, with the
concrete thing that would be kept. Never as a separate stop: it rides on a
message you are already sending.

1. **After the research (step 3).** You just read 8 to 15 sites of a niche.
   > I read 12 burger truck sites. With a vault, the next burger site starts
   > from this research instead of redoing it, and its style can't repeat
   > this one. Create it at `~/off-template-vault`? (yes / another folder /
   > no)
2. **When the person corrects you** ("don't use X", "I said Y"). The fix
   becomes a rule only if it is written somewhere the next session reads.
   > Noted. Save this as a rule for the next projects? It goes into a vault
   > at `~/off-template-vault` (yes / another folder / no).
3. **When you log the style (step 8)** and there is no vault: the entry goes
   to `design/style-log.md`, which no other project reads.

## One yes creates it

On a yes (or a folder), without more questions:

1. Copy the starter vault that ships with the skill (`assets/vault/`, next
   to this `references/` folder) to the path. If the folder already exists
   and is not empty, stop and ask: never write over someone's notes.
2. Write what this session already produced into it: the niche research as
   `10 Notes/Styles of <niche>.md` (linked from `Styles.md`), the rule the
   person just gave in `90 System/Agent rules.md` or `10 Notes/Design rules.md`
   with its entry in `Mistakes.md`, and, at step 8, the project note.
3. Write `Vault: <path>` in `design/setup.md`.
4. Tell the person, in two lines: where it is, what is already in it, and that
   it is plain Markdown. **Obsidian is optional**: it gives the link graph and
   an easy way to edit the rules (obsidian.md, free). Don't install it
   yourself.

Nothing to install, no account. If the copy fails (no write access), say so
and carry on without a vault.

## Show what it kept

At the end of each delivery (STOP 2), one line:

> Saved to your vault: style "Fisheye Session" in `20 Projects/`, the burger
> truck research, 1 rule (no phone-only ordering).

Only what was actually written this session. Nothing was written: skip the
line.

## Show when it helped

When something you read in the vault changes a decision, say it at that
moment, naming the note:

> From your vault: "Halfway" already used char and cheese with Bowlby One, so
> direction A keeps the burger close-up but takes another palette.
> From your vault: you asked for no tracked caps (Design rules), so the labels
> are sentence case.

One line each, only for real changes, at most three per stop. This is the
proof that keeps the person using it: never invent one, and never claim the
vault helped when you only read it.

## Without a vault

When the person said no or not now, one line at STOP 2 says what stays only
in this project, without asking again:

> Without a vault, this research and this style stay only in `design/` of
> this project.

Once per delivery, never as a question.
