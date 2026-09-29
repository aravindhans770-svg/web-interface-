import { useState } from "react";
import { ADMIN_PASSWORD } from "./store.js";

export default function AdminLogin({ onSuccess }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) onSuccess();
    else setError("Incorrect password. Try again.");
  };

  return (
    <form className="lookup login" onSubmit={submit}>
      <label>
        Admin password
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
      </label>
      <button className="primary" type="submit">Sign in</button>
      {error && <p className="error" role="alert">{error}</p>}
    </form>
  );
}
