import { Tag } from '../tag';

export interface Memo {
  id: string;
  /**
   * 메모 원본 내용 (현재는 텍스트만 지원)
   */
  content: string;
  image_urls: string[];
  voice_urls: string[];
  metadata: string | null;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}
