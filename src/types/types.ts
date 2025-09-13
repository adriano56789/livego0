export interface Stream {
  id: number;
  title: string;
  streamer: string;
  viewers: number;
  country: 'br' | 'us';
  imageUrl: string;
  tags: string[];
}
