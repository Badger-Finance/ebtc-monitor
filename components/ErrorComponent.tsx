import { Alert, Box, Button, useTheme } from "@mui/material";
import Link from "next/link";

export default function ErrorComponent({ error }: { error: string[] }) {
  const theme = useTheme();

  return (
    <Box sx={{ textAlign: "center" }}>
      {error.map((e: string) => (
        <Alert sx={{ marginTop: theme.spacing(5) }} key={e} severity="error">
          {e}
        </Alert>
      ))}
      <Button
        sx={{ marginTop: theme.spacing(2) }}
        variant="contained"
        href="/"
        component={Link}
      >
        Go Home
      </Button>
    </Box>
  );
}
