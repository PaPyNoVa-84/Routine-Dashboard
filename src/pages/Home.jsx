import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1>Bienvenue dans ton 2ᵉ CERVEAU 🧠</h1>
      <p>
        Ici, tu peux accéder à toutes tes sections : objectifs, santé,
        entraînements, etc.
      </p>

      <nav style={{ marginTop: "2rem" }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/calendar" style={{ color: "#4fc3f7" }}>📅 Calendrier</Link></li>
          <li><Link to="/goals" style={{ color: "#4fc3f7" }}>🎯 Objectifs</Link></li>
          <li><Link to="/habits" style={{ color: "#4fc3f7" }}>🔁 Habitudes</Link></li>
          <li><Link to="/health" style={{ color: "#4fc3f7" }}>💪 Santé</Link></li>
          <li><Link to="/settings" style={{ color: "#4fc3f7" }}>⚙️ Paramètres</Link></li>
          <li><Link to="/todo" style={{ color: "#4fc3f7" }}>📝 To-Do</Link></li>
          <li><Link to="/training" style={{ color: "#4fc3f7" }}>🏋️ Entraînement</Link></li>
        </ul>
      </nav>
    </div>
  );
}
