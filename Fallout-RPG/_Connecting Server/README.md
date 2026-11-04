# Fallout 2D20 Vault Server

Shared server for the Obsidian vendor system and homepage Quest Terminal. Only the host needs to install and run it; players connect from Obsidian.

## Requirements

- Node.js LTS with npm installed.
- This directory containing `server.js`.

## First-time setup

Open a terminal in this directory (the folder containing `server.js`) and run:

```sh
npm install express cors
```

This installs the two external dependencies into `node_modules`. The `fs` and `path` modules are included with Node.js and need no separate installation.

If this directory already contains a `package.json` listing those dependencies, you can instead run:

```sh
npm install
```

## Start the server

From this directory, run:

```sh
node server.js
```

OR

Run:
```sh
Start Server.bat
```

Keep the terminal open while playing. Press **Ctrl+C** to stop the server. Run the same startup command each time you need it; installing dependencies is only needed on initial setup or when dependencies change.

The current server listens on **port 3000**. Its startup message still calls it the “Vault-Kit Vendor Server,” even though it also handles quests.

## Connect from Obsidian

Enter the server address in the vendor or homepage connection field, then click **Connect/Refresh**:

- On the host computer: `http://localhost:3000`
- On another computer on the same network: `http://HOST-LAN-IP:3000` (replace `HOST-LAN-IP` with the host computer’s local IP address).

Allow Node.js through the host computer’s firewall for your private network if prompted. Players do not need Node.js or a separate server installation; they use the vault’s Obsidian notes and required plugins.

## Saved data

The server creates `vendors` and `runtime` beside `server.js`. These hold vendor records, transactions, reservations, and quest data. Older installations may also have `data/vendor.json`.

Keep these folders when updating or moving the server. You can rename the containing folder because data paths are relative to `server.js`; update any external launcher that uses the old folder path.

## Git setup

Commit `package.json` and `package-lock.json` after installing dependencies so other users can run `npm install`. Do not commit `node_modules`; npm recreates it. Exclude live campaign data if you do not intend to distribute it.

## Troubleshooting

- **`node` or `npm` not recognized:** Install Node.js with npm, then reopen the terminal.
- **Cannot find module `express` or `cors`:** Run `npm install express cors` in the folder containing `server.js`.
- **Cannot find `server.js`:** Open the terminal in the correct directory and confirm the file is named `server.js`.
- **`EADDRINUSE`:** Another process is already using port 3000. Stop the previous server instance before restarting.
- **Players cannot connect:** Check the host’s LAN IP, firewall, network connection, and that the server is running. `localhost` on a player’s computer refers to that player’s computer.
