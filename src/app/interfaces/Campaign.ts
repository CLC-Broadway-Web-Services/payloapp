export interface Campaign {
  id?: string,
  company: string,
  completedHits: number,
  hits: number,
  platform: string,
  platformTask: string,
  status: string,
  url: string,
  pointPerTask: number,
  createdAt: number,
  howToTask: {
    title: string,
    image: string,
    description: string
  }
}
