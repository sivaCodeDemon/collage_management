import apiClient from './apiClient';
import { ApiResponse, Book } from '@/types';
import { MOCK_BOOKS } from './mockData';

let localBooks: Book[] = [...MOCK_BOOKS];

export const libraryService = {
  getAll: async (search?: string): Promise<ApiResponse<Book[]>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<Book[]>>('/library/books', { params: { search } });
      return data;
    } catch {
      let books = [...localBooks];
      if (search) {
        const q = search.toLowerCase();
        books = books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
      }
      return {
        success: true,
        message: 'Books fetched',
        data: books,
        timestamp: new Date().toISOString()
      };
    }
  },

  issueBook: async (bookId: number): Promise<ApiResponse<Book>> => {
    try {
      const { data } = await apiClient.post<ApiResponse<Book>>(`/library/books/${bookId}/issue`);
      return data;
    } catch {
      const book = localBooks.find(b => b.id === bookId);
      if (book && book.availableCopies > 0) {
        book.availableCopies -= 1;
        return {
          success: true,
          message: 'Book issued successfully',
          data: book,
          timestamp: new Date().toISOString()
        };
      }
      throw new Error('No available copies');
    }
  },

  returnBook: async (bookId: number): Promise<ApiResponse<Book>> => {
    try {
      const { data } = await apiClient.post<ApiResponse<Book>>(`/library/books/${bookId}/return`);
      return data;
    } catch {
      const book = localBooks.find(b => b.id === bookId);
      if (book) {
        book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
        return {
          success: true,
          message: 'Book returned successfully',
          data: book,
          timestamp: new Date().toISOString()
        };
      }
      throw new Error('Book not found');
    }
  }
};
