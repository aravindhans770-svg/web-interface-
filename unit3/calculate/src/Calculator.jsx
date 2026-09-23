import { useState } from "react";
import "./Calculator.css";

function Calculator() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState("");

  const calculate = (op) => {
    if (num1.trim() === "" || num2.trim() === "") {
      setResult("Please enter both numbers");
      return;
    }

    let a = Number(num1);
    let b = Number(num2);

    if (isNaN(a) || isNaN(b)) {
      setResult("Invalid input");
      return;
    }

    if (op === "+") setResult(a + b);
    if (op === "-") setResult(a - b);
    if (op === "*") setResult(a * b);
    if (op === "/") {
      setResult(b === 0 ? "Cannot divide by 0" : a / b);
    }
  };

  const handleClear = () => {
    setNum1("");
    setNum2("");
    setResult("");
  };

  return (
    <div className="calc-card">
      <h1 className="calc-title">Simple Calculator</h1>

      <div className="calc-inputs">
        <div className="calc-input-group">
          <label className="calc-label">First number</label>
          <input
            className="calc-input"
            type="number"
            placeholder="e.g. 10"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
          />
        </div>

        <div className="calc-input-group">
          <label className="calc-label">Second number</label>
          <input
            className="calc-input"
            type="number"
            placeholder="e.g. 5"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
          />
        </div>
      </div>

      <div className="calc-buttons">
        <button className="calc-btn" onClick={() => calculate("+")} title="Add">+</button>
        <button className="calc-btn" onClick={() => calculate("-")} title="Subtract">-</button>
        <button className="calc-btn" onClick={() => calculate("*")} title="Multiply">×</button>
        <button className="calc-btn" onClick={() => calculate("/")} title="Divide">÷</button>
        <button className="calc-btn calc-btn-clear" onClick={handleClear} title="Clear">Clear</button>
      </div>

      <div className="calc-result-box">
        <div className="calc-result-label">Result</div>
        <div className="calc-result-value">{result !== "" ? result : "—"}</div>
      </div>
    </div>
  );
}

export default Calculator;
