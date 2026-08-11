"""Render the assembly animation: parts fly into the lit gallery box.
Same scene as blender_still.py, keyframed, output H.264."""
import bpy
import math
import sys

DIR = "/private/tmp/claude-501/-Users-aaronschlacht-leap/fc834ccb-93b6-47fa-82e8-8b95d0a96c38/scratchpad"
FAST = "--fast" in sys.argv
FRAME_TEST = None
for a in sys.argv:
    if a.startswith("--frame="):
        FRAME_TEST = int(a.split("=")[1])

# ---- scene setup (identical look to the still) ----
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
bpy.ops.import_scene.gltf(filepath=f"{DIR}/macintosh_scene.glb")
objs = {o.name: o for o in bpy.data.objects}

for name, o in objs.items():
    if name.startswith("Plane"):
        o.hide_render = True
for name in ("Card 1984", "Card The Personal Computer"):
    if name in objs:
        objs[name].visible_shadow = False

frame_obj = objs.get("mesh_node")
white = bpy.data.materials.new("GalleryWhite")
white.use_nodes = True
bsdf = white.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (1.0, 1.0, 1.0, 1.0)
bsdf.inputs["Roughness"].default_value = 0.4
if frame_obj is not None:
    if frame_obj.data.materials:
        frame_obj.data.materials[0] = white
    else:
        frame_obj.data.materials.append(white)

card_mats = []
for mat in bpy.data.materials:
    n = mat.name
    if n.startswith("beige 2") and mat.use_nodes:
        b = mat.node_tree.nodes["Principled BSDF"]
        b.inputs["Base Color"].default_value = (0.75, 0.67, 0.52, 1.0)
        b.inputs["Roughness"].default_value = 0.45
    if n.startswith("Screen") and mat.use_nodes:
        b = mat.node_tree.nodes["Principled BSDF"]
        b.inputs["Roughness"].default_value = 0.4
        if "Emission Strength" in b.inputs:
            b.inputs["Emission Strength"].default_value = 1.5
    if n.startswith("Card ") and mat.use_nodes:
        card_mats.append(mat)

world = bpy.data.worlds.new("White")
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs[0].default_value = (1.0, 1.0, 1.0, 1.0)
bg.inputs[1].default_value = 0.3
scene.world = world

bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0.725, 0))
wall = bpy.context.active_object
wall.scale = (7.0, 4.5, 1.0)
wall.rotation_euler = (math.radians(90), 0, 0)
wall_mat = bpy.data.materials.new("Wall")
wall_mat.use_nodes = True
wb = wall_mat.node_tree.nodes["Principled BSDF"]
wb.inputs["Base Color"].default_value = (0.965, 0.96, 0.95, 1.0)
wb.inputs["Roughness"].default_value = 0.9
wall.data.materials.append(wall_mat)

def area(name, loc, rot, size_x, size_y, power, color=(1.0, 0.97, 0.93)):
    light = bpy.data.lights.new(name, type="AREA")
    light.shape = "RECTANGLE"
    light.size = size_x
    light.size_y = size_y
    light.energy = power
    light.color = color
    ob = bpy.data.objects.new(name, light)
    ob.location = loc
    ob.rotation_euler = rot
    bpy.context.collection.objects.link(ob)
    return ob

for i, x in enumerate([-0.55, -0.185, 0.185, 0.55]):
    area(f"LED{i}", (x, 0.36, 0.545), (math.radians(-58), 0, 0), 0.2, 0.035, 3.2)
area("Softbox", (-0.9, -3.2, 1.5), (math.radians(55), 0, math.radians(-16)), 3.5, 2.5, 130.0, (1.0, 0.985, 0.96))

