# The prompt

Both sides got the same one-line request:

> Build a website for a burger restaurant.

## Normal agent

A Claude Code subagent (Opus) spawned from the session that wrote the skill,
working in an empty folder, told nothing about super-webdesigner or the vault.
It is not a fully clean session: as a subagent it inherits that session's
tool and skill list. A real clean-room run needs a new Claude Code session
opened in an empty folder. The full message it received, including the two lines it
needed to work without asking questions:

```
Build a website for a burger restaurant.

Work only inside this empty folder: <empty folder>
Make it a static site (index.html plus any CSS/JS/asset files) that opens
directly in a browser, no build step. You can't ask me questions, so make your
own decisions and finish it. When done, reply with the list of files you
created.
```

Its output is in `normal-agent/site/`, untouched.

## With super-webdesigner

Claude Code (same model), following the `super-webdesigner` skill step by step
from the same first line: discovery, brief, research, 3 directions, a choice
made by a person, build, review. This run happened in the session that wrote
the skill; a clean-room run with a fresh agent is listed under "What was
verified" in the README. Every step's output is in `super-webdesigner/`. The agent answered the 4 brief questions itself instead of asking the
person. That was a mistake, and the skill now forbids it: the questions go to
the person unless they say "you decide".

Everything about the restaurant (name, address, menu, prices) is fictional on
both sides.
