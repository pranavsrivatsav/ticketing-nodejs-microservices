# Cursor Workflows

This directory contains reusable workflows and prompts for common development tasks.

## Available Workflows

### 1. Generate Commit Message
**File:** `generate-commit.md`

**Usage:** Ask Cursor: "Generate a brief commit message with up to the point body"

**What it does:**
- Analyzes git status and diffs
- Generates conventional commit message
- Creates the commit automatically

### 2. Adding New Workflows

To create a new workflow:

1. Create a markdown file in `.cursor/workflows/`
2. Document the workflow steps
3. Include example prompts
4. Reference it in this README

## How to Use Workflows in Cursor

### Option 1: Direct Prompt
Simply ask Cursor to follow a workflow:
- "Follow the generate commit message workflow"
- "Use the generate commit workflow"

### Option 2: Reference the File
- "Read `.cursor/workflows/generate-commit.md` and follow it"

### Option 3: Composer Mode
1. Open Cursor Composer (Cmd/Ctrl + I)
2. Reference the workflow file
3. Ask Cursor to execute it

## Creating Custom Workflows

Workflows are just markdown files that document:
- Purpose
- Steps to follow
- Example prompts
- Expected output

Cursor's AI can read these files and follow the documented workflow.

