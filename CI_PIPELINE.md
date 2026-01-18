# CI Pipeline Overview

This project uses GitLab CI to build Docker images, start the application and MongoDB via Docker Compose, run the Jest test suite inside a dedicated test container, and publish coverage artifacts.

## Pipeline stages

1. **prepare_images**
   - Builds the application image (`sample`) and the test image (`test`) from `Dockerfile` and `TestDockerfile`.
2. **setup_applications**
   - Starts `st-sample` and `mongo` containers using Docker Compose on the shared `mynetwork` bridge.
3. **check_status**
   - Verifies the containers are running and reachable.
4. **test**
   - Runs `npm test` in the test container against the running API and DB.
   - Copies Jest coverage output to the CI workspace as artifacts.
5. **teardown_applications**
   - Stops and removes the containers and network created by Docker Compose.

## Automated testing in CI
- `npm test` executes the Jest unit/integration suite and performs DB cleanup.
- Coverage is collected automatically by Jest (see `jest.config.js`) and exported as pipeline artifacts.

## How to demonstrate the pipeline works
- Trigger a pipeline run (push or merge request) and confirm:
  - All stages complete successfully.
  - The `test` stage uploads a `coverage/` artifact.
  - Failed tests cause the pipeline to fail.
