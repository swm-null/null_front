import { Tag } from '../MemoInterface';

export interface TagRelation {
  tag: Tag;
  child_tags: Tag[];
}
