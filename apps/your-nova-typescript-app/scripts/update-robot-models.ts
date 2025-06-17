import decompress from "decompress"
import isCI from "is-ci"
import { readFileSync } from "node:fs"
import { mkdtemp, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { exit } from "node:process"
import { Readable } from "node:stream"
import type { ReadableStream } from "node:stream/web"
import { mv, rm } from "shelljs"

/**
 * Downloads the robot glb asset files published in the currently installed
 * version of wbjs-react and puts them in public/models, as needed.
 *
 * The model files aren't in the npm package itself for file size reasons; by
 * default they come from a CDN, but for robot pad we want to bundle them
 * to ensure they're available on an offline IPC.
 */
async function updateRobotModels() {
  // Grab the version of wbjs-react we're currently using
  const { version } = JSON.parse(
    readFileSync(
      path.join(
        __dirname,
        "../node_modules/@wandelbots/wandelbots-js-react-components/package.json",
      ),
      "utf8",
    ),
  )

  // Compare it to the version in public/models
  const currentVersion = readFileSync(
    path.join(__dirname, "../public/models/version.txt"),
    "utf8",
  ).trim()

  if (version === currentVersion) {
    return // All good here
  }

  if (isCI) {
    console.error(
      `Robot models are out of sync with package.json: ${currentVersion} ➜ ${version}. Please run npm install locally and commit the result.`,
    )
    exit(1)
  }

  if (version === "0.0.0-semantically-released") {
    console.log(
      "Not updating models; using a development version of wbjs-react",
    )
    return
  }

  // Versions differ, so we need to update the models
  const zipUrl = `https://github.com/wandelbotsgmbh/wandelbots-js-react-components/archive/refs/tags/v${version}.zip`
  console.log(`Downloading ${zipUrl}...`)

  const response = await fetch(zipUrl)
  if (response.status !== 200 || !response.body) {
    console.error("Failed to download model zip", response)
    exit(1)
  }

  const tmpDir = await mkdtemp(path.join(tmpdir(), "robot-pad-models-"))

  const stream = Readable.fromWeb(response.body as ReadableStream)
  const zipPath = path.join(tmpDir, `${version}.zip`)
  await writeFile(zipPath, stream)

  // Unpack the models
  console.log("Unpacking zip...")
  await decompress(zipPath, tmpDir)
  const newModelsDir = path.join(
    tmpDir,
    `wandelbots-js-react-components-${version}/public/models`,
  )

  // Write the version stamp
  await writeFile(path.join(newModelsDir, "version.txt"), version)

  // Replace the old models dir with the new one
  console.log("Replacing models...")

  const oldModelsDir = path.join(__dirname, "../public/models/")
  rm("-rf", oldModelsDir)
  mv(newModelsDir, oldModelsDir)

  // Done!
  console.log(
    `Successfully updated robot models ${currentVersion} ➜ ${version}`,
  )
}

updateRobotModels()
