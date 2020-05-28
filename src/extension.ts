import * as vc from "vscode";

const commands = {
  NewPlayground: "extension.araya.dev.newplayground",
} as const;

const createNewPlayground = async (playgroundDir: vc.Uri, name: string) => {
  await vc.workspace.fs.createDirectory(vc.Uri.joinPath(playgroundDir, name));
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
      // vscode.window
      //   .showInputBox({ prompt: "playground name" })
      //   .then((input) => {
      //     vscode.window.showInformationMessage(`New Playground: ${input}`);
      //     console.log(vscode.workspace.workspaceFolders);
      //   });
    }
  );
  ctx.subscriptions.push(newPlayground);
}

export function deactivate() {
  console.log("araya.dev extension is now deactivated");
}
