import { Tag, TagRelation } from 'pages/home/subPages/interfaces';
import { paginationData } from 'pages/home/subPages/api';

export interface paginationDashboardTagRelations extends paginationData {
  tag: Tag;
  tag_relations: TagRelation[];
}
