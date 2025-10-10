"use client";
import { useEffect, useState } from "react";

type Vehicle = any;
type Driver = any;
type Trip = any;

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [vPlate, setVPlate] = useState("");
  const [vModel, setVModel] = useState("");
  const [vYear, setVYear] = useState<number | "">("");
  const [vKm, setVKm] = useState<number | "">("");
  const [dName, setDName] = useState("");
  const [dLicense, setDLicense] = useState("");
  const [tVehicle, setTVehicle] = useState("");
  const [tDriver, setTDriver] = useState("");
  const [tOrigin, setTOrigin] = useState("");
  const [tDestination, setTDestination] = useState("");

  useEffect(() => {
    const s = typeof window !== "undefined" ? sessionStorage.getItem("logimax_user") : null;
    setUser(s);
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [vRes, dRes, tRes] = await Promise.all([
        fetch("/api/vehicles"),
        fetch("/api/drivers"),
        fetch("/api/trips"),
      ]);

      if (!vRes.ok || !dRes.ok || !tRes.ok) throw new Error("Erro ao buscar dados");

      setVehicles(await vRes.json());
      setDrivers(await dRes.json());
      setTrips(await tRes.json());
    } catch (e) {
      console.error(e);
      alert("Erro ao carregar dados. Verifique o banco de dados.");
    } finally {
      setLoading(false);
    }
  }

  async function createVehicle() {
    if (!vPlate || !vModel || !vYear || vKm === "") return alert("Preencha todos os campos");
    await fetch("/api/vehicles", {
      method: "POST",
      body: JSON.stringify({ plate: vPlate, model: vModel, year: Number(vYear), km: Number(vKm) }),
      headers: { "Content-Type": "application/json" },
    });
    setVPlate(""); setVModel(""); setVYear(""); setVKm("");
    fetchAll();
  }

  async function createDriver() {
    if (!dName || !dLicense) return alert("Preencha todos os campos");
    await fetch("/api/drivers", {
      method: "POST",
      body: JSON.stringify({ name: dName, license: dLicense }),
      headers: { "Content-Type": "application/json" },
    });
    setDName(""); setDLicense("");
    fetchAll();
  }

  async function createTrip() {
    if (!tVehicle || !tDriver || !tOrigin || !tDestination) return alert("Preencha todos os campos");
    await fetch("/api/trips", {
      method: "POST",
      body: JSON.stringify({ vehicleId: tVehicle, driverId: tDriver, origin: tOrigin, destination: tDestination }),
      headers: { "Content-Type": "application/json" },
    });
    setTVehicle(""); setTDriver(""); setTOrigin(""); setTDestination("");
    fetchAll();
  }

  async function finalize(tripId: string) {
    const km = prompt("Informe a quilometragem atual do veículo:");
    if (km === null) return;
    const kmNum = Number(km);
    if (isNaN(kmNum)) return alert("Número inválido");
    await fetch(`/api/trips/${tripId}`, {
      method: "PUT",
      body: JSON.stringify({ finalize: true, kmAtEnd: kmNum }),
      headers: { "Content-Type": "application/json" },
    });
    fetchAll();
  }

  async function setMaintenance(vehicleId: string) {
    await fetch(`/api/vehicles/${vehicleId}`, { method: "PATCH" });
    fetchAll();
  }

  return (
    <main style={{
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f6f8",
      minHeight: "100vh",
      padding: "20px"
    }}>
      <h1 style={{ textAlign: "center", color: "#2b3a67" }}>🚛 LogiMax Fleet Manager</h1>
      <p style={{ textAlign: "center" }}>Usuário: <strong>{user ?? "Anônimo"}</strong></p>

      {loading && <p style={{ textAlign: "center" }}>Carregando...</p>}

      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px",
        marginTop: "30px"
      }}>
        {/* VEÍCULOS */}
        <div style={card}>
          <h2 style={cardTitle}>🚗 Veículos</h2>
          <div style={inputGroup}>
            <input placeholder="Placa" value={vPlate} onChange={e => setVPlate(e.target.value)} style={input} />
            <input placeholder="Modelo" value={vModel} onChange={e => setVModel(e.target.value)} style={input} />
            <input
              placeholder="Ano"
              value={vYear === "" ? "" : String(vYear)}
              onChange={e => {
                const val = e.target.value;
                setVYear(val === "" ? "" : Number(val));
              }}
              style={input}
            />
            <input
              placeholder="Km"
              value={vKm === "" ? "" : String(vKm)}
              onChange={e => {
                const val = e.target.value;
                setVKm(val === "" ? "" : Number(val));
              }}
              style={input}
            />
            <button onClick={createVehicle} style={buttonPrimary}>Adicionar</button>
          </div>
          <ul>
            {vehicles.map((v: any) => (
              <li key={v._id} style={listItem}>
                <strong>{v.plate}</strong> — {v.model} ({v.year})  
                <br />Km: {v.km}  
                {v.needsMaintenance && <span style={{ color: "red" }}> ⚠️ Manutenção</span>}
                <br />
                <button onClick={() => setMaintenance(v._id)} style={buttonSmall}>Registrar manutenção</button>
              </li>
            ))}
          </ul>
        </div>

        {/* MOTORISTAS */}
        <div style={card}>
          <h2 style={cardTitle}>🧍 Motoristas</h2>
          <div style={inputGroup}>
            <input placeholder="Nome" value={dName} onChange={e => setDName(e.target.value)} style={input} />
            <input placeholder="CNH" value={dLicense} onChange={e => setDLicense(e.target.value)} style={input} />
            <button onClick={createDriver} style={buttonPrimary}>Adicionar</button>
          </div>
          <ul>
            {drivers.map((d: any) => (
              <li key={d._id} style={listItem}>
                <strong>{d.name}</strong> — CNH: {d.license}
              </li>
            ))}
          </ul>
        </div>

        {/* VIAGENS */}
        <div style={card}>
          <h2 style={cardTitle}>🛣️ Viagens</h2>
          <div style={inputGroup}>
            <select value={tVehicle} onChange={e => setTVehicle(e.target.value)} style={input}>
              <option value="">-- Veículo --</option>
              {vehicles.map((v: any) => <option key={v._id} value={v._id}>{v.plate}</option>)}
            </select>
            <select value={tDriver} onChange={e => setTDriver(e.target.value)} style={input}>
              <option value="">-- Motorista --</option>
              {drivers.map((d: any) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
            <input placeholder="Origem" value={tOrigin} onChange={e => setTOrigin(e.target.value)} style={input} />
            <input placeholder="Destino" value={tDestination} onChange={e => setTDestination(e.target.value)} style={input} />
            <button onClick={createTrip} style={buttonPrimary}>Criar</button>
          </div>
          <ul>
            {trips.map((t: any) => (
              <li key={t._id} style={listItem}>
                <strong>{t.origin} → {t.destination}</strong><br />
                Veículo: {vehicles.find((v: any) => v._id === t.vehicleId)?.plate ?? "N/A"}<br />
                Motorista: {drivers.find((d: any) => d._id === t.driverId)?.name ?? "N/A"}<br />
                Status: <strong>{t.status}</strong><br />
                {t.status !== "Finalizada" && (
                  <button onClick={() => finalize(t._id)} style={buttonSmall}>Finalizar</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

/* --- ESTILOS REUTILIZÁVEIS --- */
const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const cardTitle = {
  color: "#2b3a67",
  borderBottom: "2px solid #e0e0e0",
  paddingBottom: "8px",
  marginBottom: "10px",
};

const inputGroup = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "6px",
  marginBottom: "12px",
};

const input = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const buttonPrimary = {
  backgroundColor: "#2b3a67",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "8px",
  cursor: "pointer",
};

const buttonSmall = {
  ...buttonPrimary,
  backgroundColor: "#455a89",
  marginTop: "6px",
  padding: "6px 10px",
};

const listItem = {
  marginBottom: "12px",
  borderBottom: "1px solid #ddd",
  paddingBottom: "8px",
};
