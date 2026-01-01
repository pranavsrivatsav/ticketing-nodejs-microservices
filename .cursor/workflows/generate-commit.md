# Generate Commit Message Workflow

## Purpose
Automatically generate a well-formatted commit message by analyzing git changes.

## Workflow Steps

1. **Check git status**
   ```bash
   git status
   ```

2. **Get staged changes**
   ```bash
   git diff --cached
   ```

3. **Get unstaged changes**
   ```bash
   git diff
   ```

4. **Analyze the changes** and identify:
   - Modified files and their purposes
   - New files created
   - Services affected
   - Dependencies updated
   - Features added/modified

5. **Generate commit message** with:
   - Subject line: `type(scope): brief description`
   - Body: Bullet points for each significant change

6. **Create the commit** using:
   ```bash
   git cm "subject" "body line 1" "body line 2" ...
   ```

## Example Prompt
"Generate a brief commit message with up to the point body"

## Output Format
```
feat: implement payment verification and order completion flow

- Add payment verification endpoint with Razorpay integration
- Implement PaymentSuccess and OrderCompleted event publishers/listeners
- Add internal API key authentication for service-to-service calls
- Update verifyTokenMiddleware to support header-based JWT tokens
...
```

