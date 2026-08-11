import fs from "node:fs";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";

const DIR = "/private/tmp/claude-501/-Users-aaronschlacht-leap/fc834ccb-93b6-47fa-82e8-8b95d0a96c38/scratchpad";
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read("/Users/aaronschlacht/leap/art/macintosh_noadds.glb");
const root = doc.getRoot();
const buffer = root.listBuffers()[0];
const scene = root.getDefaultScene() ?? root.listScenes()[0];

// Interior back board's front face sits at world z ≈ -0.511 (plane z -0.113
// local + node z -0.398). Cards float 6mm proud of it to avoid z-fighting.
const BOARD_Z = -0.505;

function addCard(name, pngPath, w, h, tx, ty) {
  const tex = doc
    .createTexture(name)
    .setImage(fs.readFileSync(pngPath))
    .setMimeType("image/png");
  const mat = doc
    .createMaterial(name)
    .setBaseColorTexture(tex)
    .setRoughnessFactor(0.9)
    .setMetallicFactor(0)
    .setAlphaMode("BLEND")
    .setDoubleSided(true);

  const hw = w / 2, hh = h / 2;
  const pos = doc.createAccessor().setType("VEC3").setBuffer(buffer)
    .setArray(new Float32Array([-hw, -hh, 0, hw, -hh, 0, hw, hh, 0, -hw, hh, 0]));
  const uv = doc.createAccessor().setType("VEC2").setBuffer(buffer)
    .setArray(new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]));
  const nrm = doc.createAccessor().setType("VEC3").setBuffer(buffer)
    .setArray(new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]));
  const idx = doc.createAccessor().setType("SCALAR").setBuffer(buffer)
    .setArray(new Uint16Array([0, 1, 2, 0, 2, 3]));

  const prim = doc.createPrimitive()
    .setAttribute("POSITION", pos)
    .setAttribute("TEXCOORD_0", uv)
    .setAttribute("NORMAL", nrm)
    .setIndices(idx)
    .setMaterial(mat);
  const mesh = doc.createMesh(name).addPrimitive(prim);
  const node = doc.createNode(name).setMesh(mesh).setTranslation([tx, ty, BOARD_Z]);
  scene.addChild(node);
}

// 1984 + rainbow apple — bottom right of the frame's back board
addCard("Card 1984", `${DIR}/card-1984.png`, 0.34, 0.34 / 3, 0.653, -0.44);

// "THE PERSONAL COMPUTER" — centered under the Macintosh
addCard("Card The Personal Computer", `${DIR}/card-label.png`, 0.58, 0.58 * 240 / 2400, 0.02, -0.27);

await io.write(`${DIR}/macintosh_final.glb`, doc);
console.log("wrote macintosh_final.glb");
