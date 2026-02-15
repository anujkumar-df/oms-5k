# oms-5k

Order Management System powered by AI-driven development.

## Usage

1. **Open a GitHub issue** with a clear title and description of the feature or bug fix.
2. **Wait for the agent** — it picks up the issue automatically.
   - If the issue is clear, it implements the changes and opens a PR.
   - If the issue is ambiguous, it posts a comment asking for clarification.
3. **Reply to clarifications** — if the agent asks questions, respond in the issue thread. It will pick up your reply and continue.
4. **Review the PR** — check the code, request changes if needed, and merge when ready.

## How It Works

- A GitHub Actions workflow triggers on every new issue and on issue comments
- The Cursor Agent reads the issue and the full conversation thread
- If the requirements are clear, it creates a branch (`cursor/issue-{number}`), implements the changes, and opens a PR
- If the requirements are ambiguous, it posts clarifying questions on the issue and waits for a reply
- When someone replies, the workflow re-triggers — the agent reads the updated thread and proceeds with implementation
- Bot comments are ignored to prevent infinite loops
- If something goes wrong, it posts a comment on the issue with a link to the failed workflow run
