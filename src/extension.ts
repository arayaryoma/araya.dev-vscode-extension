import * as vc from "vscode";
import { html } from "./templates/playground";
import { TextEncoder } from "util";

const commands = {
  NewPlayground: "extension.araya.dev.newplayground",
} as const;

const createNewPlayground = async (playgroundDir: vc.Uri, name: string) => {
  await vc.workspace.fs.createDirectory(vc.Uri.joinPath(playgroundDir, name));
  await vc.workspace.fs.writeFile(
    vc.Uri.joinPath(playgroundDir, name, "index.html"),
    new TextEncoder().encode(html(name))
  );
  await vc.workspace.fs.writeFile(
    vc.Uri.joinPath(playgroundDir, name, "style.css"),
    new Uint8Array()
  );
  await vc.workspace.fs.writeFile(
    vc.Uri.joinPath(playgroundDir, name, "main.js"),
    new Uint8Array()
  );
};

export function activate(ctx: vc.ExtensionContext) {
  const newPlayground = vc.commands.registerCommand(
    commands.NewPlayground,
    async () => {
      const input = await vc.window.showInputBox({ prompt: "playground name" });
      if (!input) throw "please input a new playground name";
      const wsFolders = vc.workspace.workspaceFolders;
      const rootPlaygroundDir = wsFolders?.find(
        (f) => f.name === "playground.araya.dev"
      );
      if (rootPlaygroundDir) {
        await createNewPlayground(rootPlaygroundDir.uri, input);
      } else if (wsFolders?.[0].uri) {
        const dirents = await vc.workspace.fs.readDirectory(wsFolders[0].uri);
        const playgroundDir = dirents.find(
          (dr) => dr[0] === "playground.araya.dev"
        );
        if (!playgroundDir) throw "playground.araya.dev is not found";
        await createNewPlayground(
          vc.Uri.file(`${wsFolders[0].uri.path}/${playgroundDir[0]}`),
          input
        );
      }
    }
  );
  ctx.subscriptions.push(newPlayground);
}

export function deactivate() {
}
