import ErrorComponent from "@/components/ErrorComponent";
import PoolDetailsComponent from "@/components/PoolDetailsComponent";
import getPoolData from "@/lib/fetcher";
import { PoolData } from "@/lib/liquidation";
import { GetServerSideProps } from "next";
import Head from "next/head";

export interface DataDumpType {
  dataDump: PoolData;
}
export interface PoolDetailsProps extends DataDumpType {
  error: string[];
}
export default function PoolDetails({ dataDump, error }: PoolDetailsProps) {
  
  if (!dataDump) return <ErrorComponent error={error} />

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
        error: ["Pool address or Balancer pool id is missing"],
      },
    };
  }

  const [poolAddress, balancerPoolId] = pool;

  /**
   * Return error if either pool address or balancer pool id is missing
   */
  if (!poolAddress || !balancerPoolId) {
    const error = [];
    if (!poolAddress) error.push("Pool address is missing!");
    if (!balancerPoolId) error.push("Balancer pool id is missing!");
    return { props: { dataDump: null, error } };
  }

  try {
    const res = await getPoolData(BAL_TYPE, poolAddress, balancerPoolId);
    return { props: { dataDump: JSON.parse(JSON.stringify(res)), error: [] } };
  } catch (error: any) {
    return { props: { dataDump: null, error: [JSON.stringify(error.message)] } };
  }
};
