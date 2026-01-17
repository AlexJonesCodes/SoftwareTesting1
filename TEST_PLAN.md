# Test Plan

## 1) Design and implement comprehensive test plans with instrumented code

### Scope and objectives
This plan targets the core functional and non-functional requirements covered by the existing and newly added tests:

- **R1: Authorization and token handling**
  - Ownership enforcement for order read/update/delete.
  - JWT validation and rejection of invalid or stale tokens.
- **R2: Registration security and validation**
  - Password hashing strength.
  - Input validation and duplicate detection.
- **R3: Performance thresholds**
  - Response time constraints for the health endpoint.

### Test technique coverage (aligned to requirements)
- **Specification-based / functional testing** for R1–R3 through API-level tests.
- **Structural / white-box testing** via unit tests of the auth middleware branches.
- **Model-based testing** via a simple auth state transition test (unauthenticated → authenticated → deleted).
- **Combinatorial testing** via a small set of input combinations for registration.
- **Performance testing** via response time thresholds.

### Implementation references (tests that answer the plan)
- **R1: Authorization and token handling**
  - Ownership checks for read/update/delete: `__tests__/api/authz.ownership.test.js`
  - Token integrity and deleted-user token rejection: `__tests__/api/authz.tokens.test.js`
  - Auth state transitions: `__tests__/api/model.auth-state.test.js`
  - Auth middleware branch behavior: `__tests__/app/auth.unit.test.js`
- **R2: Registration security and validation**
  - Bcrypt cost factor verification: `__tests__/api/register.security.test.js`
  - Duplicate email and role validation: `__tests__/api/register.validation.test.js`
  - Combinatorial inputs: `__tests__/api/register.combinatorial.test.js`
- **R3: Performance thresholds**
  - 100ms and 500ms response time checks: `__tests__/app/perf.thresholds.test.js`

## 2) Construction of the test plan

### Test inventory and traceability
The plan tracks each requirement and links it to specific tests:

| Requirement | Tests | Goal |
| --- | --- | --- |
| R1 | `authz.ownership.test.js`, `authz.tokens.test.js`, `model.auth-state.test.js`, `auth.unit.test.js` | Ensure access control, token validity, and auth flow states are enforced. |
| R2 | `register.security.test.js`, `register.validation.test.js`, `register.combinatorial.test.js` | Ensure secure password storage and robust input validation. |
| R3 | `perf.thresholds.test.js` | Ensure response time thresholds are met. |

### Test data and setup
- User accounts are created through the public API for realism.
- Admin credentials are used for privileged actions.
- Unique suffixes avoid collisions in shared environments.

### Execution strategy
- Run API/integration tests against a running service instance.
- Run unit tests in isolation with mocks for deterministic coverage of middleware branches.
- Collect coverage in CI or local runs to confirm instrumentation.

## 3) Evaluation of the quality of the test plan

### Adequacy criteria
- **Requirements coverage:** Each requirement has at least one direct test and supporting coverage (auth flow, validation, performance).
- **Technique coverage:** Functional, structural, model-based, combinatorial, and performance techniques are represented.
- **Risk focus:** Authorization, authentication, and registration are prioritized due to security impact.

### Quality checks
- Verify each requirement has traceable tests in the table above.
- Ensure tests include both positive and negative outcomes (success and rejection).
- Validate that the plan includes non-functional performance expectations.

## 4) Instrumentation of the code

### Instrumentation approach
- **Jest coverage** is enabled to instrument the code under test and report statement/branch/function/line coverage.
- Coverage is collected across unit and API tests to ensure key modules (auth, users, orders) are exercised.

### Instrumentation configuration
- Jest is configured to collect coverage and provide summary reports.

## 5) Evaluation of the instrumentation

### Instrumentation quality criteria
- **Coverage completeness:** Coverage reports should include auth middleware branches and registration paths.
- **Signal quality:** Coverage gaps highlight untested branches for future test additions.
- **Repeatability:** Coverage runs should be deterministic across environments.

### Instrumentation review steps
- Review coverage summaries after test runs to confirm all required modules are included.
- Check that unit tests hit the no-token and valid-token branches in auth middleware.
- Check that API tests exercise user registration and order ownership flows.
