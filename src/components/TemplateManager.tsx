import type { Template } from "../types";

type Props = {
  templates: Template[];
  selectedTemplateId: string | null;
  setSelectedTemplateId: (id: string) => void;
  updateTemplate: (template: Template) => void;
  deleteTemplate: (id: string) => void;
  createTemplate: () => void;
};

function TemplateManager({
  templates,
  selectedTemplateId,
  setSelectedTemplateId,
  updateTemplate,
  deleteTemplate,
  createTemplate,
}: Props) {
  const template = templates.find((t) => t.id === selectedTemplateId) ?? null;

  return (
    <div className="p-4 border rounded space-y-4">
      <h2 className="text-xl font-bold">Template Manager</h2>

      {!template ? (
        <div>
          <p className="mb-2">Ingen mal valgt.</p>
          <button onClick={createTemplate}>➕ Ny mal</button>
        </div>
      ) : (
        <>
          <div className="flex space-x-2 mb-4 flex-wrap">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplateId(t.id)}
                className={t.id === selectedTemplateId ? "font-bold underline" : ""}
              >
                {t.name}
              </button>
            ))}
            <button onClick={() => deleteTemplate(template.id)}>🗑️ Slett</button>
            <button onClick={createTemplate}>➕ Ny mal</button>
          </div>

          <div className="flex items-center space-x-4">
            <div>
                <label className="block font-semibold">Navn:</label>
                <input
                className="border px-2 py-1"
                value={template.name}
                onChange={(e) =>
                    updateTemplate({ ...template, name: e.target.value })
                }
                />
            </div>

            <div>
                <label className="block font-semibold">Pris (grunnpris):</label>
                <input
                type="number"
                className="border px-2 py-1 w-24"
                placeholder="kr"
                value={template.basePrice ?? ""}
                onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    updateTemplate({
                    ...template,
                    basePrice: isNaN(val) ? undefined : val,
                    });
                }}
                />
            </div>
            </div>


          <div>
            <h3 className="font-semibold mt-4">Obligatoriske</h3>
            {template.requiredItems.map((item, i) => (
              <div key={item.id} className="flex space-x-2 mb-2">
                <input
                    placeholder="Navn"
                    value={item.text}
                    onChange={(e) => {
                    const newItems = [...template.requiredItems];
                    newItems[i] = { ...newItems[i], text: e.target.value };
                    updateTemplate({ ...template, requiredItems: newItems });
                    }}
                    className="border px-2 py-1 flex-1"
                />
                <button
                    onClick={() => {
                    const newItems = [...template.requiredItems];
                    newItems.splice(i, 1);
                    updateTemplate({ ...template, requiredItems: newItems });
                    }}
                >
                    ❌
                </button>
                </div>

            ))}
            <button
              onClick={() =>
                updateTemplate({
                  ...template,
                  requiredItems: [
                    ...template.requiredItems,
                    { id: crypto.randomUUID(), text: "", price: undefined },
                  ],
                })
              }
            >
              ➕ Legg til
            </button>
          </div>

          <div>
            <h3 className="font-semibold mt-4">Valgfrie</h3>
            {template.optionalItems.map((item, i) => (
              <div key={item.id} className="flex space-x-2 mb-2">
                <input
                  placeholder="Navn"
                  value={item.text}
                  onChange={(e) => {
                    const newItems = [...template.optionalItems];
                    newItems[i] = { ...newItems[i], text: e.target.value };
                    updateTemplate({ ...template, optionalItems: newItems });
                  }}
                  className="border px-2 py-1 flex-1"
                />
                <input
                  placeholder="Pris"
                  type="number"
                  value={item.price ?? ""}
                  onChange={(e) => {
                    const newItems = [...template.optionalItems];
                    const val = parseFloat(e.target.value);
                    newItems[i] = {
                      ...newItems[i],
                      price: isNaN(val) ? undefined : val,
                    };
                    updateTemplate({ ...template, optionalItems: newItems });
                  }}
                  className="border px-2 py-1 w-24"
                />
                <button
                  onClick={() => {
                    const newItems = [...template.optionalItems];
                    newItems.splice(i, 1);
                    updateTemplate({ ...template, optionalItems: newItems });
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                updateTemplate({
                  ...template,
                  optionalItems: [
                    ...template.optionalItems,
                    { id: crypto.randomUUID(), text: "", price: undefined },
                  ],
                })
              }
            >
              ➕ Legg til
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TemplateManager;
