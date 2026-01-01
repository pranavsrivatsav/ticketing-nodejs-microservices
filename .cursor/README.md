# Cursor Workflows & Automation

This directory contains reusable workflows and prompts that you can use with Cursor's AI to automate common development tasks.

## 🎯 What Are These?

These are **documented workflows** that Cursor's AI can read and follow. Think of them as "recipes" for common tasks that you can reuse.

## 📁 Structure

```
.cursor/
├── workflows/          # Reusable workflow documentation
│   ├── generate-commit.md
│   └── README.md
├── prompts/            # Reusable prompt templates
│   └── commit-message.txt
├── QUICK_REFERENCE.md  # Quick usage guide
└── README.md          # This file
```

## 🚀 How It Works

Cursor's AI can:
1. **Read files** in your workspace
2. **Follow documented steps** in workflow files
3. **Execute commands** based on those steps
4. **Remember context** from `.cursorrules`

So when you create a workflow file, you're essentially creating a "script" that Cursor can execute.

## 💡 Usage Examples

### Example 1: Generate Commit Message
```
You: "Generate a brief commit message with up to the point body"
Cursor: [Reads workflow → Executes steps → Generates commit]
```

### Example 2: Reference Workflow File
```
You: "Follow the workflow in .cursor/workflows/generate-commit.md"
Cursor: [Reads file → Follows steps]
```

### Example 3: Use Prompt Template
```
You: "Use the prompt from .cursor/prompts/commit-message.txt"
Cursor: [Reads prompt → Executes it]
```

## ✨ Creating New Workflows

### Step 1: Create Workflow File
Create a new `.md` file in `.cursor/workflows/`:

```markdown
# My Custom Workflow

## Purpose
What this workflow does

## Steps
1. Step one
2. Step two
3. Step three

## Example Prompt
"Your example prompt here"
```

### Step 2: Document the Steps
Be specific about:
- What commands to run
- What to check/analyze
- What output to generate

### Step 3: Use It
Ask Cursor: "Follow the workflow in `.cursor/workflows/my-workflow.md`"

## 🎨 Best Practices

1. **Be Specific**: Document exact steps and commands
2. **Include Examples**: Show example prompts and expected output
3. **Keep It Focused**: One workflow = one task
4. **Update README**: Add new workflows to the README

## 📝 Available Workflows

- **Generate Commit Message** - Auto-generate conventional commit messages
  - Location: `.cursor/workflows/generate-commit.md`
  - Prompt: "Generate a brief commit message with up to the point body"

## 🔗 Related Files

- `.cursorrules` - Project-wide rules and context for Cursor
- `scripts/` - Executable scripts (bash/PowerShell)
- `.cursor/workflows/` - Documented workflows
- `.cursor/prompts/` - Reusable prompt templates

## 🤔 How Is This Different From Scripts?

- **Scripts** (`scripts/`): Executable code that runs directly
- **Workflows** (`.cursor/workflows/`): Documentation that Cursor reads and follows
- **Prompts** (`.cursor/prompts/`): Reusable prompt templates

Workflows are more flexible because Cursor can adapt them based on context, while scripts are fixed.

