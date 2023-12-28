// input.ts
export interface Post {
  postId: string;
  userId: string;
  title: string;
  description: string;
  tags: string[];
  createDate: Date;
}