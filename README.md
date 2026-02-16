# AI Product Development Template

A forkable template for building software products with AI-driven development and Domain-Driven Design (DDD).

**Fork this repo, run the setup wizard, and start building your product by creating GitHub issues.**

## What You Get

- **AI Setup Wizard** — an interactive AI-guided setup that configures the project for your specific product
- **CLAUDE.md** — auto-generated DDD architecture guidelines tailored to your domain
- **GitHub Actions CI** — a workflow that automatically picks up issues and implements them as pull requests
- **Cursor Skills** — AI-powered issue creation with proper structure, labels, and scope guards
- **DDD Structure** — opinionated project organization by bounded context, not by technical layer

## Quick Start

### 1. Fork this repository

Click **Fork** on GitHub (or use the "Use this template" button if available).

### 2. Set up your Cursor API key

The GitHub Actions workflow needs a Cursor API key to run the agent:

```bash
gh secret set CURSOR_API_KEY --repo YOUR-ORG/YOUR-REPO --body "your-api-key"
```

### 3. Run the setup wizard

Open the forked repo in [Cursor](https://cursor.com) and tell the AI:

> "Set up my project"

The wizard will ask you about:
- **Product name** and description
- **What your product does** — the AI will suggest bounded contexts based on your description
- **Tech stack** — defaults to Python (FastAPI) for backend and React for frontend, but you can choose others

It then generates all the configuration files customized for your product.

### 4. Start building

Once setup is complete, you build your product by **filing GitHub issues**:

1. **Open an issue** describing a feature, bug fix, or task
2. **The agent picks it up** automatically and implements the changes
3. **Review the PR** — the agent creates a pull request with the implementation
4. **Reply to questions** — if the agent needs clarification, it asks in the issue thread; reply and it continues

You can also use the Cursor skill to create issues — just tell the AI what you need and it will file a well-structured issue for you.

## Requirements

- [Cursor IDE](https://cursor.com) (for the setup wizard and local AI skills)
- [Cursor API key](https://cursor.com) (for the GitHub Actions agent)
- [GitHub CLI](https://cli.github.com) (`gh`) — for secret setup and label creation

## Learn More

See [docs/setup-guide.md](docs/setup-guide.md) for the full walkthrough, tech stack options, how the automation works, and customization tips.
