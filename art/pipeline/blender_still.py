"""Render the framed Macintosh per the reference spec: white gallery box,
soft area lighting, ~40mm slight-angle camera with DOF, EEVEE."""
import bpy
import math
import sys

DIR = "/private/tmp/claude-501/-Users-aaronschlacht-leap/fc834ccb-93b6-47fa-82e8-8b95d0a96c38/scratchpad"
OUT = f"{DIR}/render-still.png"
FAST = "--fast" in sys.argv

# ---- clean scene ----
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# ---- import ----
bpy.ops.import_scene.gltf(filepath=f"{DIR}/macintosh_scene.glb")

objs = {o.name: o for o in bpy.data.objects}

# hide the glass — the target shows no visible pane
for name, o in objs.items():
    if name.startswith("Plane"):
        o.hide_render = True

# labels print flat on the board — never cast shadows
for name in ("Card 1984", "Card The Personal Computer"):
    if name in objs:
        objs[name].visible_shadow = False

# ---- materials ----
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

for mat in bpy.data.materials:
    n = mat.name
    if n.startswith("beige 2"):
        if mat.use_nodes and "Principled BSDF" in mat.node_tree.nodes:
            b = mat.node_tree.nodes["Principled BSDF"]
            b.inputs["Base Color"].default_value = (0.75, 0.67, 0.52, 1.0)
            b.inputs["Roughness"].default_value = 0.45
    if n.startswith("Screen"):
        if mat.use_nodes and "Principled BSDF" in mat.node_tree.nodes:
            b = mat.node_tree.nodes["Principled BSDF"]
            b.inputs["Roughness"].default_value = 0.4
            if "Emission Strength" in b.inputs:
                b.inputs["Emission Strength"].default_value = 1.5

# ---- world: pure white ----
world = bpy.data.worlds.new("White")
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs[0].default_value = (1.0, 1.0, 1.0, 1.0)
bg.inputs[1].default_value = 0.3
scene.world = world

# ---- wall behind the box: catches the frame's soft cast shadow ----
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

# ---- lights ----
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

# interior LED strip: tight warm strips high in the box, steep tilt so
# the pools scallop the top of the back board
for i, x in enumerate([-0.55, -0.185, 0.185, 0.55]):
    area(
        f"LED{i}",
        (x, 0.36, 0.545),
        (math.radians(-58), 0.0, 0.0),
        0.2, 0.035, 3.2,
        color=(1.0, 0.97, 0.93),
    )

# room softbox: large, front-left-above — soft exterior modelling and a
# gentle gradient on the surrounding wall
area(
    "Softbox",
    (-0.9, -3.2, 1.5),
    (math.radians(55), 0.0, math.radians(-16)),
    3.5, 2.5, 130.0, color=(1.0, 0.985, 0.96),
)

# ---- camera: ~40mm, slight angle from the right, DOF on the screen ----
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
else:
    cam_data.dof.focus_distance = 2.3
cam_data.dof.aperture_fstop = 4.0

# ---- render settings: EEVEE per spec ----
scene.render.engine = "BLENDER_EEVEE"
scene.eevee.taa_render_samples = 16 if FAST else 64
scene.render.resolution_x = 1200 if FAST else 2400
scene.render.resolution_y = 800 if FAST else 1600
scene.render.filepath = OUT
scene.render.image_settings.file_format = "PNG"
scene.view_settings.view_transform = "Standard"
scene.view_settings.exposure = 0.0
scene.view_settings.gamma = 1.0

bpy.ops.render.render(write_still=True)
print("RENDER_DONE", OUT)
