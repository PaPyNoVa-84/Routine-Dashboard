import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaBullseye, FaClipboardList, FaHeart, FaCog, FaCheckSquare, FaDumbbell, FaAppleAlt } from 'react-icons/fa';

export default function Home() {
  const cards = [
    {
      icon: <FaCheckSquare size={40} className="text-gray-700" />,
      title: 'Mes habitudes',
      subtitle: 'Suivi de tes habitudes',
      link: '/habits'
    },
    {
      icon: <FaBullseye size={40} className="text-gray-700" />,
      title: 'Mes objectifs',
      subtitle: 'Planification de tes objectifs',
      link: '/goals'
    },
    {
      icon: <FaCalendarAlt size={40} className="text-gray-700" />,
      title: 'Mon calendrier',
      subtitle: 'Vue d’ensemble de tes événements',
      link: '/calendar'
    },
    {
      icon: <FaClipboardList size={40} className="text-gray-700" />,
      title: 'Ma To-Do List',
      subtitle: 'Gérer tes tâches',
      link: '/todo'
    },
    {
      icon: <FaCog size={40} className="text-gray-700" />,
      title: 'Paramètres',
      subtitle: 'Personnalise ton espace',
      link: '/settings'
    },
    {
      icon: <FaDumbbell size={40} className="text-gray-700" />,
      title: 'Entraînement',
      subtitle: 'Suivi de tes séances sportives',
      link: '/training'
    },
    {
      icon: <FaAppleAlt size={40} className="text-gray-700" />,
      title: 'Santé',
      subtitle: 'Suivi santé & bien-être',
      link: '/health'
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">
        Bienvenue dans ton 2ᵉ CERVEAU <span role="img" aria-label="brain">🧠</span>
      </h1>
      <p className="text-gray-400 mb-8">
        Accède à toutes tes sections : objectifs, santé, entraînements, etc.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-200"
          >
            {card.icon}
            <h2 className="text-lg font-semibold mt-4">{card.title}</h2>
            <p className="text-gray-500 text-sm">{card.subtitle}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
