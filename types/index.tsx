export type Badge =
  | ''
  | '学校'
  | '試験'
  | '研究'
  | '資格'
  | '研鑽'
  | '教養'
  | '趣味'
  | 'その他'

export type Book = {
  badge: Badge
  title: string
  overview: string
}

export type Books = { id: string; title: string; overview: string }[]

export type Note = {
  id: string
  label: string
  page: number
  note: string
  clozeNote: string
}

export type Notes = {
  id: string
  label: string
  page: number
  note: string
  clozeNote: string
}[]

export type BadgeAndBooksList = {
  priority: number
  badge: Badge
  books: Books
}[]

export type BookAndNotes = {
  book: Book
  notes: Notes
}
