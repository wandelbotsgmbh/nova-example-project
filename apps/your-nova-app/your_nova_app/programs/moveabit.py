from nova import Nova
import nova
from nova.actions import joint_ptp, cartesian_ptp
from nova.types import Pose
import asyncio

@nova.program
async def moveabit():
    async with Nova() as nova:
        cell = nova.cell("cell")
        controller = await cell.controller("ur")
        
        async with controller[0] as motion_group:
            tcps = await motion_group.tcp_names() 
            print(tcps)
            tcp = tcps[0]
            home_joints = await motion_group.joints()
            print(home_joints)
            home_pose = await motion_group.tcp_pose(tcp)
            print(home_pose)
            
            actions = [
                joint_ptp(home_joints),
                cartesian_ptp(home_pose @ Pose((100, 0, 0, 0, 0, 0))),
                cartesian_ptp(home_pose @ Pose((0, 100, 0, 0, 0, 0))),
                joint_ptp(home_joints),
            ]
            
            await motion_group.plan_and_execute(actions, tcp=tcp)


if __name__ == "__main__":
    asyncio.run(moveabit())