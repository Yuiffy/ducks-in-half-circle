import { useState } from "react";
import DucksPlay from "./DucksPlay";
import 'antd/dist/antd.css';

function Index() {
  const [playCount, setPlayCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [maxStep, setMaxStep] = useState(-1);
  const [sumStep, setSumStep] = useState(0);
  return (
    <div className="App">
      <header className="App-header">
        <div>说明：用蒙特卡罗方法多次随机来计算n只鸭子随机分布在圆形泳池，全部在一个半边的概率。</div>
        <div
          // style={{width: 300}}
        >
          <DucksPlay
            onOver={(success, stepCount) => {

            }}
          />
        </div>
      </header>
    </div>
  );
}

export default Index;
