import { useState, FC, ReactNode, useMemo } from "react";
import {
  TextField,
  TextArea,
  Heading,
  Text,
  Button,
  Flex,
  Select,
  Separator,
  Callout,
  Link,
  Checkbox,
  SegmentedControl,
  type FlexProps,
  DataList,
  Box,
} from "@radix-ui/themes";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import "@radix-ui/themes/styles.css";

type FormProps = FlexProps & {
  label: string;
  children: ReactNode;
};

const Field: FC<FormProps> = (props: FormProps) => {
  const { label, children, ...flexProps } = props;
  return (
    <Flex gap="2" align="center" {...flexProps}>
      <Text style={{ wordBreak: "keep-all" }}>{label}</Text>
      {children}
    </Flex>
  );
};

type SelectorProps = {
  defaultValue: string;
  handleValueChange: (value: string) => void;
  values: string[];
};

const Selector: FC<SelectorProps> = (props: SelectorProps) => {
  const { defaultValue, handleValueChange } = props;
  return (
    <Select.Root
      defaultValue={defaultValue}
      onValueChange={(value) => {
        handleValueChange(value);
      }}
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Group>
          {props.values.map((value) => (
            <Select.Item key={value} value={value}>
              {value}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

const App: FC = () => {
  const [code, setCode] = useState("");
  const [action, setAction] = useState("开仓");
  const [weeklyTrend, setWeeklyTrend] = useState("多头");
  const [dailyTrend, setDailyTrend] = useState("多头");
  const [slope, setSlope] = useState("1 点钟方向");
  const [plan, setPlan] = useState("");
  const [buyOrSell, setBuyOrSell] = useState("做多");
  const [profitPrice, setProfitPrice] = useState(260);
  const [riskPrice, setRiskPrice] = useState(247);
  const [buyPrice, setBuyPrice] = useState(250);
  const [maxLost, setMaxLost] = useState(100);
  const [result, setResult] = useState("");
  const [orgMode, setOrgMode] = useState(true);
  const [optionPremium, setOptionPremium] = useState(17);
  const [optionStrikePrice, setOptionStrikePrice] = useState(232);

  const winToLoseRate = useMemo(() => {
    return (profitPrice - buyPrice) / (buyPrice - riskPrice);
  }, [profitPrice, buyPrice, riskPrice]);

  const maxShare = useMemo(() => {
    return maxLost / (buyPrice - riskPrice);
  }, [maxLost, buyPrice, riskPrice]);

  const stockROI = useMemo(() => {
    return (profitPrice - buyPrice) / buyPrice;
  }, [profitPrice, buyPrice]);

  const optionROI = useMemo(() => {
    return buyOrSell === "做多"
      ? ((profitPrice - optionStrikePrice - optionPremium) / optionPremium) *
          100
      : ((optionStrikePrice - profitPrice - optionPremium) / optionPremium) *
          100;
  }, [optionPremium, optionStrikePrice, profitPrice, buyOrSell]);

  const optionProfit = useMemo(() => {
    return buyOrSell === "做多"
      ? (profitPrice - optionStrikePrice - optionPremium) * 100
      : (optionStrikePrice - profitPrice - optionPremium) * 100;
  }, [optionPremium, optionStrikePrice, profitPrice, buyOrSell]);

  const optionLost = useMemo(() => {
    return buyOrSell === "做多"
      ? (riskPrice - optionStrikePrice - optionPremium) * 100
      : (optionStrikePrice - riskPrice - optionPremium) * 100;
  }, [optionPremium, optionStrikePrice, riskPrice, buyOrSell]);

  const optionProfileLostRate = useMemo(() => {
    return (optionProfit / optionLost) * -1;
  }, [optionLost, optionProfit]);

  const text = useMemo(() => {
    return `** ${buyOrSell} [[roam:$${code}]] ${orgMode ? `[[roam:${action}记录]]` : `${action}记录`}
- 周线：${weeklyTrend} | 日线：${dailyTrend} | 斜率：${slope}
- 交易理由：
${plan}

- 正股盈亏：
  买入价：${buyPrice} | 止盈价：${profitPrice} | 止损价：${riskPrice}
  ROI: ${(stockROI * 100).toFixed(2)}% | 盈亏比：${winToLoseRate.toFixed(2)}
        
- 风险管理：
  最大亏损金额：${maxLost} | 最多持有头寸：${maxShare.toFixed(0)}

- 期权盈亏：
  行权价：${optionStrikePrice} | 费用：${optionPremium} | 总成本：${(optionPremium * 100).toFixed(2)}
  止盈价：${(profitPrice - optionStrikePrice).toFixed(2)} | 潜在利润：${optionProfit.toFixed(2)}
  止损价：${(riskPrice - optionStrikePrice).toFixed(2)} | 潜在亏损：${optionLost.toFixed(2)}
  期权 ROI: ${optionROI.toFixed(2)}% | 盈亏比：${optionProfileLostRate.toFixed(2)}
`;
  }, [
    profitPrice,
    riskPrice,
    buyPrice,
    maxLost,
    action,
    code,
    weeklyTrend,
    dailyTrend,
    slope,
    maxShare,
    winToLoseRate,
    plan,
    buyOrSell,
    orgMode,
    optionPremium,
    optionROI,
    optionStrikePrice,
    optionLost,
    optionProfit,
    optionProfileLostRate,
    stockROI,
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };
  return (
    <Flex direction="column" gap="4">
      <Heading as="h1" size="8">
        简易交易流程表
      </Heading>
      <Separator size="4" />
      <Flex gap="4" align="center">
        <Field label="股票代码">
          <TextField.Root
            value={code}
            size="2"
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
            }}
          />
        </Field>
        <Field label="计划操作">
          <Selector
            defaultValue="开仓"
            handleValueChange={setAction}
            values={["开仓", "平仓", "加仓", "减仓"]}
          />
        </Field>
      </Flex>

      <Separator size="4" />
      <Field label="周线趋势">
        <SegmentedControl.Root
          defaultValue="多头"
          onValueChange={setWeeklyTrend}
        >
          <SegmentedControl.Item value="多头">多头</SegmentedControl.Item>
          <SegmentedControl.Item value="空头">空头</SegmentedControl.Item>
          <SegmentedControl.Item value="震荡">震荡</SegmentedControl.Item>
        </SegmentedControl.Root>
      </Field>
      <Field label="日线趋势">
        <SegmentedControl.Root
          defaultValue="多头"
          onValueChange={setDailyTrend}
        >
          <SegmentedControl.Item value="多头">多头</SegmentedControl.Item>
          <SegmentedControl.Item value="空头">空头</SegmentedControl.Item>
          <SegmentedControl.Item value="震荡">震荡</SegmentedControl.Item>
        </SegmentedControl.Root>
      </Field>
      <Field label="趋势斜率">
        <Selector
          defaultValue="1 点钟方向"
          handleValueChange={setSlope}
          values={[
            "12 点钟方向",
            "1 点钟方向",
            "2 点钟方向",
            "3 点钟方向",
            "4 点钟方向",
            "5 点钟方向",
            "6 点钟方向",
          ]}
        />
      </Field>
      <Separator size="4" />
      <Flex gap="4" align="center">
        <Heading as="h2" size="4">
          计划
        </Heading>
        <SegmentedControl.Root defaultValue="做多" onValueChange={setBuyOrSell}>
          <SegmentedControl.Item value="做多">做多</SegmentedControl.Item>
          <SegmentedControl.Item value="做空">做空</SegmentedControl.Item>
        </SegmentedControl.Root>
      </Flex>
      <TextArea
        size="3"
        style={{ width: "100%" }}
        placeholder="进入交易的理由，止盈计划以及止损计划"
        onChange={(e) => setPlan(e.target.value)}
      />
      <Flex gap="4" justify="between">
        <Field
          label="交易价格"
          direction="column"
          justify="start"
          align="start"
        >
          <TextField.Root
            value={buyPrice}
            type="number"
            onChange={(e) => setBuyPrice(+e.target.value)}
          />
        </Field>
        <Field
          label="止盈价格"
          direction="column"
          justify="start"
          align="start"
        >
          <TextField.Root
            value={profitPrice}
            type="number"
            onChange={(e) => setProfitPrice(+e.target.value)}
          />
        </Field>
        <Field
          label="止损价格"
          direction="column"
          justify="start"
          align="start"
        >
          <TextField.Root
            value={riskPrice}
            type="number"
            onChange={(e) => setRiskPrice(+e.target.value)}
          />
        </Field>
        <Field
          label="最大止损金额"
          direction="column"
          justify="start"
          align="start"
        >
          <TextField.Root
            value={maxLost.toString()}
            onChange={(e) => setMaxLost(+e.target.value)}
          />
        </Field>
      </Flex>
      {action !== "开仓" && (
        <Field label="盈亏金额">
          <TextField.Root
            value={result}
            onChange={(e) => {
              setResult(e.target.value);
            }}
          />
        </Field>
      )}
      <Flex gap="4" align="center">
        <Field
          label="期权行权价"
          direction="column"
          justify="start"
          align="start"
        >
          <TextField.Root
            value={optionStrikePrice.toString()}
            type="number"
            onChange={(e) => setOptionStrikePrice(+e.target.value)}
          />
        </Field>
        <Field
          label="期权费用"
          direction="column"
          justify="start"
          align="start"
        >
          <TextField.Root
            value={optionPremium.toString()}
            type="number"
            onChange={(e) => setOptionPremium(+e.target.value)}
          />
        </Field>
      </Flex>
      <Flex
        direction="column"
        width="100%"
        style={{
          backgroundColor: "var(--green-a3)",
          color: "var(--green-a11)",
          fontWeight: "600",
          borderRadius: "var(--radius-3)",
          border: "1px solid var(--green-a4)",
        }}
      >
        <Flex align="center" justify="between" width="100%">
          <Flex width="50%" justify="center" flexGrow="1" flexShrink="0">
            <Text align="center">期权盈亏</Text>
          </Flex>
          <Box
            style={{
              width: "1px",
              backgroundColor: "var(--gray-a6)",
              height: "40px",
            }}
            flexShrink="0"
          />
          <Flex width="50%" justify="center" flexGrow="1" flexShrink="0">
            <Text>股票盈亏</Text>
          </Flex>
        </Flex>
        <Separator size="4" />
        <Flex width="100%">
          <Box width="50%" p="4" flexGrow="1" flexShrink="0">
            <DataList.Root>
              <DataList.Item>
                <DataList.Label>成本</DataList.Label>
                <DataList.Value>{optionPremium * 100}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>潜在盈利</DataList.Label>
                <DataList.Value>{optionProfit.toFixed(2)}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>潜在亏损</DataList.Label>
                <DataList.Value>{optionLost.toFixed(2)}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>ROI</DataList.Label>
                <DataList.Value>{optionROI.toFixed(2)}%</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>盈亏比</DataList.Label>
                <DataList.Value>
                  {optionProfileLostRate.toFixed(2)}
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Box>
          <Box
            style={{
              width: "1px",
              backgroundColor: "var(--gray-a6)",
              height: "188px",
            }}
            flexShrink="0"
          />
          <Box p="4" width="50%" flexGrow="1" flexShrink="0">
            <DataList.Root>
              <DataList.Item>
                <DataList.Label>成本</DataList.Label>
                <DataList.Value>
                  {(buyPrice * maxShare).toFixed(0)}
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>潜在盈利</DataList.Label>
                <DataList.Value>
                  {((profitPrice - buyPrice) * maxShare).toFixed(2)}
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>潜在亏损</DataList.Label>
                <DataList.Value>-{maxLost.toFixed(2)}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>ROI</DataList.Label>
                <DataList.Value>{(stockROI * 100).toFixed(2)}%</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>盈亏比</DataList.Label>
                <DataList.Value>{winToLoseRate.toFixed(2)}</DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Box>
        </Flex>
      </Flex>
      <pre
        style={{
          backgroundColor: "var(--gray-a2)",
          padding: "var(--space-3)",
          fontSize: "var(--font-size-1)",
          borderRadius: "var(--radius-3)",
          maxWidth: "100%",
          overflowX: "auto",
          border: "1px solid var(--gray-a4)",
        }}
      >
        {text}
      </pre>
      <Text as="label" size="2">
        <Flex gap="2">
          <Checkbox
            defaultChecked
            checked={orgMode}
            onCheckedChange={(checked: boolean) => {
              setOrgMode(checked);
            }}
          />{" "}
          OrgMode
        </Flex>
      </Text>
      <Button onClick={handleCopy}>Copy</Button>
      <Separator size="4" />
      <Flex gap="3" align="center">
        <Text size="1">
          Inspired by{" "}
          <Link
            href="https://themarketmemo.com/tradingchecklist/"
            target="_blank"
          >
            簡易交易流程表
          </Link>
        </Text>
        <Separator orientation="vertical" size="1" />
        <Text size="1">
          Made by{" "}
          <Link href="https://maxoxo.me/" target="_blank">
            max
          </Link>
        </Text>
        <Separator orientation="vertical" size="1" />
        <Link href="https://github.com/jay1803/trading-plan" target="_blank">
          <GitHubLogoIcon width="12" height="12" />
        </Link>
      </Flex>
    </Flex>
  );
};

export default App;
