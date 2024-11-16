export interface Tag {
  id: string;
  name: string;
}

export interface TagRelation {
  tag: Tag;
  child_tags: Tag[];
}
