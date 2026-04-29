# Contributing

Thanks for contributing to `react-native-nitro-image`!

## Harness tests

This project uses [`react-native-harness`](https://github.com/margelo/react-native-harness) for on-device testing.

### Requirements for PRs

For any **bug fix** or **new feature**, your PR must include a harness test that:

1. **Fails on `main`** — the test must reproduce the bug (or demonstrate the missing feature) against the current `main` branch.
2. **Passes on your branch** — once your fix or feature is applied, the test must pass in CI.

This ensures every change is covered by a regression test and that the test actually exercises the code path you changed.

### Writing tests

Harness tests live alongside the example app and run on a real device/simulator. See existing tests for reference and check `example/rn-harness.config.mjs` for the harness configuration.

### Verifying locally

Before opening a PR:

1. Stash your changes and run the new test against `main` — it should fail.
2. Re-apply your changes and run the test again — it should pass.
3. Confirm CI is green on your branch.

