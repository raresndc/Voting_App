export interface PageableTemplate<T> {
    status(status: any): unknown
    content: T[]
    pageable: Pageable
    last: boolean
    totalElements: number
    totalPages: number
    size: number
    number: number
    sort: Sort
    first: boolean
    numberOfElements: number
    empty: boolean
  }

  export interface Pageable {
    sort: Sort
    offset: number
    pageSize: number
    pageNumber: number
    unpaged: boolean
    paged: boolean
  }

  export interface Sort {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }