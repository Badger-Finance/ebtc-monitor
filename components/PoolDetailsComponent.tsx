import computeLiquidationData, {
  LiquidationData,
  PoolData,
} from "@/lib/liquidation";
import { DataDumpType } from "@/pages/pool-details/[...pool]";
import { isBigNumber, isObject } from "@/utility";
import { convertBigNumberToNormal, convertToScientificNotation } from "@/utility/number";
import { toTitleCase } from "@/utility/string";
import {
  Box,
  Typography,
  TableContainer,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputLabel,
  OutlinedInput,
  Button,
  Paper,
  useTheme,
  Grid,
  Switch,
  FormControlLabel,
  Chip,
} from "@mui/material";
import { useMemo, useState } from "react";

export default function PoolDetailsComponent({ dataDump }: DataDumpType) {
  const theme = useTheme();

  const [poolDetailsSwitch, setPoolDetailsSwitch] = useState(false);
  const [liquidationDataSwitch, setLiquidationDataSwitch] = useState(false);

  const [toSell, setToSell] = useState(1e21);
  const [liquidationPremium, setLiquidationPremium] = useState(300);
  const [secondsForPoolRefill, setSecondsForPoolRefill] = useState(60 * 60);

  const liquidationData: LiquidationData | null = useMemo(
    // We know it's defined
    () =>
      // @ts-ignore
      dataDump != null
        ? computeLiquidationData(toSell, liquidationPremium, 18, {
            ...dataDump,
            timeForReplenishment: secondsForPoolRefill,
          })
        : null,
    [toSell, liquidationPremium, 18, dataDump, secondsForPoolRefill]
  );

  const renderData = (data: any) => {
    if (isObject(data)) {
      return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="Pool details">
            <TableHead>
              <TableRow>
                <TableCell width={theme.spacing(20)}>Attribute</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(data).map((key) => {
                return (
                  <TableRow
                    key={key}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {toTitleCase(key)}
                    </TableCell>
                    <TableCell>
                      {isObject(data[key]) && !isBigNumber(data[key])
                        ? renderData(data[key])
                        : isBigNumber(data[key])
                        ? `${convertToScientificNotation(convertBigNumberToNormal(data[key]))} ETH`
                        : Array.isArray(data[key])
                        ? data[key].map((val: any, index: number) => {
                            return isBigNumber(val) ? (
                              <Chip
                                key={index}
                                variant="outlined"
                                label={`${convertToScientificNotation(
                                  convertBigNumberToNormal(val)
                                )} ETH`}
                                sx={{ marginRight: theme.spacing(2) }}
                              />
                            ) : (
                              <Chip
                                key={index}
                                variant="outlined"
                                label={JSON.stringify(val)}
                                sx={{ marginRight: theme.spacing(2) }}
                              />
                            );
                          })
                        : JSON.stringify(data[key])}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
    return <></>;
  };

  return (
    <>
      <Box sx={{ marginTop: theme.spacing(4) }}>
        <Grid container display="flex">
          <Grid item xs={10}>
            <Typography gutterBottom variant="h2">
              Pool Details
            </Typography>
          </Grid>
          <Grid xs={2} display="flex" justifyContent="flex-end">
            <FormControlLabel
              control={
                <Switch
                  checked={poolDetailsSwitch}
                  onChange={(event) =>
                    setPoolDetailsSwitch(event.target.checked)
                  }
                />
              }
              label={poolDetailsSwitch ? "JSON View" : "Table View"}
            />
          </Grid>
        </Grid>
        {!poolDetailsSwitch ? (
          renderData(dataDump)
        ) : (
          <Paper variant="outlined" sx={{ padding: theme.spacing(2) }}>
            {JSON.stringify(dataDump)}
          </Paper>
        )}
      </Box>

      {/* Liquidity to Allow */}
      <Box>
        <Box
          marginBottom={theme.spacing(4)}
          display="flex"
          alignItems="center"
          marginTop={theme.spacing(8)}
        >
          <InputLabel htmlFor="liquidityToAllow">Liquidity to Allow</InputLabel>
          <OutlinedInput
            type="number"
            fullWidth
            id="liquidityToAllow"
            onChange={(e) => setToSell(parseInt(e.target.value, 10))}
            value={toSell}
            size="small"
            style={{
              flex: 1,
              marginLeft: theme.spacing(2),
              maxWidth: theme.spacing(50),
            }}
          />
        </Box>
        {/* Liquidity to Allow */}

        {/* In Eth */}
        <Box
          marginBottom={theme.spacing(1)}
          display="flex"
          alignItems="center"
          marginTop={theme.spacing(8)}
        >
          <InputLabel htmlFor="liquidityToAllow">In Eth</InputLabel>
          <Box display="flex" alignItems="center" marginLeft={theme.spacing(2)}>
            <Button
              variant="contained"
              onClick={() => setToSell(toSell - 1000e18)}
            >
              -1000
            </Button>
            <OutlinedInput
              type="number"
              fullWidth
              id="liquidityToAllow"
              value={toSell / 1e18}
              onChange={(e) => setToSell(parseInt(e.target.value) * 1e18)}
              size="small"
              style={{
                flex: 1,
                maxWidth: theme.spacing(50),
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
              }}
            />
            <Button
              variant="contained"
              onClick={() => setToSell(toSell + 1000e18)}
            >
              +1000
            </Button>
            <Button
              variant="contained"
              onClick={() => setToSell(toSell * 10)}
              sx={{ marginLeft: theme.spacing(1) }}
            >
              * 10
            </Button>
          </Box>
        </Box>
        <Paper variant="outlined" sx={{ padding: theme.spacing(2) }}>
          Selling {toSell}
        </Paper>
        {/* In Eth */}

        {/* Liquidation Premium */}
        <Box
          marginBottom={theme.spacing(1)}
          display="flex"
          alignItems="center"
          marginTop={theme.spacing(8)}
        >
          <InputLabel htmlFor="liquidityToAllow">
            Liquidation Premium
          </InputLabel>
          <Box display="flex" alignItems="center" marginLeft={theme.spacing(2)}>
            <Button
              variant="contained"
              onClick={() => setLiquidationPremium(liquidationPremium - 1000)}
            >
              -1000
            </Button>
            <OutlinedInput
              type="number"
              fullWidth
              id="liquidityToAllow"
              value={liquidationPremium}
              onChange={(e) =>
                setLiquidationPremium(parseInt(e.target.value, 10))
              }
              size="small"
              style={{
                flex: 1,
                maxWidth: theme.spacing(50),
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
              }}
            />
            <Button
              variant="contained"
              onClick={() => setLiquidationPremium(liquidationPremium + 1000)}
            >
              +1000
            </Button>
          </Box>
        </Box>
        <Paper variant="outlined" sx={{ padding: theme.spacing(2) }}>
          Selling {toSell}
        </Paper>
        {/* Liquidation Premium */}

        {/* Seconds For Pool Replenishment */}
        <Box
          marginBottom={theme.spacing(1)}
          display="flex"
          alignItems="center"
          marginTop={theme.spacing(8)}
        >
          <InputLabel htmlFor="liquidityToAllow">
            Seconds For Pool Replenishment
          </InputLabel>
          <Box display="flex" alignItems="center" marginLeft={theme.spacing(2)}>
            <Button
              variant="contained"
              onClick={() =>
                setSecondsForPoolRefill(secondsForPoolRefill - 60 * 60)
              }
            >
              - 1 Hour
            </Button>
            <OutlinedInput
              type="number"
              fullWidth
              id="liquidityToAllow"
              value={secondsForPoolRefill}
              onChange={(e) =>
                setSecondsForPoolRefill(parseInt(e.target.value))
              }
              size="small"
              style={{
                flex: 1,
                maxWidth: theme.spacing(50),
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
              }}
            />
            <Button
              variant="contained"
              onClick={() =>
                setSecondsForPoolRefill(secondsForPoolRefill + 60 * 60)
              }
            >
              + 1 Hour
            </Button>
          </Box>
        </Box>
        <Paper variant="outlined" sx={{ padding: theme.spacing(2) }}>
          Seconds for Pool Refill {secondsForPoolRefill}
        </Paper>
        {/* Seconds For Pool Replenishment */}

        <Box marginTop={theme.spacing(8)} marginBottom={theme.spacing(8)}>
          <Grid container display="flex">
            <Grid item xs={10}>
              <Typography gutterBottom variant="h2">
                Liquidation Data
              </Typography>
            </Grid>
            <Grid xs={2} display="flex" justifyContent="flex-end">
              <FormControlLabel
                control={
                  <Switch
                    checked={liquidationDataSwitch}
                    onChange={(event) =>
                      setLiquidationDataSwitch(event.target.checked)
                    }
                  />
                }
                label={liquidationDataSwitch ? "JSON View" : "Table View"}
              />
            </Grid>
          </Grid>

          {!liquidationDataSwitch ? (
            renderData(liquidationData)
          ) : (
            <Paper variant="outlined" sx={{ padding: theme.spacing(2) }}>
              {JSON.stringify(liquidationData)}
            </Paper>
          )}
        </Box>
      </Box>
    </>
  );
}
