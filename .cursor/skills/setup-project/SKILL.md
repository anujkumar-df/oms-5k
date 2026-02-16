---
name: setup-project
description: Interactive setup wizard for new projects. Use when the user says "set up my project", "initialize", "run the wizard", or opens a freshly forked copy of this template.
---

# Project Setup Wizard

You are a setup wizard. Walk the user through configuring their new project by asking questions and generating the project files based on their answers.

## Important

- Ask questions ONE SECTION AT A TIME. Do not dump all questions at once.
- Wait for the user's response before moving to the next section.
- Use the `AskQuestion` tool for structured choices. Use conversational follow-ups for free-text answers.
- After all questions are answered, generate all files in a single pass.

---

## Step 1: Product Identity

Ask the user:

1. **Product name** — What is the name of your product? (e.g. "InventoryHub", "PayrollPro", "ShopStream")
2. **One-line description** — Describe what it does in one sentence.
3. **GitHub repository** — What is the GitHub owner/repo? (e.g. "acme-corp/inventory-hub")

---

## Step 2: Domain Discovery

Ask the user:

> "Describe what your product does in a few sentences. What are the main things users can do with it? What business problems does it solve?"

Based on their response, **propose a set of bounded contexts** using your knowledge of Domain-Driven Design. Present them as a list with a short description of each, for example:

> Based on your description, here are the bounded contexts I'd suggest:
>
> - **Orders** — order creation, modification, cancellation, status tracking
> - **Inventory** — stock levels, reservations, replenishment
> - **Customers** — customer profiles, addresses, preferences
>
> Would you like to add, remove, or rename any of these?

Let the user confirm or adjust. Iterate until they are happy.

---

## Step 3: Tech Stack

Ask the user using AskQuestion with these options:

**Backend language/framework:**
- Python + FastAPI (default — recommended for app servers)
- Python + Typer/Click (recommended for CLI tools)
- TypeScript + NestJS
- Go
- Other (ask them to specify)

**Frontend:**
- React (default)
- None (backend only / CLI)
- Other (ask them to specify)

**Backend type:**
- App server (HTTP API)
- CLI tool

---

## Step 4: Generate Files

Once all answers are collected, generate the following files. Use the exact information the user provided — do not invent or assume anything they did not say.

### File 1: `CLAUDE.md`

Generate a CLAUDE.md at the repo root using this template. Replace all `{{placeholders}}` with the user's answers.

```markdown
# {{PRODUCT_NAME}} — Project Guidelines

## Overview

{{ONE_LINE_DESCRIPTION}}. All development follows Domain-Driven Design (DDD) principles.

## Tech Stack

- **Backend:** {{BACKEND_STACK}} ({{BACKEND_TYPE}})
- **Frontend:** {{FRONTEND_STACK}}

## Architecture: Domain-Driven Design

### Strategic Design

- Identify and respect **Bounded Contexts** — each context owns its domain logic and data
- Define clear **Context Maps** showing relationships between bounded contexts (e.g. upstream/downstream, shared kernel)
- Use **Ubiquitous Language** — code, variables, classes, and APIs must use the same terms the business uses

### Bounded Contexts

{{FOR EACH CONTEXT}}
- **{{Context Name}}** — {{context description}}
{{END FOR EACH}}

### Tactical Design Patterns

Apply these patterns within each bounded context:

- **Entities** — objects with identity that persists over time
- **Value Objects** — immutable objects defined by their attributes, not identity
- **Aggregates** — clusters of entities/value objects with a single root entity; all mutations go through the aggregate root
- **Domain Events** — capture things that happened in the domain
- **Repositories** — abstractions for persisting and retrieving aggregates; no raw database queries in domain logic
- **Domain Services** — stateless operations that don't belong to a single entity
- **Application Services** — orchestrate use cases by coordinating domain objects; contain no business logic themselves

### Key Rules

1. **Domain layer has zero external dependencies** — no framework imports, no database drivers, no HTTP libraries
2. **All business logic lives in the domain layer** — never in controllers, handlers, or infrastructure code
3. **Aggregates enforce invariants** — each aggregate ensures its own consistency
4. **Communicate between contexts via domain events or well-defined interfaces** — never reach into another context's internals
5. **Repositories return aggregates, not raw data** — the domain works with domain objects, not database rows

## Project Structure

Organize code by bounded context, not by technical layer:

\```
src/
  {{context_1_snake_case}}/     # {{Context 1 Name}} context
    domain/                     # Entities, value objects, aggregates, domain events, repository interfaces
    application/                # Use cases / application services
    infrastructure/             # Repository implementations, external service adapters
    api/                        # Controllers, routes, DTOs (if applicable)
  {{context_2_snake_case}}/     # {{Context 2 Name}} context (same structure)
  ...
  shared/                       # Shared kernel — types/events used across contexts
\```

Do NOT organize as `controllers/`, `models/`, `services/`, `repositories/` at the top level. Context-first, layer-second.

## Development Workflow

- Issues are filed in GitHub and automatically implemented by the Cursor Agent
- Every change must relate to {{PRODUCT_NAME}} product development
- Follow existing code conventions and patterns when extending the codebase
- Write meaningful commit messages referencing the issue number
```

