![Logo](https://i.ibb.co/qMbHPKtY/disco-1.png)

<div align="center">

![Discord](https://img.shields.io/discord/1188398653530984539?logo=discord&logoColor=%23fff&logoSize=auto&label=Discord&labelColor=%23505050&color=%235E6AE9&link=https%3A%2F%2Fdiscord.gg%2Fethical-programmer-s-1188398653530984539) 
![NPM Version](https://img.shields.io/npm/v/create-discobase?logo=npm&label=npm&labelColor=%235C5C5C&color=%23F58142) 
![NPM License](https://img.shields.io/npm/l/create-discobase) 
![NPM Downloads](https://img.shields.io/npm/dw/create-discobase)

</div>

# discoBase

**Introducing discoBase v2.5** — the ultimate solution for building and managing your Discord bots with **maximum flexibility** and **next-level control**. 🔥

No bloat, no limits — only what **you** choose to run. Whether you need a simple moderation bot or a complex multi-purpose system, **discoBase** adapts to your style.

> ✨ Fully compatible with the latest Discord.js v14.<br>
> 🌐 **Official Website & Docs:** [https://www.discobase.site](https://www.discobase.site) 

---

## ✨ What’s New in v2.5?

- ✅ **Advanced Dashboard** — Control your bot through a clean, modern web dashboard.
- ✅ **100% Customization** — Enable or disable any feature with just a click.
- ✅ **Plug & Play** — Clean structure, easy setup, no headaches.
- ✅ **Powerful & Optimized** — Faster, more stable, and scalable for any server size.
- ✅ **New Command Options** — `disabled` and `requiredRoles` for more control.
- ✅ **Flexible Config** — Easily toggle `errorLogging` and manage `presence` directly from your config file.
- ✅ **And much more…**

---

## 📸 Dashboard Preview

Below is a sneak peek at the new **Discobase Dashboard**:

| ![Dashboard](https://i.ibb.co/WWCQwB6f/screencapture-localhost-3000-2025-07-30-19-16-26.png) | ![Dashboard](https://i.ibb.co/4nTrCQgg/screencapture-localhost-3000-2025-07-30-19-16-41.png) |
|:--:|:--:|
| *Main Stats View* | *Guild Manager & Much More* |

---

## ⚡ Features

- 🎉 Slash & Prefix Command Handler
- 📅 Event Handler
- ⚙️ Advanced Customization Options
- 🔄 Dynamic Reloading
- 🚀 Asynchronous & Modular
- 🛠️ Structured & Scalable
- 🔒 Never Crash — built-in error logging & graceful fallback
- 🔤 Prefix Commands Support
- ➗ Slash Commands Support
- 🔍 Auto Detect Missing Intents
- ⚙️ **Configurable Functions**: `once`, `interval`, `retryAttempts`, `maxExecution`, `initializer`
- 🗂️ **Error Logging**: Enable or disable with a single `discobase.json` flag.
- 🎮 **Presence Manager**: Easily control your bot's status, activity, and type through `discobase.json`.
- 📊 **Discobase Dashboard**: Live stats, activities, & easy settings.
- ⚡ **Generate Command**: `npm run generate` instantly scaffolds new commands/events!
- 💻 **Manage Command**: `npm run manage` Enable or disable slash or prefix commands/events!

---


## 📦 Installation

Create a new **discoBase** project in seconds:

```bash
npx create-discobase@latest my-project
```

Or create in the current directory:

```bash
npx create-discobase@latest
```

---

## ⚙️ Configuration

Your `config.json` must have these keys:

| Parameter                           | Type     | Description                                               |
|--------------------------------------|----------|-----------------------------------------------------------|
| `bot.token`                         | string   | **Required.** Your Discord bot token                      |
| `bot.id`                            | string   | **Required.** Your Discord bot ID                         |
| `bot.admins`                        | array    | Optional. List of admin user IDs                          |
| `bot.ownerId`                       | string   | Optional. The owner's user ID                             |
| `bot.developerCommandsServerIds`     | array    | Optional. Server IDs where dev-only commands run           |
| `database.mongodbUrl`               | string   | Optional. MongoDB connection URL                          |
| `logging.guildJoinLogsId`           | string   | Optional. Channel ID for guild join logs                  |
| `logging.guildLeaveLogsId`          | string   | Optional. Channel ID for guild leave logs                 |
| `logging.commandLogsChannelId`      | string   | Optional. Channel ID for command logs                     |
| `logging.errorLogs`                 | string   | Optional. Webhook URL for error logging                   |
| `prefix.value`                      | string   | Optional. Prefix for non-slash commands                   |

---

## 🧩 Command Options

Use these powerful options in any command file:

| Option            | Type      | Description                                                                 |
|-------------------|-----------|-----------------------------------------------------------------------------|
| `ownerOnly`       | boolean   | If true, only the bot owner can use the command.                            |
| `adminOnly`       | boolean   | If true, only users in `bot.admins` can use it.                             |
| `devOnly`         | boolean   | If true, runs only in servers listed under `developerCommandsServerIds`.     |
| `botPermissions`  | array     | List of required bot permissions (e.g. `'SendMessages'`, `'ManageChannels'`).|
| `userPermissions` | array     | List of required user permissions (e.g. `'Administrator'`, `'KickMembers'`). |
| `cooldown`        | number    | Cooldown in seconds before reuse (default: 3).                              |
| `disabled`        | boolean   | **New in 2.5** — Easily disable buggy or incomplete commands.                |
| `requiredRoles`   | array     | **New in 2.5** — Array of server role IDs required to run this command.      |

---

## 🔧 Function Options

| Property        | Type      | Description                                         |
|-----------------|-----------|-----------------------------------------------------|
| `once`          | boolean   | Run once then stop.                                 |
| `interval`      | number    | Time (ms) between repeated executions.              |
| `retryAttempts` | number    | Number of retries if the function fails.            |
| `maxExecution`  | number    | Maximum number of executions allowed.               |
| `initializer`   | number    | Initial value/state for setup or counting.          |

**Example:**

```js
const exampleFunction = async () => {
  console.log("Function ran successfully!");
};

exampleFunction.config = {
  once: true,
  interval: 10000,
  retryAttempts: 3,
  maxExecution: 5,
  initializer: 0
};

module.exports = exampleFunction;
```

## 🔍 Activity Tracker

Track all file changes in your project in real-time — additions, edits, deletions, and renames — directly in your terminal.

The **Activity Tracker** is fully configurable through `discobase.json`.

| Property                    | Type    | Description                                                                        |
|-----------------------------|---------|------------------------------------------------------------------------------------|
| `activityTracker.enabled`   | boolean | Enable or disable the tracker globally.                                            |
| `activityTracker.ignoredPaths` | array  | Glob patterns of paths to ignore. Merges with default ignored paths automatically. |

**Example `discobase.json`:**

```json
{
  "activityTracker": {
    "enabled": true,
    "ignoredPaths": [
      "**/logs/**",
      "**/private/**"
    ]
  }
}
```

---

## ✨ Generate with Ease

Create commands & events instantly:

```bash
npm run generate
```

### 🛠️ New: Discord.js Builder Support

When generating commands, you can now select which Discord.js builders to include:
- **EmbedBuilder** - Create rich embedded messages
- **ButtonBuilder & ActionRowBuilder** - Add interactive buttons
- **StringSelectMenuBuilder** - Create dropdown menus
- **ModalBuilder & TextInputBuilder** - Show input forms

The CLI will automatically generate the appropriate imports and example code!

---

## 📊 Manage Commands & Events

Use the new management CLI to edit, pause, or delete commands and events:

```bash
npm run manage
```

**Features:**
- 📋 Browse commands and events in a tree view
- ✏️ Edit files directly in your preferred editor
- ⏸️ Pause/Resume commands without deleting them
- 🗑️ Delete commands and events with confirmation
- 📁 Organized by categories for easy navigation

---

## 🤝 Contributing

We love contributions!  
Check `contributing.md` for guidelines & submit your ideas.

---

## ⭐ Show Your Support

If this project helped you, please consider leaving a ⭐️ [star](https://github.com/ethical-programmer/create-discobase)!


<a href="https://www.patreon.com/EthicalProgrammer">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

---

## 💬 Feedback & Support

Got feedback or questions?  
Join our [Discord Community](https://discord.gg/ethical-programmer-s-1188398653530984539).

🔥 Enjoy building with discoBase 2.5 — your bot, your rules.

---

