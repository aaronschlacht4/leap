import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";

const DIR = "/private/tmp/claude-501/-Users-aaronschlacht-leap/fc834ccb-93b6-47fa-82e8-8b95d0a96c38/scratchpad";
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(`${DIR}/macintosh_final.glb`);
const root = doc.getRoot();

// Bake the display composition (matches the site's runtime adjustments):
// computer at display scale, keyboard/mouse tucked under the case,
// label under the keyboard.
for (const node of root.listNodes()) {
  const name = node.getName();
  if (name === "Apple Macintosh 1984") {
    const s = node.getScale();
    node.setScale([s[0] * 1.27, s[1] * 1.27, s[2] * 1.27]);
    const t = node.getTranslation();
    node.setTranslation([t[0], t[1] - 0.05, t[2]]);
  }
  if (["Keyboard", "keyboard Cable", "Mouse", "Mouse cable"].includes(name)) {
    const t = node.getTranslation();
    node.setTranslation([t[0], t[1] + 0.045, t[2]]);
  }
  if (name === "Card The Personal Computer") {
    const t = node.getTranslation();
    node.setTranslation([t[0], -0.245, t[2]]);
  }
}

await io.write(`${DIR}/macintosh_scene.glb`, doc);
console.log("wrote macintosh_scene.glb");
