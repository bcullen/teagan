export interface GalleryItem {
  id: number
  type: "image" | "video"
  src?: string
  videoId?: string
  alt: string
  title: string
}

export interface Gallery {
  id: string
  name: string
  description: string
  thumbnailId?: number // ID of the item to use as thumbnail
  tags: string[] // Array of tags for the competition
  year?: number // Optional year of the competition
  competitionName?: string // Optional name of the competition
  awards?: string // Optional awards received
  choreographer?: string // Optional choreographer name
  studio?: string // Optional studio name
  team?: string // Optional team name
  items: GalleryItem[]
  createdAt: number // timestamp
}

export interface GalleryState {
  galleries: Gallery[]
  activeGalleryId: string | null
}

