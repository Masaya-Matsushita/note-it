export type Badge =
  | '学校'
  | '試験'
  | '研究'
  | '資格'
  | '研鑽'
  | '教養'
  | '趣味'
  | 'その他'

export type Book = {
  badgeId: string
  badge: Badge
  bookId: string
  title: string
  overview: string
}

export type Books = { id: string; title: string; overview: string }[]

export type Notes = { id: string; label: string; page: number }[]

export type BadgeAndBooksList = {
  badge: { id: string; badge: Badge }
  books: Books
}[]

export type BookAndNotes = {
  book: Book
  notes: Notes
}
