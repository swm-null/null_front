export interface Tag {
  id: string;
  name: string;
}

export interface Memo {
  id: string;
  /**
   * 메모 원본 내용 (현재는 텍스트만 지원)
   */
  content: string;
  image_urls: string[] | null;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}
