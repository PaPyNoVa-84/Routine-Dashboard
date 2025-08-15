import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Calendar, Target, ListTodo, HeartPulse, Settings, Dumbbell, ClipboardList } from "lucide-react";

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Bienvenue dans ton 2ᵉ CERVEAU 🧠</h1>
      <p className="text-gray-400 mb-6">
        Accède à toutes tes sections : objectifs, santé, entraînements, etc.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/calendar">
          <Card className="hover:bg-gray-800 transition">
            <CardContent className="flex items-center gap-4 p-6">
              <Calendar size={32} className="text-blue-400" />
              <span className="text-lg font-medium">Calendrier</span>
            </CardContent>
          </Card>
        </Link>

        <Link to="/goals">
          <Card className="hover:bg-gray-800 transition">
            <CardContent className="flex items-center gap-4 p-6">
              <Target size={32} className="text-pink-400" />
              <span className="text-lg font-medium">Objectifs</span>
            </CardContent>
          </Card>
        </Link>

        <Link to="/habits">
          <Card className="hover:bg-gray-800 transition">
            <CardContent className="flex items-center gap-4 p-6">
              <ClipboardList size={32} className="text-purple-400" />
              <span className="text-lg font-medium">Habitudes</span>
            </CardContent>
          </Card>
        </Link>

        <Link to="/health">
          <Card className="hover:bg-gray-800 transition">
            <CardContent className="flex items-center gap-4 p-6">
              <HeartPulse size={32} className="text-red-400" />
              <span className="text-lg font-medium">Santé</span>
            </CardContent>
          </Card>
        </Link>

        <Link to="/settings">
          <Card className="hover:bg-gray-800 transition">
            <CardContent className="flex items-center gap-4 p-6">
              <Settings size={32} className="text-gray-400" />
              <span className="text-lg font-medium">Paramètres</span>
            </CardContent>
          </Card>
        </Link>

        <Link to="/todo">
          <Card className="hover:bg-gray-800 transition">
            <CardContent className="flex items-center gap-4 p-6">
              <ListTodo size={32} className="text-yellow-400" />
              <span className="text-lg font-medium">To-Do</span>
            </CardContent>
          </Card>
        </Link>

        <Link to="/training">
          <Card className="hover:bg-gray-800 transition">
            <CardContent className="flex items-center gap-4 p-6">
              <Dumbbell size={32} className="text-green-400" />
              <span className="text-lg font-medium">Entraînement</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
