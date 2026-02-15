---
name: create-oms-issue
description: Create GitHub issues for the OMS repository. Use when the user wants to file an issue, report a bug, request a feature, or describe a deployment task for the Order Management System.
---

# Create OMS Issue

Create well-structured GitHub issues in the `anujkumar-df/oms-5k` repository. Issues are automatically picked up by the Cursor Agent workflow for implementation.

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

**Title:** Short, action-oriented summary (e.g. "Add order search by date range", "Fix inventory count mismatch on returns")

**Body template:**

```markdown
## Summary
[1-2 sentence description of what needs to happen and why]

## Details
[Specific requirements, acceptance criteria, or reproduction steps]

## Scope
[Which parts of the system are affected — e.g. API, database, UI, etc.]
```

For **bug** issues, replace "Details" with:

```markdown
## Steps to Reproduce
1. ...
2. ...

## Expected Behavior
[What should happen]

## Actual Behavior
[What happens instead]
```

## Creating the Issue

Use the `user-github-issue_write` tool:

- **method:** `create`
- **owner:** `anujkumar-df`
- **repo:** `oms-5k`
- **title:** The issue title
- **body:** The formatted body
- **labels:** One of `["feature"]`, `["bug"]`, or `["deployment"]`

## Scope Guard

Only create issues related to OMS product development:
- Orders, inventory, customers, products, payments, shipping, returns
- Reporting, analytics, dashboards
- APIs, database, UI/UX
- Testing, CI/CD, deployment, infrastructure
- Documentation for the OMS

If the user's request is not related to OMS development, let them know and do not create the issue.

## After Creation

After creating the issue, tell the user:
- The issue number and link
- That the Cursor Agent will automatically pick it up and start implementation
- They can track progress in the issue thread