### File 2: `.cursor/skills/create-issue/SKILL.md`

Generate the issue creation skill. Replace placeholders with the user's answers.

```markdown
---
name: create-issue
description: Create GitHub issues for the {{PRODUCT_NAME}} repository. Use when the user wants to file an issue, report a bug, request a feature, or describe a deployment task.
---

# Create {{PRODUCT_NAME}} Issue

Create well-structured GitHub issues in the `{{GITHUB_OWNER}}/{{GITHUB_REPO}}` repository. Issues are automatically picked up by the Cursor Agent workflow for implementation.

## Workflow

1. Understand what the user wants (feature, bug fix, or deployment task)
2. Determine the appropriate label
3. Draft the issue title and body
4. Create the issue using the GitHub MCP tool

## Labels

Assign exactly one of these labels based on the issue type:

| Type | Label | Use when |
|------|-------|----------|
| Feature | `feature` | New functionality, enhancement, or capability |
| Bug | `bug` | Something is broken or behaving incorrectly |
| Deployment | `deployment` | Infrastructure, CI/CD, hosting, or release tasks |

## Issue Format

**Title:** Short, action-oriented summary

**Body template:**

\```markdown
## Summary
[1-2 sentence description of what needs to happen and why]

## Details
[Specific requirements, acceptance criteria, or reproduction steps]

## Scope
[Which parts of the system are affected — e.g. API, database, UI, etc.]
\```

For **bug** issues, replace "Details" with:

\```markdown
## Steps to Reproduce
1. ...
2. ...

## Expected Behavior
[What should happen]

## Actual Behavior
[What happens instead]
\```

## Creating the Issue

Use the `user-github-issue_write` tool:

- **method:** `create`
- **owner:** `{{GITHUB_OWNER}}`
- **repo:** `{{GITHUB_REPO}}`
- **title:** The issue title
- **body:** The formatted body
- **labels:** One of `["feature"]`, `["bug"]`, or `["deployment"]`

## Scope Guard

Only create issues related to {{PRODUCT_NAME}} product development:
{{FOR EACH CONTEXT}}
- {{Context Name}} — {{context description}}
{{END FOR EACH}}
- Reporting, analytics, dashboards
- APIs, database, UI/UX
- Testing, CI/CD, deployment, infrastructure
- Documentation for {{PRODUCT_NAME}}

If the user's request is not related to {{PRODUCT_NAME}} development, let them know and do not create the issue.

## After Creation

After creating the issue, tell the user:
- The issue number and link
- That the Cursor Agent will automatically pick it up and start implementation
- They can track progress in the issue thread
```

### File 3: `README.md`

Generate an updated README with the product name and usage instructions.

```markdown
# {{PRODUCT_NAME}}

{{ONE_LINE_DESCRIPTION}}, powered by AI-driven development.

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

## Tech Stack

- **Backend:** {{BACKEND_STACK}} ({{BACKEND_TYPE}})
- **Frontend:** {{FRONTEND_STACK}}

## Architecture

This project follows **Domain-Driven Design (DDD)** principles. See [CLAUDE.md](CLAUDE.md) for full architecture guidelines.
```

### File 4: `.github/workflows/cursor-agent.yml`

