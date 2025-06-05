import type { TemplateItem } from "../types";
import { useState } from "react";

type Props = {
  optionalItems: TemplateItem[];
  alreadyAddedIds: string[];
  onConfirm: (selected: TemplateItem[]) => void;
  onClose: () => void;
};

function OptionalModal({
  optionalItems,
  alreadyAddedIds,
  onConfirm,
  onClose,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selected = optionalItems.filter((item) =>
      selectedIds.includes(item.id)
    );
    onConfirm(selected);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-primary text-text-color p-6 rounded-xl shadow-xl w-80">
        <h2 className="text-lg font-bold mb-4">Velg ekstra</h2>
        <ul className="space-y-2">
          {optionalItems.map((item) => (
            <li key={item.id} className="flex items-center space-x-2">
              <div
                onClick={() => {
                  if (!alreadyAddedIds.includes(item.id)) toggleSelect(item.id);
                }}
                className={`cursor-pointer ${
                  alreadyAddedIds.includes(item.id)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {alreadyAddedIds.includes(item.id) ? (
                  // Disabled SVG
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#888"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-square-slash"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="3" x2="21" y2="21" />
                  </svg>
                ) : selectedIds.includes(item.id) ? (
                  // Checked SVG
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f08f00"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-square-check-big"
                  >
                    <path d="M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                ) : (
                  // Unchecked SVG
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f08f00"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-square"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                  </svg>
                )}
              </div>

              <span>{item.text}</span>

              {item.price !== undefined && (
                <span className="text-sm text-amber-100">
                  ({item.price} kr)
                </span>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="bg-primary-dark py-2 px-4 rounded-md"
            onClick={onClose}
          >
            Avbryt
          </button>
          <button
            className="bg-secondary hover:bg-secondary-dark text-text-color py-2 px-4 rounded-lg border-[1px] border-primary-dark bg-primary-color flex gap-2 items-center"
            onClick={handleConfirm}
          >
            Legg til
          </button>
        </div>
      </div>
    </div>
  );
}

export default OptionalModal;
