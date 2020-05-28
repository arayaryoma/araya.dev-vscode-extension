import * as vc from "vscode";

const commands = {
  NewPlayground: "extension.araya.dev.newplayground",
} as const;

export function activate(ctx: vc.ExtensionContext) {
  console.log("araya.dev extension is now activated");

  const newPlayground = vc.commands.registerCommand(
    commands.NewPlayground,
    async () => {
      const input = await vc.window.showInputBox({ prompt: "playground name" });
      vc.window.showInformationMessage(`New Playground: ${input}`);
      const wsFolders = vc.workspace.workspaceFolders;
      const pgDir = wsFolders?.find((f) => f.name === "playground.araya.dev");
      if (pgDir) {
      } else if(wsFolders?.[0].uri){
        vc.workspace.fs.readDirectory(wsFolders[0].uri)
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
