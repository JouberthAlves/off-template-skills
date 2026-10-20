# The prompt

Both sides got the same one-line request:

> Build a website for a burger restaurant.

## Normal agent

A clean Claude Code agent (Opus), in an empty folder, with no super-designer
skill and no vault. The full message it received, including the two lines it
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

## With super-designer

Claude Code (same model), following the `super-designer` skill step by step
from the same first line: discovery, brief, research, 3 directions, a choice
made by a person, build, review. This run happened in the session that wrote
the skill; a clean-room run with a fresh agent is listed under "What was
verified" in the README. Every step's output is in `super-designer/`. With a
one-line prompt there was nobody to answer the brief, so the agent answered
the 4 questions itself and showed them, as the skill says.

Everything about the restaurant (name, address, menu, prices) is fictional on
both sides.
