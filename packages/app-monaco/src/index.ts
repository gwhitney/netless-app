import styles from "./style.scss?inline";

import type { NetlessApp } from "@netless/window-manager";
import { Doc } from "yjs";
import { MonacoBinding } from "y-monaco";
import { editor as monacoEditor } from "monaco-editor";
import type { NetlessAppMonacoAttributes } from "./typings";
import { NetlessAppAttributesProvider } from "./y-app-attributes";

export type { NetlessAppMonacoAttributes } from "./typings";

const NetlessAppMonaco: NetlessApp<NetlessAppMonacoAttributes> = {
  kind: "Monaco",
  setup(context) {
    const box = context.getBox();

    box.mountStyles(styles);

    const yDoc = new Doc();
    const provider = new NetlessAppAttributesProvider(context, yDoc);

    const editor = monacoEditor.create(box.$content as HTMLElement, {
      value: "",
      automaticLayout: true,
    });

    const monacoBinding = new MonacoBinding(
      provider.yText,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );

    context.emitter.on("destroy", () => {
      provider.destroy();
      monacoBinding.destroy();
    });
  },
};

export default NetlessAppMonaco;