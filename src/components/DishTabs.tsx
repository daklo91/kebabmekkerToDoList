import type { TemplateId, TodoListTemplate } from "../types";

type Props = {
  templates: TodoListTemplate[];
  selectedId: TemplateId;
  onSelect: (id: TemplateId) => void;
  onAdd: (name: string) => void;
  onRemove: (id: TemplateId) => void;
  onRename: (id: TemplateId, newName: string) => void;
};

function DishTabs({ templates, selectedId, onSelect, onAdd, onRemove, onRename }: Props) {
  return (
    <div className="flex space-x-2 mb-4">
      {templates.map((template) => (
        <div key={template.id} className="flex items-center space-x-1">
          <button
            onClick={() => onSelect(template.id)}
            className={template.id === selectedId ? "font-bold underline" : ""}
          >
            {template.name}
          </button>
          <button onClick={() => {
            const newName = prompt("New name:", template.name);
            if (newName?.trim()) onRename(template.id, newName.trim());
          }}>✏️</button>
          {templates.length > 1 && (
            <button onClick={() => onRemove(template.id)}>❌</button>
          )}
        </div>
      ))}
      <button onClick={() => {
        const name = prompt("Name of new dish:");
        if (name?.trim()) onAdd(name.trim());
      }}>➕ Add Dish</button>
    </div>
  );
}

export default DishTabs;
