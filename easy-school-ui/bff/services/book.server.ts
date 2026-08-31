'use server';
import { bffApiClient } from "@/app/config/clientAPI";
import { bearerHeaders } from "@/app/lib/authz.server";
import { BookModel } from "@/app/lib/definitions/books_definitions";

const clientApi = bffApiClient.resource('/books');

/**
 * Fetches all books (with their chapters).
 *
 * Calls the API exposed by `/app/api/(bff)/books/route.ts` (GET /api/books).
 *
 * @async
 * @function getAllBooks
 * @returns {Promise<BookModel[]>} A promise that resolves with the list of books.
 * @permission Requires role: `ADMIN`
 * @see {@link /app/api/(bff)/books/route.ts} for the API implementation
 */
export async function getAllBooks(): Promise<BookModel[]> {
  return clientApi.get('', { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
}

/**
 * Finds a specific book by its ID, including its chapters.
 *
 * Calls the API exposed by `/app/api/(bff)/books/[id]/route.ts` (GET /api/books/:id).
 *
 * @async
 * @function findBook
 * @param {string|number} book_id - The unique identifier of the book.
 * @permission Requires role: `ADMIN`
 * @returns {Promise<BookModel>} A promise that resolves with the found book.
 * @see {@link /app/api/(bff)/books/[id]/route.ts}
 */
export async function findBook(book_id: any): Promise<BookModel> {
  return clientApi.get("/" + book_id, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store', credentials: 'include' } });
}

/**
 * Creates a new book together with its chapters.
 *
 * Calls the API exposed by `/app/api/(bff)/books/route.ts` (POST /api/books).
 *
 * @async
 * @function createBook
 * @param {BookModel} book - The book (name + chapters) to create.
 * @permission Requires role: `ADMIN`
 * @returns {Promise<BookModel>} A promise that resolves with the created book.
 * @see {@link /app/api/(bff)/books/route.ts}
 */
export async function createBook(book: BookModel): Promise<BookModel> {
  return clientApi.post(book, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });
}
