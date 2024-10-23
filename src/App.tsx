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
  const [profitPrice, setProfitPrice] = useState(20);
  const [riskPrice, setRiskPrice] = useState(7);
  const [buyPrice, setBuyPrice] = useState(10);
  const [maxLost, setMaxLost] = useState(100);
  const [result, setResult] = useState("");
  const [orgMode, setOrgMode] = useState(true);
  const [optionPremium, setOptionPremium] = useState(1);
  const [optionStrikePrice, setOpetionStrikePrice] = useState(1);

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
    return action === "开仓"
      ? ((profitPrice - optionStrikePrice - optionPremium) / optionPremium) *
          100
      : ((optionStrikePrice - profitPrice - optionPremium) / optionPremium) *
          100;
  }, [optionPremium, optionStrikePrice, profitPrice, action]);

  const text = useMemo(() => {
    return `** ${code} ${orgMode ? `[[roam:${action}记录]]` : `${action}记录`}
- 代码：${orgMode ? `[[roam:$${code}]]` : `$${code}`}
- 操作：${action}
- 周线趋势：${weeklyTrend}
- 日线趋势：${dailyTrend}
- 趋势的斜率为：${slope}

- 计划${buyOrSell}
- 交易价格：${buyPrice}
- 交易理由：
  ${plan}

- 盈亏金额：
- 止盈价：${profitPrice}
- 止损价：${riskPrice}
- 盈亏比：${winToLoseRate}
        
风险管理：
- 最大可承受亏损金额：${maxLost}
- 最多可持有的头寸数量：${maxShare}

期权计算：
- 期权行权价：${optionStrikePrice}
- 期权费用：${optionPremium}
- 期权 ROI: ${optionROI.toFixed(2)}%
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
      <Heading as="h2" size="4">
        趋势
      </Heading>
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
      <Separator size="4" />
      <Callout.Root color={winToLoseRate >= 3 ? "green" : "red"}>
        <Callout.Text weight="bold">
          盈亏比: {winToLoseRate.toFixed(2)}
          <br />
          <br />
          ROI: {(stockROI * 100).toFixed(2)}%
          <br />
          <br />
          最大持仓数: {maxShare.toFixed(0)}
        </Callout.Text>
      </Callout.Root>
      <Separator size="4" />
      <Heading as="h2" size="4">
        期权计算
      </Heading>
      <Flex gap="4" align="center">
        <Field label="行权价" direction="column" justify="start" align="start">
          <TextField.Root
            value={optionStrikePrice.toString()}
            type="number"
            onChange={(e) => setOpetionStrikePrice(+e.target.value)}
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
      <Callout.Root color={optionROI >= 1 ? "green" : "red"}>
        <Callout.Text>
          <Text weight="bold">期权 ROI: {optionROI.toFixed(2)}%</Text>
        </Callout.Text>
      </Callout.Root>

      <Separator size="4" />
      <pre
        style={{
          backgroundColor: "var(--gray-a2)",
          padding: "var(--space-1)",
          fontSize: "var(--font-size-1)",
          borderRadius: "var(--radius-1)",
          maxWidth: "100%",
          overflowX: "auto",
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
