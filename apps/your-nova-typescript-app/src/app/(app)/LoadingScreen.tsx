import { makeErrorMessage } from "@wandelbots/nova-js"
import { CircularProgress, Stack } from "@mui/material"

export const LoadingScreen = (props: { message?: string; error?: unknown }) => {
  return (
    <Stack
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
    >
      {props.error ? (
        <LoadingErrorMessage message={props.message} error={props.error} />
      ) : (
        <>
          <CircularProgress />
          {!!props.message && <div className="mt-4">{props.message}</div>}
        </>
      )}
    </Stack>
  )
}

const LoadingErrorMessage = (props: { message?: string; error: unknown }) => {
  const errorMessage = makeErrorMessage(props.error)
  const stack = props.error instanceof Error ? props.error.stack : null

  return (
    <Stack
      className="text-red-500"
      sx={{
        maxHeight: "100%",
        maxWidth: "min(100%, 800px)",
        padding: 2,
        overflow: "auto",
        "& pre": {
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          paddingBottom: "3rem",
        },
      }}
    >
      {`Error while: ${props.message} - ${errorMessage}`}
      <br />
      {stack && <pre>{stack}</pre>}
    </Stack>
  )
}
