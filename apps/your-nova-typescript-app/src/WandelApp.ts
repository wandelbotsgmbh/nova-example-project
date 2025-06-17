import type {
  ControllerInstance,
  MotionGroupPhysical,
} from "@wandelbots/nova-api/v1"
import { flatten, keyBy } from "lodash-es"
import { makeAutoObservable } from "mobx"
import type { ConnectedMotionGroup } from "@wandelbots/nova-js/v1"
import { ProgramStateConnection } from "@wandelbots/nova-js/v1"
import type { NovaClient } from "@wandelbots/nova-js/v1"

export type MotionGroupOption = {
  selectionId: string
} & MotionGroupPhysical

/**
 * Main store for the current state of the robot pad.
 */
export class WandelApp {
  selectedMotionGroupId: string | null = null

  programRunner: ProgramStateConnection | null = null

  /**
   * Represents the current state of the selected motion group
   * after setup and websocket connection */
  activeRobot: ConnectedMotionGroup | null = null

  constructor(
    readonly nova: NovaClient,
    readonly availableControllers: ControllerInstance[],
  ) {
    (window as any).wandelApp = this
    makeAutoObservable(this)
  }

  get motionGroupOptions() {
    return flatten(
      this.availableControllers.map(
        (controller) => controller.physical_motion_groups,
      ),
    )
  }

  get motionGroupOptionsById() {
    return keyBy(this.motionGroupOptions, (mg) => mg.motion_group)
  }

  get motionGroup() {
    if (!this.selectedMotionGroupId) return null

    const motionGroup = this.motionGroupOptionsById[this.selectedMotionGroupId]
    if (!motionGroup) {
      throw new Error(
        `Invalid motion group selection id ${this.selectedMotionGroupId}`,
      )
    }
    return motionGroup
  }

  async selectMotionGroup(motionGroupId: string) {
    this.activeRobot = await this.nova.connectMotionGroup(motionGroupId)
  }

  async startProgramRunner() {
    this.programRunner = new ProgramStateConnection(this.nova)
  }

}
