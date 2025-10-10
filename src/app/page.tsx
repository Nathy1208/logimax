"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return alert("Digite seu nome");
    if (typeof window !== "undefined") sessionStorage.setItem("logimax_user", name);
    router.push("/dashboard");
  }

  return (
    <main style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>LogiMax Fleet Manager — Login</h1>
      <form onSubmit={handleLogin} style={{ maxWidth: 400 }}>
        <label>Nome do usuário (gestor ou motorista):</label>
        <input value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 8 }} />
        <button style={{ marginTop: 12, padding: "8px 12px" }} type="submit">Entrar</button>
      </form>
    </main>
  );
}
