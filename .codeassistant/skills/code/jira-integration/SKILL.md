---
name: jira-integration
description: "A skill for interacting with Jira: creating, viewing, updating issues, managing sprints, and more. Supports both Jira CLI and Atlassian MCP backends."
---

# Jira Assistant Skill for SourceCraft Code Assistant

## Overview
This skill enables interaction with Jira directly from the SourceCraft Code Assistant. It supports common Jira operations via Jira CLI or Atlassian MCP backend.

## Backend Detection
The skill automatically detects the available backend:
1. **Jira CLI**: Checked via `which jira`.
2. **Atlassian MCP**: Looked for `mcp__atlassian__*` tools.
3. **None**: If neither is available, guides the user to set up the required tools.

## Supported Actions

### 1. Create Issue
- **Command**: `action: create`
- **Required inputs**: Project details, issue type, summary, description.
- **Backend**: CLI or MCP.

### 2. View Issue
- **Command**: `action: view`, provide `issue_key`.
- **Output**: Full issue details (key, summary, status, assignee, description, comments).
- **Backend**: CLI (`jira issue view <KEY>`) or MCP (`mcp__atlassian__getJiraIssue`).

### 3. Update Issue
- **Command**: `action: update`, provide `issue_key`.
- **Possible updates**: Summary, description, labels, priority.
- **Backend**: CLI or MCP (`mcp__atlassian__editJiraIssue`).

### 4. Add Comment
- **Command**: `action: comment`, provide `issue_key` and `comment_text`.
- **Backend**:
  - CLI: `jira issue comment add <KEY> -b"<text>"`
  - MCP: `mcp__atlassian__addCommentToJiraIssue`

### 5. Transition Issue (Change Status)
- **Command**: `action: transition`, provide `issue_key` and `status`.
- **Important**: Always fetch available transitions first via `mcp__atlassian__getTransitionsForJiraIssue`.
- **Backend**: CLI (`jira issue move <KEY> "<status>"`) or MCP (`mcp__atlassian__transitionJiraIssue`).

### 6. Assign Issue
- **Command**: `action: assign`, provide `issue_key` and `assignee`.
- **Note**: Use account ID (not display name) for MCP. Use `jira me` for self‑assignment.
- **Backend**: CLI (`jira issue assign <KEY> <assignee>`) or MCP (`mcp__atlassian__lookupJiraAccountId` + `mcp__atlassian__editJiraIssue`).

### 7. List My Issues
- **Command**: `action: list-my-issues`.
- **Output**: List of issues assigned to the current user.
- **Backend**: CLI (`jira issue list --assignee me`) or MCP (JQL search).

### 8. Current Sprint
- **Command**: `action: current-sprint`.
- **Output**: Details of the active sprint (name, goal, issues).
- **Backend**: CLI (`jira sprint list --state active`) or MCP (search via JQL).

## Usage Examples

**Example 1: View an issue**

`action: view issue_key:PROJ-123`

**Example 2: Create an issue**

`action: create project:PROJ issue_type:Bug summary:Bug description:This is a bug fix`

**Example 3: Assign an issue**

`action: assign issue_key:PROJ-123 assignee:john.doe`

**Example 4: List my issues**

`action: list-my-issues`
