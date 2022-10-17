import {
  Input,
  Button,
  Col,
  Row,
  Select,
  InputNumber,
  DatePicker,
  AutoComplete,
  Cascader,
  Tooltip, Form, Space,
} from 'antd';
import { useEffect, useRef, useState } from "react";

const GAME_STATE = {
  playing: 0,
  overSuccess: 1,
  overFailed: 2,
};

function DucksPlay({ onOver }) {
  const [form] = Form.useForm();
  const [eggCount, setEggCount] = useState(0);
  const [testTime, setTestTime] = useState(0);
  const [safeFloor, setSafeFloor] = useState(0);
  const [dangerFloor, setDangerFloor] = useState(101);
  const [gameState, setGameState] = useState(GAME_STATE.playing);
  const [log, setLog] = useState([]);
  const logRef = useRef();
  const inputNumberRef = useRef();
  const reset = () => {
    setEggCount(0);
    setTestTime(0);
    setSafeFloor(0);
    setDangerFloor(101);
    setGameState(GAME_STATE.playing);
    setLog([]);
    setPrev(GAME_STATE.playing);
    form.resetFields({ duckCount: 4, repeatTime: 10000 });
  }

  const gameOver = (success) => {
    setGameState(success ? GAME_STATE.overSuccess : GAME_STATE.overFailed);
  }

  const [prev, setPrev] = useState(gameState);
  useEffect(() => {
    if (prev === GAME_STATE.playing && gameState !== GAME_STATE.playing) {
      onOver && onOver(gameState === GAME_STATE.overSuccess ? true : false, testTime);
    }
    setPrev(gameState);
  }, [gameState])

  const brokenEgg = (floor) => {
    const danger = Math.min(floor, dangerFloor);
    const newEggCount = eggCount - 1;
    setEggCount(newEggCount);
    setDangerFloor(danger);
    if (danger === safeFloor + 1) {
      gameOver(true);
    } else if (newEggCount === 0) {
      gameOver(false);
    }
  }

  const safeEgg = (floor) => {
    const safe = Math.max(floor, safeFloor);
    setSafeFloor(safe);
    if (safe === dangerFloor - 1) {
      gameOver(true);
    }
  }

  const eggConfirm = (broken, floor) => {
    setTestTime((time) => time + 1);
    setLog((log) => [...log, ({ broken, floor })]);
    if (broken) brokenEgg(floor);
    else safeEgg(floor);
  }

  const duckExperiment = (duckCount) => {
    const ducks = new Array(duckCount).fill().map(() => Math.random()).sort();
    let maxDist = 0;
    for (let i = 0; i < duckCount; i++) {
      maxDist = Math.max(((1 + ducks[(i + 1) % duckCount] - ducks[i]) % 1), maxDist);
    }
    // console.log(ducks, maxDist);
    if (maxDist >= 0.5) return true;
    else return false;
  }

  const multiTest = (repeatTime, duckCount) => {
    let successTime = 0;
    for (let i = 0; i < repeatTime; i++) {
      successTime += duckExperiment(duckCount);
    }
    return 1.0 * successTime / repeatTime;
  }


  const onFinish = (values) => {
    const { duckCount, repeatTime } = values;
    console.log('onFinish', values);
    const result = multiTest(repeatTime, duckCount);
    setEggCount(result);
    setLog((log) => [...log, ({ broken: result, floor: duckCount, repeatTime })]);
    inputNumberRef.current.focus();
  }
  const onFinishFailed = (b) => {
    console.log('onFinishFailed', b);
  }
  return (
    <div className="egg-play">
      <Form
        form={form}
        // layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        initialValues={{ duckCount: 4, repeatTime: 10000 }}
      >
        <Form.Item
          name="duckCount"
          label="鸭子数"
          rules={[
            { required: true },
            { type: 'number', min: 1 }
          ]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="repeatTime"
          label="重复数"
          rules={[
            { required: true },
            { type: 'number', min: 1 }
          ]}
        >
          <InputNumber step={10000} style={{ width: '100%' }} ref={inputNumberRef} />
        </Form.Item>
        <Button type="primary" htmlType="submit" disabled={gameState}>开始放鸭</Button>
        {gameState !== GAME_STATE.playing && <Form.Item>
          <Space>
            <Button type="primary" onClick={reset}>
              Reset
            </Button>
            {/*<Button htmlType="button">*/}
            {/*  Fill*/}
            {/*</Button>*/}
          </Space>
        </Form.Item>}
      </Form>

      <div>结果：{eggCount}</div>
      <div>历史记录：
        <div ref={logRef} style={{
          maxHeight: 200,
          fontSize: 16,
          'overflow-y': 'scroll',
        }}>{[...log].reverse().map(({ broken, floor, repeatTime }, idx) => {
          return <div key={idx}>{`${floor}鸭放${repeatTime}次，结果：${broken}`}</div>
        })}</div>
      </div>
    </div>
  );
}

export default DucksPlay;
