# 🧪 Local Testing Guide for New Features

## Prerequisites

1. **Discord Bot Setup**
   - Create a bot at [Discord Developer Portal](https://discord.com/developers/applications)
   - Enable these intents: `Guilds`, `GuildMembers`, `GuildMessages`, `MessageContent`
   - Invite bot to a test server

2. **Configuration**
   - Update `config.json` with your bot token and ID
   - Set your Discord user ID as `ownerId`

---

## Test 1: CLI Builder Support 🛠️

Test the new builder selection feature:

```bash
npm run generate
```

**What to test:**
1. Select "Command" type
2. Enter a test command name (e.g., "test-embed")
3. When prompted "Do you want to use Discord.js builders?", select **Yes**
4. Choose a builder (e.g., "EmbedBuilder")
5. Check the generated file in `src/commands/[category]/test-embed.js`

**Expected Result:**
- File should include appropriate imports (e.g., `const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')`)
- Commented example code should be present

---

## Test 2: Management CLI 📊

Test the command/event management interface:

```bash
npm run manage
```

**What to test:**
1. Select "Manage Commands"
2. Navigate through categories
3. Select a command (e.g., `ping`)
4. Try each action:
   - **Edit**: Should open the file in your editor
   - **Pause**: Check the file - should have `disabled: true`
   - **Resume**: Check the file - should have `disabled: false`
   - **Delete**: Cancel when prompted (don't actually delete)

**Expected Result:**
- Tree view shows all commands organized by folder
- Actions work without errors
- File modifications are correct

---

## Test 3: Bug Fixes Verification 🐛

### 3.1 Test discobase.json Path Fix

1. Enable error logging in `discobase.json`:
```json
{
  "errorLogging": {
    "enabled": true
  }
}
```

2. Create a command that throws an error
3. Run it and check if errors are logged to `/errors` folder
4. **Expected**: Errors should be logged (previously this would fail)

### 3.2 Test Gradient Import Fix

1. Start the bot: `npm start`
2. Add/modify a command file while bot is running
3. **Expected**: No "gradient is not defined" errors in console

---

## Test 4: Command Pause/Resume ⏸️

### 4.1 Via Management CLI

```bash
npm run manage
```

1. Select a command
2. Choose "Pause"
3. Try using the command in Discord
4. **Expected**: Command should show "currently disabled" message

### 4.2 Via Manual Edit

1. Open any command file
2. Add `disabled: true,` to module.exports
3. Save and try the command in Discord
4. **Expected**: Command is disabled

---

## Test 5: Bot Startup Test 🚀

### Complete Integration Test

1. **Configure everything:**
   - `config.json` with valid token
   - `discobase.json` with your preferences

2. **Start the bot:**
```bash
npm start
```

3. **Check for:**
   - ✅ No error messages during startup
   - ✅ "Bot logged in successfully!" message
   - ✅ Commands are registered
   - ✅ Bot is online in Discord

4. **Test commands:**
   - `/ping` - Should work normally
   - Disabled commands - Should show disabled message

---

## Verification Checklist ✅

After testing, verify:

- [ ] CLI generates commands with correct builder imports
- [ ] Management CLI can edit/pause/resume/delete files
- [ ] Bug fixes prevent previous errors
- [ ] Command pause/resume works
- [ ] Bot starts without errors
- [ ] All commands register successfully
- [ ] Error logging works (if enabled)
- [ ] Activity tracker shows file changes

---

## Quick Test Script

Here's a PowerShell script to run basic tests:

```powershell
# Test syntax
Write-Host "Testing syntax..." -ForegroundColor Cyan
node -c cli.js
node -c manage.js

# Test CLI (will require user input)
Write-Host "`nTesting CLI generator..." -ForegroundColor Cyan
# npm run generate  # Uncomment to test interactively

# Test Management CLI (will require user input)
Write-Host "`nTesting Management CLI..." -ForegroundColor Cyan
# npm run manage  # Uncomment to test interactively

Write-Host "`nAll syntax tests passed!" -ForegroundColor Green
Write-Host "Configure config.json and run 'npm start' to test the bot" -ForegroundColor Yellow
```

---

## Troubleshooting 🔧

### Common Issues

1. **"Invalid token" error**
   - Check your bot token in `config.json`
   - Make sure there are no extra spaces

2. **Commands not registering**
   - Verify `bot.id` is correct
   - Check bot has proper permissions
   - Wait a few seconds for global commands

3. **Management CLI not opening editor**
   - Set `EDITOR` environment variable: `$env:EDITOR = "notepad"`
   - Or it will default to notepad on Windows

---

## Need Help?

If you encounter issues:
1. Check console logs for errors
2. Verify all configuration files are valid JSON
3. Ensure all required fields in `config.json` are filled
4. Check the `/errors` folder for detailed error logs

Happy Testing! 🎉
