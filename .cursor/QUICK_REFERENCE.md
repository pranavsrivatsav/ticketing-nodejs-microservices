# Cursor Workflows Quick Reference

## How to Use Reusable Workflows in Cursor

### Method 1: Direct Prompt (Easiest)
Just ask Cursor to follow a workflow:
```
"Generate a brief commit message with up to the point body"
```

### Method 2: Reference Workflow File
```
"Read .cursor/workflows/generate-commit.md and follow the workflow"
```

### Method 3: Use Prompt File
```
"Use the prompt from .cursor/prompts/commit-message.txt"
```

### Method 4: Composer Mode
1. Press `Cmd/Ctrl + I` to open Composer
2. Type: "Follow the generate commit message workflow"
3. Cursor will read the workflow file and execute it

## Available Workflows

### Generate Commit Message
**Prompt:** "Generate a brief commit message with up to the point body"
**Location:** `.cursor/workflows/generate-commit.md`

## Creating New Workflows

1. **Create workflow file** in `.cursor/workflows/`
2. **Document the steps** in markdown
3. **Add example prompts**
4. **Update** `.cursor/workflows/README.md`

## Tips

- Workflows are just documentation - Cursor reads them and follows the steps
- You can combine workflows: "Follow generate commit workflow, then run tests"
- Use `.cursorrules` for project-wide context and guidelines
- Store reusable prompts in `.cursor/prompts/`

