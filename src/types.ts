export type TodoItemId = string;
export type TemplateId = string;
export type CustomerId = string;

export type TodoItem = {
  id: TodoItemId;
  text: string;
};

export type TodoListTemplate = {
  id: TemplateId;
  name: string;
  items: TodoItem[];
};

export type CustomerChecklist = {
  listId: TemplateId;
  checked: Record<TodoItemId, boolean>;
};

export type Customer = {
  id: CustomerId;
  name: string;
  checklist: CustomerChecklist;
};

export type AppData = {
  templates: TodoListTemplate[];
  customers: Customer[];
};
