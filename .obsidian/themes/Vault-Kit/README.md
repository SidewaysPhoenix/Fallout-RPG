# Vault-Kit — Field Terminal

A personal Obsidian theme for your Fallout 2d20 vault. Version 1.0.0.

Navy panels, gold headings, blue links, and a readable campaign notebook. Light mode uses a warm paper palette. All fonts are local system fallbacks; nothing is downloaded.

## Install

1. Extract this ZIP.
2. Copy the entire `Vault-Kit` folder into your vault's `.obsidian/themes/` folder. The result must be `.obsidian/themes/Vault-Kit/theme.css` and `.obsidian/themes/Vault-Kit/manifest.json` (avoid a second nested Vault-Kit folder).
3. If `.obsidian` is hidden, enable hidden items in your file manager. Create the `themes` folder if it does not exist.
4. Open **Settings → Appearance**, then select **Vault-Kit** from the theme dropdown. Restart Obsidian if it does not appear.
5. Open **Settings → Style Settings → Vault-Kit — Field Terminal** to customize it. The theme works without Style Settings using the defaults.
6. Turn on Obsidian's **Readable line length** if you want the note width slider to control the reading width.

Change Obsidian's base color scheme in Appearance to switch between dark and light mode. Each mode has its own color pickers.

## Suggested first setup

Start in dark mode with the default colors. Turn on Terminal headings and Striped note tables. Leave Terminal note text, Heading glow, and Scanlines off until you have tried reading a long note.

You can make a green terminal variant by changing the dark accent to `#a7d98b` and links to `#9fcfb0`. For an amber terminal, try accent `#efb95b` and links `#d9c59b`. These are suggestions, not extra preset controls.

## What is included

- Palette controls for eight colors, independently for dark and light mode.
- Note width, text size, line spacing, panel radius, and H1–H3 size controls.
- Optional terminal heading/body fonts, static scanlines, compact navigation, uppercase folders, striped tables, and heading glow.
- Styling for native headings, properties, tabs, links, tags, tables, code, checkboxes, graph colors, file explorer, menus, and callouts.
- Extra callouts: `[!quest]`, `[!location]`, `[!loot]`, and `[!radiation]`. They use Obsidian's native callout system, including collapse syntax.

Copy `Sample Note.md` into any normal folder in your vault to see the callouts and tables. It does not need to remain inside the theme folder.

## Existing character sheet and statblocks

Keep your current character sheet and Fantasy Statblocks component CSS snippets enabled. This theme does not add rules for `#fallout-sheet-root` or `.statblock`, change statblock columns, hide rows, or alter dice and sheet logic. Native text variables may still be inherited by plugins; your existing component rules can override them.

If an older snippet styles the entire vault, it can override the theme. Temporarily disable that broad styling snippet while comparing. Existing Style Settings sections from a previous theme can disappear when you switch themes; this theme has its own section.

## Validation and limits

The package has been checked for valid JSON/YAML, matching Style Settings controls and CSS definitions, and CSS syntax. A visual browser check could not run in this environment. This is a first version: it has not been run inside your actual Obsidian vault or against your full plugin collection. Send a screenshot of any awkward view and we can refine it.

## Revert

Select your previous theme in Appearance. The theme makes no changes to note contents, plugins, or character data. Delete the Vault-Kit theme folder if you no longer want it.

## References

Built around Obsidian's theme structure and Style Settings metadata:
- https://github.com/obsidianmd/obsidian-sample-theme
- https://github.com/community-archive/obsidian-style-settings
