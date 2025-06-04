import type { Template } from "../types";

type Props = {
  templates: Template[];
  onSelect: (template: Template) => void;
  onClose: () => void;
};

function TemplatePickerModal({ templates, onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80">
        <h2 className="text-lg font-bold mb-4">Velg rett</h2>

        <ul className="space-y-2 mb-4">
          {templates.map(template => (
            <li key={template.id}>
              <button
                className="w-full text-left p-2 border rounded hover:bg-gray-100"
                onClick={() => onSelect(template)}
              >
                {template.name}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-end">
          <button onClick={onClose}>Avbryt</button>
        </div>
      </div>
    </div>
  );
}

export default TemplatePickerModal;
