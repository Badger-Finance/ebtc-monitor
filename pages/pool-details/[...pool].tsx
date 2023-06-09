import PoolDetailsComponent from "@/components/PoolDetailsComponent";
import getPoolData from "@/lib/fetcher";
import { Alert, Box, Button, useTheme } from "@mui/material";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";

export default function PoolDetails({ dataDump, error }) {
  const theme = useTheme();

  if (!dataDump)
    return <Box sx={{textAlign: 'center'}}>
    {
      error.map((e: string) => (
        <Alert sx={{marginTop: theme.spacing(5)}} key={e} severity="error">
          {e}
        </Alert>
      ))
    }
    <Button sx={{marginTop: theme.spacing(2) }} variant="contained" href="/" component={Link}>Go Home</Button>
    </Box>

  return (
    <>
      <Head>
        <title>Balancer Pool Data | EBTC-MONITOR</title>
        <meta name="description" content="Balancer Pool Data" />
      </Head>
      <PoolDetailsComponent dataDump={dataDump} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const BAL_TYPE = "Balancer";
  const pool = context.query.pool;

  if (!Array.isArray(pool)) {
    return {
      props: {
        dataDump: null,
        error: ["Pool address or Balancer pool is missing"],
      },
    };
  }

  const [poolAddress, balancerPoolId] = pool;

  if (!poolAddress || !balancerPoolId) {
    const error = [];
    if (!poolAddress) error.push("Pool address is missing!");
    if (!balancerPoolId) error.push("Balancer pool id is missing!");
    return { props: { dataDump: null, error } };
  }

  try {
    const res = await getPoolData(BAL_TYPE, poolAddress, balancerPoolId);
    return { props: { dataDump: JSON.parse(JSON.stringify(res)), error: [] } };
  } catch (error) {
    return { props: { dataDump: null, error: [error.message] } };
  }
};
