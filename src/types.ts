export type Id = string | number;

export type column = {
  id: Id;
  title: string;
};

export type Tasks = {
  id: Id;
  columnId: Id;
  content: string;
};
