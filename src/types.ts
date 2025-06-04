export type ItemId = string;
export type TemplateId = string;
export type OrderId = string;

export type TemplateItem = {
  id: ItemId;
  text: string;
  price?: number;
};

export type Template = {
  id: string;
  name: string;
  basePrice?: number;
  requiredItems: TemplateItem[];
  optionalItems: TemplateItem[];
};

export type OrderItem = {
  id: ItemId;
  text: string;
  price?: number;
  checked: boolean;
};

export type Order = {
  id: OrderId;
  templateId: TemplateId;
  name: string;
  items: OrderItem[];
};

export type AppData = {
  templates: Template[];
  orders: Order[];
};
