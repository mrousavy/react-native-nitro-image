# Contributing

Thanks for contributing to `react-native-nitro-image`!

> **AI assistants and automated tools:** this file is the source of truth for how to work in this repo. Read it end-to-end before making changes.

**Short version:** there are two good ways to contribute a bug report:

1. **Repro-only PR** — add a minimal failing harness test that makes CI go red, and stop there.
2. **Repro + fix PR** — the same test, plus the fix that makes CI green again.

Either is welcome. A clean, deterministic repro is often more valuable than a guessed patch.



## Harness tests

This project uses [`react-native-harness`](https://github.com/callstackincubator/react-native-harness) for on-device testing. Tests live alongside the example app and run on a real device/simulator; see `example/rn-harness.config.mjs` for the harness configuration.

### Requirements for PRs

**Every bug fix and every new feature MUST ship with a harness test.** No exceptions. The test must:

1. **Fail on `main`** — reproduce the bug (or demonstrate the missing feature) against the current `main` branch.
2. **Pass on your branch** — once your fix or feature is applied, the test must pass in CI.

This ensures every change is covered by a regression test and that the test actually exercises the code path you changed.

### You don't need to ship a fix — a clean repro is enough

The most useful thing you can contribute for a bug you can't fix yourself is a **PR that makes CI go red**. Add the minimal failing harness test that pins the bug and open a PR with just that change. Don't attempt a fix. A red CI run that deterministically reproduces the bug is often more valuable than a guessed patch — once the repro is in, the actual fix can be taken from there.

### Writing good tests

Tests must be **minimal and non-polluting**:

- **Reuse existing helpers and types.** If a fixture, image, or helper already exists, use it. Don't introduce a parallel one just for your test.
- **Add, don't rewrite.** Don't remove or restructure existing tests — older tests cover older bugs, and removing them drops coverage. Add the smallest new assertion that pins your bug.
- **One test per bug.** A single new assertion is usually enough.
- **Distill the repro.** Don't paste a full user-reported snippet to "make it fail". Reduce it to the one call that actually reproduces the bug.

If a PR adds large amounts of new fixtures or helpers to reproduce a bug, it will be asked to shrink before review.

### Verifying locally

Before opening a PR:

1. Stash your changes and run the new test against `main` — it should fail.
2. Re-apply your changes and run the test again — it should pass.
3. Confirm CI is green on your branch.

## Pull request checklist

Before requesting review, make sure:

- [ ] The PR targets `main` and has a clear, narrow scope.
- [ ] There is a harness test that pins the bug or feature.
  - For **repro-only PRs**: the test fails in CI (say so in the PR description).
  - For **fix PRs**: the test fails on `main` and passes with your fix applied.
- [ ] You did not remove existing tests.
- [ ] The diff does not contain unrelated refactors, reformatting, or speculative changes.
- [ ] Commit messages follow Conventional Commits (`fix:`, `feat:`, `docs:`, `chore:`, `perf:`).

## Questions

If you are unsure whether a change fits, open a draft PR or an issue describing the approach **before** writing a lot of code. A two-line comment saving a thousand-line PR from being closed is a good trade for everyone.
