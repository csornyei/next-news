export interface Feed {
  title: string;
  url: string;
  tags: string[];
}

export interface ArticleData {
  id: string;
  title: string;
  description: string;
  link: string;
  item: Item[];
}

export interface Item {
  title: string;
  link: string;
  description: string;
  category: string[] | string;
}

export interface LocalFeed extends Feed {
  id: string;
}

export interface Response {
  message: string | Object;
  error: string;
}
