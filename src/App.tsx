import { useState, useEffect, FC, ReactNode } from "react";
import {
    TextField,
    TextArea,
    Container,
    Heading,
    Text,
    Button,
    Flex,
    Select,
    Separator,
} from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

type FormProps = {
    label: string;
    children: ReactNode;
};

const Field: FC<FormProps> = (props: FormProps) => {
    const { label, children } = props;
    return (
        <Flex gap="2" align="center">
            <Text style={{ wordBreak: "keep-all" }}>{label}</Text>
            {children}
        </Flex>
    );
};

const App: FC = () => {
    const [code, setCode] = useState("");
    const [action, setAction] = useState("开仓");
    const [weeklyTrend, setWeeklyTrend] = useState("多头趋势");
    const [dailyTrend, setDailyTrend] = useState("多头趋势");
    const [slope, setSlope] = useState("1 点钟方向");
    const [plan, setPlan] = useState("");
    const [buyOrSell, setBuyOrSell] = useState("做多");
    const [winPlan, setWinPlan] = useState("");
    const [lostPlan, setLostPlan] = useState("");
    const [winPrice, setWinPrice] = useState(20);
    const [lostPrice, setLostPrice] = useState(7);
    const [buyPrice, setBuyPrice] = useState(10);
    const [winToLoseRate, setWinToLoseRate] = useState(0);
    const [maxLost, setMaxLost] = useState(100);
    const [maxShare, setMaxShare] = useState(0);
    const [text, setText] = useState("");

    const updateLostPrice = (value: string) => {
        setLostPrice(Number(value));
    };

    const updateWinPrice = (value: string) => {
        setWinPrice(Number(value));
    };
    const updateBuyPrice = (value: string) => {
        setBuyPrice(Number(value));
    };

    const updateMaxLost = (value: string) => {
        setMaxLost(Number(value));
    };

    useEffect(() => {
        setWinToLoseRate((winPrice - buyPrice) / (buyPrice - lostPrice));
        setMaxShare(maxLost / (buyPrice - lostPrice));
        setText(`** ${code} ${
            action === "开仓"
                ? "[[id:31cd5804-5e07-4457-ba79-33b689264631][开仓记录]]"
                : " [[id:1ceaaced-5d1d-41a1-8249-d12a53037a60][空仓记录]]"
        }
- 代码：[[roam:$${code}]]
- 操作：${action}
- 周线趋势：${weeklyTrend}
- 日线趋势：${dailyTrend}
- 趋势的斜率为：${slope}

- 计划：
  ${plan}
- 计划：${buyOrSell}
- 买入价：${buyPrice}
        
- 止盈计划：
  如果市場運行方向符合預期，你打算在何種情況下止盈出局：
  ${winPlan}
- 止盈价：${winPrice}

- 止损计划：
  如果市場運行方向不符合預期，你打算在何種情況下止損出局：
  ${lostPlan}
- 止损价：${lostPrice}

- 盈亏比：${winToLoseRate}
        
风险管理：
- 最大可承受亏损金额：${maxLost}
- 最多可持有的头寸数量：${maxShare}
`);
    }, [
        winPrice,
        lostPrice,
        buyPrice,
        maxLost,
        action,
        code,
        weeklyTrend,
        dailyTrend,
        slope,
        winPlan,
        lostPlan,
        maxShare,
        winToLoseRate,
        plan,
        buyOrSell,
    ]);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
    };
    return (
        <Container p="8" size="1">
            <Flex direction="column" gap="4">
                <Heading as="h1" size="8">
                    简易交易流程表
                </Heading>
                <Separator size="4" />
                <Field label="股票代码">
                    <TextField.Root>
                        <TextField.Input
                            value={code}
                            size="2"
                            onChange={(e) => {
                                setCode(e.target.value);
                            }}
                        />
                    </TextField.Root>
                </Field>
                <Field label="计划操作">
                    <Select.Root
                        defaultValue="开仓"
                        onValueChange={(value) => {
                            setAction(value);
                        }}
                    >
                        <Select.Trigger />
                        <Select.Content>
                            <Select.Group>
                                <Select.Item value="开仓">开仓</Select.Item>
                                <Select.Item value="平仓">平仓</Select.Item>
                                <Select.Item value="加仓">加仓</Select.Item>
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </Field>
                <Separator size="4" />
                <Heading as="h2" size="4">
                    趋势
                </Heading>
                <Field label="周线趋势">
                    <Select.Root
                        defaultValue="多头趋势"
                        onValueChange={(value) => {
                            setWeeklyTrend(value);
                        }}
                    >
                        <Select.Trigger />
                        <Select.Content>
                            <Select.Group>
                                <Select.Item value="多头趋势">
                                    多头趋势
                                </Select.Item>
                                <Select.Item value="空头趋势">
                                    空头趋势
                                </Select.Item>
                                <Select.Item value="震荡趋势">
                                    震荡趋势
                                </Select.Item>
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </Field>
                <Field label="日线趋势">
                    <Select.Root
                        defaultValue="多头趋势"
                        onValueChange={(value) => {
                            setDailyTrend(value);
                        }}
                    >
                        <Select.Trigger />
                        <Select.Content>
                            <Select.Group>
                                <Select.Item value="多头趋势">
                                    多头趋势
                                </Select.Item>
                                <Select.Item value="空头趋势">
                                    空头趋势
                                </Select.Item>
                                <Select.Item value="震荡趋势">
                                    震荡趋势
                                </Select.Item>
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </Field>
                <Field label="趋势斜率">
                    <Select.Root
                        defaultValue="1 点钟方向"
                        onValueChange={(value) => {
                            setSlope(value);
                        }}
                    >
                        <Select.Trigger />
                        <Select.Content>
                            <Select.Group>
                                <Select.Item value="12 点钟方向">
                                    12 点钟方向
                                </Select.Item>
                                <Select.Item value="1 点钟方向">
                                    1 点钟方向
                                </Select.Item>
                                <Select.Item value="2 点钟方向">
                                    2 点钟方向
                                </Select.Item>
                                <Select.Item value="3 点钟方向">
                                    3 点钟方向
                                </Select.Item>
                                <Select.Item value="4 点钟方向">
                                    4 点钟方向
                                </Select.Item>
                                <Select.Item value="5 点钟方向">
                                    5 点钟方向
                                </Select.Item>
                                <Select.Item value="6 点钟方向">
                                    6 点钟方向
                                </Select.Item>
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </Field>
                <Separator size="4" />
                <Heading as="h2" size="4">
                    计划
                </Heading>
                <TextArea
                    size="3"
                    style={{ width: "100%" }}
                    placeholder="进入交易的理由"
                    onChange={(e) => setPlan(e.target.value)}
                />
                <Field label="做多做空">
                    <Select.Root
                        defaultValue="做多"
                        onValueChange={(value) => {
                            setBuyOrSell(value);
                        }}
                    >
                        <Select.Trigger />
                        <Select.Content>
                            <Select.Group>
                                <Select.Item value="做多">做多</Select.Item>
                                <Select.Item value="做空">做空</Select.Item>
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </Field>
                <Field label="买入价格">
                    <TextField.Root>
                        <TextField.Input
                            value={buyPrice.toString()}
                            onChange={(e) => updateBuyPrice(e.target.value)}
                        />
                    </TextField.Root>
                </Field>
                <Separator size="4" />
                <Heading as="h2" size="4">
                    止盈计划
                </Heading>
                <TextArea
                    size="3"
                    style={{ width: "100%" }}
                    placeholder="如果市場運行方向符合預期，你打算在何種情況下止盈出局"
                    onChange={(e) => setWinPlan(e.target.value)}
                />
                <Field label="止盈价格">
                    <TextField.Root>
                        <TextField.Input
                            value={winPrice.toString()}
                            onChange={(e) => updateWinPrice(e.target.value)}
                        />
                    </TextField.Root>
                </Field>
                <Separator size="4" />
                <Heading as="h2" size="4">
                    止损计划
                </Heading>
                <TextArea
                    size="3"
                    style={{ width: "100%" }}
                    placeholder="如果市場運行方向不符合預期，你打算在何種情況下止損出局"
                    onChange={(e) => setLostPlan(e.target.value)}
                />
                <Field label="止损价格">
                    <TextField.Root>
                        <TextField.Input
                            value={lostPrice.toString()}
                            onChange={(e) => updateLostPrice(e.target.value)}
                        />
                    </TextField.Root>
                </Field>
                <Separator size="4" />
                <Heading as="h2" size="4">
                    盈亏比: {winToLoseRate}
                </Heading>
                <Separator size="4" />
                <Heading as="h2" size="4">
                    风险管理
                </Heading>
                <Field label="最大止损金额">
                    <TextField.Root>
                        <TextField.Input
                            value={maxLost.toString()}
                            onChange={(e) => updateMaxLost(e.target.value)}
                        />
                    </TextField.Root>
                </Field>
                <Field label="最大持仓数量">
                    <TextField.Root>
                        <TextField.Input value={maxShare.toString()} readOnly />
                    </TextField.Root>
                </Field>
                <Separator size="4" />
                <pre
                    style={{
                        backgroundColor: "var(--gray-a2)",
                        padding: "var(--space-1)",
                        fontSize: "var(--font-size-1)",
                        borderRadius: "var(--radius-1)",
                    }}
                >
                    {text}
                </pre>
            </Flex>
            <Button onClick={handleCopy}>Copy</Button>
        </Container>
    );
};

export default App;