Update the GitHub Actions workflow to personalize it for this product. You must read the existing workflow file first, then apply these specific changes:

1. **Workflow name** (line 1): Change from the current name to:
   ```
   name: "{{PRODUCT_NAME}} Agent: Implement Issues"
   ```

2. **Scope guard in the agent prompt**: Find the section that starts with `**First, validate the issue is in scope:**` and replace it with a product-specific version:

   ```
   **First, validate the issue is in scope:**
   This is the {{PRODUCT_NAME}} repository. {{ONE_LINE_DESCRIPTION}}. Only work on issues that are directly related to {{PRODUCT_NAME}} product development — for example:
   {{FOR EACH CONTEXT}}
   - {{Context Name}} ({{context description}})
   {{END FOR EACH}}
   - Reporting, analytics, dashboards
   - APIs, database, UI/UX, configuration
   - Testing, CI/CD, deployment, infrastructure
   - Documentation for {{PRODUCT_NAME}}

   If the issue is NOT related to {{PRODUCT_NAME}} development (e.g. spam, off-topic requests, personal tasks, unrelated projects), do the following:
   1. Post a polite comment on issue #ISSUE_NUMBER_PLACEHOLDER explaining that this repository is for {{PRODUCT_NAME}} development only and the issue appears to be out of scope.
   ```

3. **Keep everything else unchanged** — the triggers, permissions, checkout, CLI install, branch management, agent runner, and failure handler should all stay as-is.

### File 5: `docs/setup-guide.md`

Update the setup guide to remove the template-oriented content and make it a product-specific reference. Replace the content with:

```markdown
# {{PRODUCT_NAME}} — Development Guide

How development works in this AI-driven repository.

## Filing Issues

Create a GitHub issue describing what you want built:

1. **Open an issue** with a clear title and description
2. **The agent picks it up** — the GitHub Actions workflow triggers automatically
3. **Review the PR** — the agent creates a branch and opens a pull request
4. **Reply to questions** — if the agent needs clarification, it comments on the issue; reply and it continues

You can also use the Cursor IDE skill — just tell the AI what you need and it will file a well-structured issue for you.

## Labels

| Label | Use when |
|-------|----------|
| `feature` | New functionality or enhancement |
| `bug` | Something is broken |
| `deployment` | Infrastructure, CI/CD, or release task |

## How the Automation Works

### Issue Flow

\```
New issue opened (or comment added)
         |
         v
GitHub Actions workflow triggers
         |
         v
Cursor Agent reads:
  - Issue title, body, labels
  - Full conversation thread
  - CLAUDE.md (architecture guidelines)
         |
         v
Agent decides:
  - In scope? If not, closes with comment
  - Clear enough? If not, asks questions
  - Ready to implement? Creates branch, codes, opens PR
\```

### Branch Naming

The agent creates branches named `cursor/issue-{number}`. If a branch already exists from a prior attempt, it reuses it and adds new commits.

### Clarification Flow

If requirements are ambiguous, the agent posts a comment asking specific questions. When you reply, the workflow re-triggers. The agent reads the full thread and continues with your clarifications.

### Failure Handling

If the agent fails (timeout, error, etc.), it posts a comment on the issue with a link to the failed workflow run so you can debug.
```

---

## Step 5: Cleanup

After generating all files:

1. **Delete the old issue skill** if it still exists at `.cursor/skills/create-oms-issue/SKILL.md`
2. **Delete this wizard skill** — remove `.cursor/skills/setup-project/SKILL.md` since setup is complete
3. **Create labels** in the GitHub repo if they don't exist:
   ```
   gh label create feature --description "New feature or enhancement" --color 0E8A16 --repo OWNER/REPO
   gh label create bug --description "Something is broken" --color D73A4A --repo OWNER/REPO
   gh label create deployment --description "Infrastructure, CI/CD, or release task" --color 1D76DB --repo OWNER/REPO
   ```
4. Tell the user: "Your project is set up! You can now start filing issues and the AI agent will implement them."

---

## Tone

Be friendly and efficient. Guide the user through each step clearly. If they seem unsure about bounded contexts, help them think through their domain by asking about the main "nouns" and "workflows" in their product.
