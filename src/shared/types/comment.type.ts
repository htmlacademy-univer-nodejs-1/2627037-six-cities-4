export type Comment = {
  text: string; // length 5..1024
  publicationDate: Date;
  rating: number; // values 1..5
  authorLink: string; // link or GUID
}
