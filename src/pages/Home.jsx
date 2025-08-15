import React from "react";
import "./Home.css";

export default function Home() {
  const sections = [
    { name: "Habitudes", emoji: "✔️", link: "/habits" },
    { name: "Objectifs", emoji: "🎯", link: "/goals" },
    { name: "Calendrier", emoji: "📅", link: "/calendar" },
    { name: "Lectures", emoji: "📚", link: "#" },
    { name: "Paramètres", emoji: "⚙️", link: "/settings" },
    { name: "Entraînement", emoji: "🏋️", link: "/training" },
    { name: "Santé", emoji: "🍏", link: "/health" },
    { name: "To-Do List", emoji: "📝", link: "/todo" },
  ];

  return (
    <div className="home-container">
      <h1 className="home-title">🧠 2ᵉ CERVEAU</h1>
      <p className="home-subtitle">
        Accède à toutes tes sections : objectifs, santé, entraînements, etc.
      </p>

      <div className="grid-container">
        {sections.map((section, index) => (
          <a key={index} href={section.link} className="card">
            <span className="emoji">{section.emoji}</span>
            <span className="card-title">{section.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
