export type ChapterModel = {
  id?: string;
  name?: string;
  position?: number;
};

export type BookModel = {
  id?: string;
  name?: string;
  status?: boolean;
  chapters?: ChapterModel[];
};
