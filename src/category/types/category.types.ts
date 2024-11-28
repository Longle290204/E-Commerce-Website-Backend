export type NestedCategory = {
  id: string;
  name: string;
  subcategories: NestedCategory[];
};
