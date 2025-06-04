import type { TemplateItem } from "../types";
import { useState } from "react";

type Props = {
  optionalItems: TemplateItem[];
  alreadyAddedIds: string[];
  onConfirm: (selected: TemplateItem[]) => void;
  onClose: () => void;
};

function OptionalModal({ optionalItems, alreadyAddedIds, onConfirm, onClose }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selected = optionalItems.filter(item => selectedIds.includes(item.id));
    onConfirm(selected);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80">
        <h2 className="text-lg font-bold mb-4">Velg ekstra</h2>
        <ul className="space-y-2">
          {optionalItems.map(item => (
            <li key={item.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                disabled={alreadyAddedIds.includes(item.id)}
                checked={selectedIds.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
              />
              <span>{item.text}</span>
              {item.price !== undefined && (
                <span className="text-sm text-gray-500">({item.price} kr)</span>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onClose}>Avbryt</button>
          <button onClick={handleConfirm}>Legg til</button>
        </div>
      </div>
    </div>
  );
}

export default OptionalModal;
