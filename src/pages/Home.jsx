import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaBullseye, FaClipboardList, FaHeart, FaCog, FaCheckSquare, FaDumbbell, FaAppleAlt } from "react-icons/fa";

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">
        Bienvenue dans ton 2ᵉ CERVEAU <span role="img" aria-label="cerveau">🧠</span>
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Accède à toutes tes sections : objectifs, santé, entraînements, etc.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/habits" className="card">
          <FaCheckSquare className="card-icon" />
          <span>MES HABITUDES</span>
        </Link>

        <Link to="/goals" className="card">
          <FaBullseye className="card-icon" />
          <span>MES OBJECTIFS</span>
        </Link>

        <Link to="/calendar" className="card">
          <FaCalendarAlt className="card-icon" />
          <span>CALENDRIER</span>
        </Link>

        <Link to="/todo" className="card">
          <FaClipboardList className="card-icon" />
          <span>TO-DO LIST</span>
        </Link>

        <Link to="/settings" className="card">
          <FaCog className="card-icon" />
          <span>PARAMÈTRES</span>
        </Link>

        <Link to="/training" className="card">
          <FaDumbbell className="card-icon" />
          <span>ENTRAÎNEMENTS</span>
        </Link>

        <Link to="/health" className="card">
          <FaAppleAlt className="card-icon" />
          <span>SANTÉ</span>
        </Link>
      </div>
    </div>
  );
}
