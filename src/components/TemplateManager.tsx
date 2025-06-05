import type { Template } from "../types";

type Props = {
  templates: Template[];
  selectedTemplateId: string | null;
  setSelectedTemplateId: (id: string) => void;
  updateTemplate: (t: Template) => void;
  deleteTemplate: (id: string) => void;
  createTemplate: () => void;
};

const RemoveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

function TemplateManager({
  templates,
  selectedTemplateId,
  setSelectedTemplateId,
  updateTemplate,
  deleteTemplate,
  createTemplate,
}: Props) {
  const template = templates.find((t) => t.id === selectedTemplateId);

  return (
    <div className="p-4 border rounded space-y-4">
      <h2 className="text-xl font-bold mb-2">Template Manager</h2>

      {!template ? (
        <div>
          <p className="mb-2">Ingen mal valgt.</p>
          <button
            onClick={createTemplate}
            className="bg-primary hover:bg-primary-dark text-white font-bold border border-primary-dark rounded-full py-2 px-4"
          >
            ➕ Ny mal
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {templates.map((t) => (
              <div
                key={t.id}
                className={`${
                  t.id === selectedTemplateId
                    ? "bg-secondary hover:bg-secondary-dark"
                    : "bg-primary hover:bg-primary-dark"
                } text-white font-bold border border-primary-dark rounded-md py-2 px-4 flex items-center space-x-2`}
              >
                <button onClick={() => setSelectedTemplateId(t.id)}>
                  {t.name}
                </button>
                <button onClick={() => deleteTemplate(t.id)}>
                  <RemoveIcon />
                </button>
              </div>
            ))}
            <button
              onClick={createTemplate}
              className="bg-primary hover:bg-primary-dark border border-primary-dark rounded-full py-2 px-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
          </div>

          <div className="flex items-end space-x-4">
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
            <h3 className="font-semibold mt-4">Arbeidsflyt</h3>
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
                  <RemoveIcon />
                </button>
              </div>
            ))}
            <div className="mt-2">
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
                className="mt-2 bg-secondary hover:bg-secondary-dark text-text-color py-2 px-4 rounded-lg border border-primary-dark flex gap-2 items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-[2px]"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Legg til obligatorisk
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mt-4">Ekstra</h3>
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
                  <RemoveIcon />
                </button>
              </div>
            ))}
            <div className="mt-2">
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
                className="mt-2 bg-secondary hover:bg-secondary-dark text-text-color py-2 px-4 rounded-lg border border-primary-dark flex gap-2 items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-[2px]"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Legg til ekstra
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TemplateManager;
