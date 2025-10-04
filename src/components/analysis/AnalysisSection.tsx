import React from 'react';

interface AnalysisSectionProps {
  title: string;
  icon: string;
  items: { title: string; description: string }[];
  color: string;
  handleSynergyHover?: (cardNames: string[]) => void;
}

export default function AnalysisSection({ title, icon, items, color, handleSynergyHover }: AnalysisSectionProps) {
  const getCardNamesFromDescription = (description: string): string[] => {
    // This is a very basic attempt to extract card names. 
    // A more robust solution would involve a list of all card names and regex matching.
    const cardNames: string[] = [];
    const potentialCardNames = description.match(/\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b/g) || [];
    // For now, let's assume card names are capitalized words.
    // In a real app, you'd have a definitive list of card names to check against.
    return potentialCardNames.filter(name => name.length > 2); // Filter out short words
  };

  return (
    <div className="bg-white bg-opacity-10 p-4 rounded-lg mb-4">
      <h3 className={`text-2xl mb-2 flex items-center font-clash text-white`}>
        <div className={`w-8 h-8 mr-2 bg-${color} text-white flex items-center justify-center font-bold rounded-md`}>{icon}</div>
        {title}
      </h3>
      <ul className="list-disc list-inside">
        {items.map((item, i) => (
          <li 
            key={i}
            onMouseEnter={() => handleSynergyHover && handleSynergyHover(getCardNamesFromDescription(item.description))}
            onMouseLeave={() => handleSynergyHover && handleSynergyHover([])}
          >
            <strong>{item.title}:</strong> {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
