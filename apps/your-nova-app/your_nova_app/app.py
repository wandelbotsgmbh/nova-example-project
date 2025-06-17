from decouple import config
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from loguru import logger
from nova import Nova
from your_nova_app.programs.moveabit import moveabit

CELL_ID = config("CELL_ID", default="cell", cast=str)
BASE_PATH = config("BASE_PATH", default="", cast=str)
app = FastAPI(title="your_nova_app", root_path=BASE_PATH)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", summary="Opens the Stoplight UI", response_class=HTMLResponse)
async def root():
    # One could serve a nice UI here as well. For simplicity, we just redirect to the Stoplight UI.
    return f"""
    <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <title>Elements in HTML</title>
            <!-- Embed elements Elements via Web Component -->
            <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
            <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
          </head>
          <body>

            <elements-api
              apiDescriptionUrl="{BASE_PATH}/openapi.json"
              router="hash"
              layout="sidebar"
              tryItCredentialsPolicy="same-origin"
            />

          </body>
    </html>
    """


@app.get("/app_icon.png", summary="Services the app icon for the homescreen")
async def get_app_icon():
    try:
        return FileResponse(path="static/app_icon.png", media_type="image/png")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Icon not found")



@app.post(
    "/call_api",
    status_code=201,
    summary="Add your API call here",
    description="This is a placeholder for your API call.",
)
async def call_api():
    log_messages = []

    def log_info(message, *args):
        formatted_message = message.format(*args)
        logger.info(formatted_message)
        log_messages.append(formatted_message)

    nova = Nova()
    cell = nova.cell(CELL_ID)

    controllers = await cell.controllers()
    if len(controllers) == 0:
        raise HTTPException(
            status_code=400,
            detail="No controller found. Please check if the controller is connected to the cell.",
        )

    controller = controllers[0]
    motion_groups = await controller.activated_motion_groups()
    if len(motion_groups) != 1:
        raise HTTPException(
            status_code=400,
            detail="No or more than one motion group found. Example just works with one motion group. "
            "Go to settings app and create one or delete all except one.",
        )

    async with motion_groups[0] as motion_group:
        log_info("using motion group {}", motion_group.motion_group_id)

        tcps = await motion_group.tcp_names()
        log_info("TCPs: {}", tcps)

        tcp = tcps[0]
        log_info("using active tcp {}", tcp)

        joints = await motion_group.joints()
        log_info("Current joints: {}", [round(j, 2) for j in joints])

        tcp_pose = await motion_group.tcp_pose(tcp)
        log_info("Current TCP pose: {}", tcp_pose)

        return JSONResponse(content={"logs": log_messages})

@app.post("/moveabit")
async def post_moveabit():
    await moveabit()
    return {
        "message": "Moveabit program executed"
    }
