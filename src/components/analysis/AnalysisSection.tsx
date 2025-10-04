import React from 'react';

interface AnalysisSectionProps {
  title: string;
  icon: string;
  items: { title: string; description: string }[];
  color: string;
}

export default function AnalysisSection({ title, icon, items, color }: AnalysisSectionProps) {
  return (
    <div className="bg-white bg-opacity-10 p-4 rounded-lg mb-4">
      <h3 className={`text-2xl mb-2 flex items-center font-clash text-white`}>
        <div className={`w-8 h-8 mr-2 bg-${color} text-white flex items-center justify-center font-bold rounded-md`}>{icon}</div>
        {title}
      </h3>
      <ul className="list-disc list-inside">
        {items.map((item, i) => (
          <li key={i}><strong>{item.title}:</strong> {item.description}</li>
        ))}
      </ul>
    </div>
  );
}