cam_data = bpy.data.cameras.new("Cam")
cam_data.lens = 40
cam_data.sensor_width = 36
cam = bpy.data.objects.new("Cam", cam_data)
bpy.context.collection.objects.link(cam)
scene.camera = cam
cam.location = (0.3, -2.3, 0.1)
aim = bpy.data.objects.new("Aim", None)
aim.location = (0.0, 0.4, 0.0)
bpy.context.collection.objects.link(aim)
track = cam.constraints.new(type="TRACK_TO")
track.target = aim
track.track_axis = "TRACK_NEGATIVE_Z"
track.up_axis = "UP_Y"
screen_obj = objs.get("Screen.001") or objs.get("Screen_001")
cam_data.dof.use_dof = True
if screen_obj is not None:
    cam_data.dof.focus_object = screen_obj
cam_data.dof.aperture_fstop = 4.0

# ---- choreography (30 fps) ----
def ease_all(obj):
    if not (obj.animation_data and obj.animation_data.action):
        return
    action = obj.animation_data.action
    for layer in action.layers:
        for strip in layer.strips:
            for bag in strip.channelbags:
                for fc in bag.fcurves:
                    if fc.data_path == "location":
                        for kp in fc.keyframe_points:
                            kp.interpolation = "QUART"
                            kp.easing = "EASE_OUT"

def fly(names, delta, f_start, f_end):
    for name in names:
        obj = objs.get(name) or objs.get(name.replace(" ", "_"))
        if obj is None:
            print("MISSING", name)
            continue
        base = obj.location.copy()
        obj.hide_render = True
        obj.keyframe_insert("hide_render", frame=1)
        obj.hide_render = False
        obj.keyframe_insert("hide_render", frame=f_start)
        obj.location = (base.x + delta[0], base.y + delta[1], base.z + delta[2])
        obj.keyframe_insert("location", frame=f_start)
        obj.location = base
        obj.keyframe_insert("location", frame=f_end)
        ease_all(obj)

# deltas in glTF-style parent-local axes (x, y-up, z-toward-viewer)
fly(["Main case", "Logo", "Screen.001"], (0, 0.12, 0.55), 57, 90)
fly(["Keyboard", "keyboard Cable"], (0, -0.32, 0.38), 69, 99)
fly(["Mouse", "Mouse cable"], (0.5, -0.08, 0.22), 75, 102)
fly(["Floppy disk"], (0.22, 0.05, 0.5), 81, 108)

# labels fade in (printed on the board). The importer links the texture's
# alpha straight into the Alpha socket, so inject a multiply between them
# and animate the factor.
def fade(mat, f_start, f_end):
    tree = mat.node_tree
    b = tree.nodes["Principled BSDF"]
    alpha_in = b.inputs["Alpha"]
    mult = tree.nodes.new("ShaderNodeMath")
    mult.operation = "MULTIPLY"
    if alpha_in.links:
        src = alpha_in.links[0].from_socket
        tree.links.remove(alpha_in.links[0])
        tree.links.new(src, mult.inputs[0])
    else:
        mult.inputs[0].default_value = 1.0
    tree.links.new(mult.outputs[0], alpha_in)
    factor = mult.inputs[1]
    factor.default_value = 0.0
    factor.keyframe_insert("default_value", frame=f_start)
    factor.default_value = 1.0
    factor.keyframe_insert("default_value", frame=f_end)

for mat in card_mats:
    if "Personal" in mat.name:
        fade(mat, 108, 132)
    else:
        fade(mat, 116, 140)

# ---- render ----
scene.render.engine = "BLENDER_EEVEE"
scene.render.fps = 30
scene.frame_start = 1
scene.frame_end = 180
scene.eevee.taa_render_samples = 8 if FAST else 24
scene.render.resolution_x = 960 if FAST else 1920
scene.render.resolution_y = 640 if FAST else 1280
scene.view_settings.view_transform = "Standard"

if FRAME_TEST is not None:
    scene.render.filepath = f"{DIR}/anim-frame-{FRAME_TEST}.png"
    scene.render.image_settings.file_format = "PNG"
    scene.frame_set(FRAME_TEST)
    bpy.ops.render.render(write_still=True)
    print("RENDER_DONE frame", FRAME_TEST)
else:
    scene.render.filepath = f"{DIR}/frames/"
    scene.render.image_settings.file_format = "PNG"
    bpy.ops.render.render(animation=True)
    print("RENDER_DONE anim frames")
