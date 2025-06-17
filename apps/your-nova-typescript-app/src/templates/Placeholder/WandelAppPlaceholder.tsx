import { env } from "../../runtimeEnv"
import React, { useState } from "react"
import Image from "next/image"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { styled } from "@mui/system"
import wandelbots from "./wandelbots.png"
import { Box, Divider, Link, Stack } from "@mui/material"
import { useActiveRobot } from "../../WandelAppContext"
import { MathUtils } from "three"
import AnimatedBackground from "./AnimatedBackground"
import {
  defaultAxisConfig,
  useAnimationFrame,
} from "@wandelbots/wandelbots-js-react-components"

const CustomCard = styled(Card)({
  background: "none",
  borderRadius: "15px",
  margin: "10px",
  cursor: "pointer",
  width: "300px",
})

const BlurredCard = styled(Card)({
  backgroundColor: "#ffffff11",
  borderRadius: "8px",
  marginTop: "100px",
  padding: "8px 24px",
  border: "1px solid #ffffff22",
  cursor: "pointer",
  backdropFilter: "blur(50px)",
})

export const WandelAppPlaceholder = () => {
  const activeRobot = useActiveRobot()
  const [axisConfig, setAxisConfig] = useState(defaultAxisConfig)
  const remoteInstanceUrl =
    env.WANDELAPI_BASE_URL === undefined ||
    env.WANDELAPI_BASE_URL === "" ||
    `${env.WANDELAPI_BASE_URL}`.startsWith("http")
      ? `${env.WANDELAPI_BASE_URL}`
      : `http://${env.WANDELAPI_BASE_URL}`

  useAnimationFrame(() => {
    const newJoints =
      activeRobot.rapidlyChangingMotionState.state.joint_position.joints

    setAxisConfig([...newJoints].filter((item) => item !== undefined))
  })
  return (
    <>
      <AnimatedBackground />
      <Box display="flex" flexDirection="column" height="100vh">
        <Box alignSelf="flex-start" ml={7} mt={5}>
          <Image
            src={wandelbots}
            alt="Wandelbots"
            width={465 / 3.5}
            height={76 / 3.5}
          />
        </Box>

        <Box
          flexGrow={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <BlurredCard style={{ maxWidth: "500px" }}>
            <CardContent>
              <Typography
                variant="body2"
                color="white"
                fontFamily={"Monaco"}
                sx={{ marginTop: "8px", marginBottom: "14px" }}
              >
                Welcome dear{" "}
                <span style={{ color: "#F3C832" }}>Developer :]</span>
              </Typography>
              <Typography variant="body2" color="white" fontFamily={"Monaco"}>
                → Get started by editing{" "}
                <span style={{ color: "#49D4FF" }}>
                  src/app/(app)/WandelAppMain.tsx
                </span>
              </Typography>
            </CardContent>
          </BlurredCard>
        </Box>

        <Box pb={5} ml={15} mr={15}>
          <Stack direction="column" spacing={2} justifyContent="space-between">
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <CustomCard>
                <CardContent>
                  <Typography variant="body2" color="white">
                    <Stack
                      direction="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      spacing={0.5}
                      letterSpacing={0.6}
                    >
                      <span style={{ color: "#ffffff88" }}>
                        Connection status:
                      </span>
                      <span style={{ color: "#2affbf" }}>connected</span>
                      <br />
                      <span style={{ color: "#ffffff88" }}>
                        Connected with:
                      </span>
                      <span>{activeRobot.modelFromController}</span>
                      <span>{activeRobot.motionGroupId}</span>
                    </Stack>
                  </Typography>
                </CardContent>
              </CustomCard>

              <CustomCard>
                <CardContent>
                  <Typography variant="body2" color="white">
                    <Stack
                      direction="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      spacing={0.5}
                      letterSpacing={0.6}
                    >
                      <span style={{ color: "#ffffff88" }}>Robot pose:</span>
                      {axisConfig.map((joint, index) => (
                        <span key={index}>
                          Joint {index + 1}:{" "}
                          {Math.round(MathUtils.radToDeg(joint))}°
                        </span>
                      ))}
                    </Stack>
                  </Typography>
                </CardContent>
              </CustomCard>

              <CustomCard
                onClick={() =>
                  (window.location.href = `${env.WANDELAPI_BASE_URL}`)
                }
              >
                <CardContent>
                  <Typography variant="body2" color="white">
                    <Stack
                      direction="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      spacing={0.5}
                      letterSpacing={0.6}
                    >
                      <span style={{ color: "#ffffff88" }}>Usefull links:</span>
                      <span>Manage your Instance or get help:</span>
                      <Link
                        color="#6558FF"
                        href="https://portal.wandelbots.io/"
                      >
                        Dev Portal
                      </Link>
                      <br />
                      <span>Move robot:</span>
                      <Link color="#6558FF" href={remoteInstanceUrl}>
                        {remoteInstanceUrl}
                      </Link>
                    </Stack>
                  </Typography>
                </CardContent>
              </CustomCard>
            </Stack>
            <Divider color="#ffffff" sx={{ opacity: 0.2 }}></Divider>
          </Stack>
        </Box>
      </Box>
    </>
  )
}
