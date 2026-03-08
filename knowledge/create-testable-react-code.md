# Create testable React code

The container-presentation pattern is awesome to test UI response to state but it doesn't test logic. To test logic you have to make containers hold **orchestration** code only and extract logic and side-effects code to pure functions. Orchestration is not easily testable—it require a lot of mocks (context, APIs, timers, navigation). Keeping that layer thin and testing the pure logic instead avoids the mock trap.

- Test UI: container-presentation pattern
- Test logic: extract business rules to separate function and import into container

> Warning: if you are mocking it's a smell

## When to use the full split (Container + View + Logic)

Don't apply the three-way split to every component—it gets verbose. Use it only where it pays off.

| Situation | Approach |
|-----------|----------|
| **Screens/flows with real orchestration** (context, mutations, state machines, branching) | Container + View + Logic. Worth the extra files: easy to test and change. |
| **Simple presentational components** (labels, cards, list rows, props → JSX) | Single file. No need for extra layers. |
| **In between** (some state, one hook, no heavy logic) | One component. Extract a small hook or pure helper only when it gets messy. |

Rule of thumb: use the full split for workflow steps, checkout steps, anything that does "on click → call API → send event with this payload." Keep the rest in one place until it grows enough to justify a split. That way the pattern stays where it's worth the verbosity.


### Tanstack Query mutations

Prefer using `mutateAsync` over `mutate` because it's easier to test. Also consider rethrowing errors to the container when you also needed to handle it in logic layer.