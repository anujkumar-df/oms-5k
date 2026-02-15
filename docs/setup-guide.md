# AI-Driven Development Setup Guide

A step-by-step guide for setting up a new project with fully automated, AI-driven development using Cursor Agent and GitHub Actions. This was originally built for an Order Management System (OMS), but the pattern applies to any domain — ERP, CRM, e-commerce, etc.

## What You'll End Up With

- A GitHub repo where you **file issues** and an AI agent **implements them as PRs**
- The agent asks **clarifying questions** when requirements are ambiguous, then continues once you reply
- A **Cursor IDE skill** that lets you create well-structured issues by just describing what you need
- **DDD architecture guidelines** baked into the project so the agent writes properly structured code
- **Scope guardrails** so the agent only works on issues relevant to your product

## Prerequisites

- A GitHub repository
- A [Cursor API key](https://cursor.com) for the CI agent
- GitHub CLI (`gh`) installed locally (for label creation and secret setup)

---

## Step 1: Create the GitHub Actions Workflow

Create `.github/workflows/cursor-agent.yml` with a workflow that:

**Triggers on:**
- `issues: types: [opened]` — every new issue kicks off the agent
- `issue_comment: types: [created]` — replies to the agent's clarification questions re-trigger it

**Guard against infinite loops:**
- Filter out bot comments in the `if` condition so the agent doesn't re-trigger itself
- Only run on open issues, not on PR comments

**Steps:**
1. Checkout the repo
2. Install Cursor CLI (`curl https://cursor.com/install -fsS | bash`)
3. Configure git identity for the bot
4. Read issue details and full conversation thread using `gh issue view`
5. Create or switch to a working branch (`cursor/issue-{number}`)
6. Run the Cursor agent with a prompt that includes:
   - The issue title, body, labels, and conversation thread
   - Instructions for three modes: **implement**, **ask for clarification**, or **continue from prior conversation**
   - A **scope guard** — only work on issues related to your product domain
7. Post a failure comment on the issue if the workflow fails

**Secrets required:**
- `CURSOR_API_KEY` — your Cursor API key, stored as a GitHub Actions secret

**Permissions required:**
- `contents: write` — to push branches
- `pull-requests: write` — to create PRs
- `issues: write` — to comment on issues

### Setting up the secret

```bash
gh secret set CURSOR_API_KEY --repo OWNER/REPO --body "your-api-key"
```

---

## Step 2: Create Issue Labels

Create labels so the agent (and your team) can categorize issues by type. At minimum:

```bash
gh label create feature --description "New feature or enhancement" --color 0E8A16 --repo OWNER/REPO
gh label create bug --description "Something is broken" --color D73A4A --repo OWNER/REPO
gh label create deployment --description "Infrastructure, CI/CD, or release task" --color 1D76DB --repo OWNER/REPO
```

Adapt labels to your domain — e.g. an ERP system might add `finance`, `hr`, `procurement`.

---

## Step 3: Create the CLAUDE.md (Project Guidelines)

Create a `CLAUDE.md` at the repo root. This is the project-level context file that the Cursor Agent reads before doing any work. It should contain:

1. **Project overview** — what the system is, in one line
2. **Architecture guidelines** — e.g. DDD, hexagonal, microservices, monolith
3. **Domain structure** — your bounded contexts or modules
4. **Tactical patterns** — which DDD patterns to use (entities, value objects, aggregates, domain events, repositories, etc.)
5. **Key rules** — non-negotiable constraints (e.g. "domain layer has zero external dependencies")
6. **Project structure** — how to organize code (by context, not by technical layer)
7. **Tech stack** — if decided; otherwise mark as TBD

### Adapting for Different Domains

For an **ERP system**, the bounded contexts might be:
- Financial Accounting, Accounts Payable/Receivable
- Human Resources, Payroll
- Procurement, Vendor Management
- Inventory, Warehouse Management
- Sales, Customer Management
- Manufacturing, Production Planning

For a **CRM**, they might be:
- Contacts, Leads, Opportunities
- Sales Pipeline, Forecasting
- Campaigns, Marketing Automation
- Support Tickets, Knowledge Base

The architecture patterns (DDD, project structure, key rules) stay the same regardless of domain.

---

## Step 4: Create a Cursor Skill for Issue Creation

Create `.cursor/skills/create-issue/SKILL.md` — a skill file that teaches the Cursor IDE agent how to create well-structured issues for your project.

The skill should define:

1. **Which GitHub repo** to create issues in (owner/repo)
2. **Label mapping** — how to classify issues (feature, bug, deployment, etc.)
3. **Issue body template** — a consistent format with Summary, Details, and Scope sections
4. **Scope guard** — what's in scope for your product, so off-topic requests are rejected
5. **Post-creation guidance** — tell the user the agent will pick it up automatically

### Usage

Once the skill is in place, you can just tell the IDE agent things like:
- "Create an issue to add invoice generation"
- "File a bug — the purchase order total doesn't include tax"
- "We need to deploy the staging environment"

And it will create a properly structured, labeled issue in GitHub.

---

## Step 5: Create a README

Write a `README.md` that explains to your team:

1. **How to use the system** — file issues, wait for the agent, review PRs
2. **The clarification flow** — if the agent needs more info, it comments on the issue; reply and it continues
3. **How it works under the hood** — workflow triggers, branching, failure handling

Keep it focused on usage, not setup (setup is a one-time thing done by the repo owner).

---

## Step 6: Commit and Push

Commit everything and push to `main`:

```
.github/workflows/cursor-agent.yml   # CI workflow
.cursor/skills/create-issue/SKILL.md # IDE skill for issue creation
CLAUDE.md                             # Project guidelines for the agent
README.md                             # Team usage docs
```

The push itself won't trigger the workflow — it only runs on issues and comments.

---

## Verification Checklist

- [ ] `CURSOR_API_KEY` secret is set in GitHub repo settings
- [ ] Labels exist in the repo (feature, bug, deployment)
- [ ] Workflow file is on the default branch (`main`)
- [ ] `CLAUDE.md` has your domain's bounded contexts and architecture guidelines
- [ ] Cursor skill is in `.cursor/skills/` and references the correct repo
- [ ] Create a test issue to verify the end-to-end flow

---

## Customization Tips

| What | How |
|------|-----|
| Add a label gate | Add `if: contains(github.event.issue.labels.*.name, 'your-label')` to the workflow job |
| Restrict agent autonomy | Split the workflow: agent only modifies files, a separate step handles git/PR creation |
| Add permissions config | Create a `.cursor/permissions.json` to limit what the agent can read/write/execute |
| Support multiple repos | Each repo gets its own workflow + CLAUDE.md; the skill can be made personal (`~/.cursor/skills/`) to work across all projects |
| Change the model | Add `--model <model-name>` to the `agent` command in the workflow |
