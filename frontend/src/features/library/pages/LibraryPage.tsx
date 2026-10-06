import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  LocalLibrary as BookIcon,
  BookmarkBorder as IssueIcon,
  KeyboardReturn as ReturnIcon
} from '@mui/icons-material';
import { PageHeader } from '@/components/common/PageHeader';
import { libraryService } from '@/services/libraryService';
import { Book } from '@/types';
import toast from 'react-hot-toast';

export const LibraryPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [studentRoll, setStudentRoll] = useState('STU-2023-001');

  const fetchBooks = async () => {
    try {
      const res = await libraryService.getAll(search);
      if (res.data) {
        setBooks(res.data);
      }
    } catch {
      toast.error('Failed to load library catalog');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search]);

  const handleOpenIssue = (book: Book) => {
    setSelectedBook(book);
    setIssueDialogOpen(true);
  };

  const handleConfirmIssue = async () => {
    if (!selectedBook) return;
    try {
      await libraryService.issueBook(selectedBook.id);
      toast.success(`"${selectedBook.title}" issued to ${studentRoll}. Return due in 14 days.`);
      setIssueDialogOpen(false);
      fetchBooks();
    } catch (err: any) {
      toast.error(err.message || 'Issue failed');
    }
  };

  const handleReturn = async (bookId: number, title: string) => {
    try {
      await libraryService.returnBook(bookId);
      toast.success(`Book "${title}" returned to rack`);
      fetchBooks();
    } catch (err: any) {
      toast.error(err.message || 'Return failed');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Digital & Physical Library"
        subtitle="Catalog search, reference books, book loans, ISBN barcodes, and reservation manager."
      />

      <Card
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: '16px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          mb: 3,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search by title, author, category, or ISBN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'var(--text-muted)' }} />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
        />
      </Card>

      <Card
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <TableCell sx={{ fontWeight: 600 }}>ISBN</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Book Title & Authors</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Shelf Rack</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Available Copies</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((b) => (
                <TableRow key={b.id} hover>
                  <TableCell>
                    <Chip label={b.isbn || 'N/A'} size="small" variant="outlined" sx={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {b.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                      {b.author} ({b.publicationYear})
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={b.category} size="small" sx={{ height: 22, fontSize: '11px' }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--primary)' }}>
                      {b.rackNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: b.availableCopies > 0 ? '#16a34a' : '#dc2626' }}>
                      {b.availableCopies} / {b.totalCopies} Available
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<IssueIcon />}
                        disabled={b.availableCopies === 0}
                        onClick={() => handleOpenIssue(b)}
                        sx={{ textTransform: 'none', borderRadius: '8px', fontSize: '12px' }}
                      >
                        Issue
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        startIcon={<ReturnIcon />}
                        onClick={() => handleReturn(b.id, b.title)}
                        sx={{ textTransform: 'none', borderRadius: '8px', fontSize: '12px' }}
                      >
                        Return
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Issue Book Dialog */}
      <Dialog open={issueDialogOpen} onClose={() => setIssueDialogOpen(false)} maxWidth="xs" fullWidth>
        {selectedBook && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>Issue Book Copy</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2, p: 2, backgroundColor: 'rgba(79, 70, 229, 0.05)', borderRadius: '10px' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedBook.title}</Typography>
                <Typography variant="caption" color="textSecondary">{selectedBook.author}</Typography>
              </Box>
              <TextField
                fullWidth
                size="small"
                label="Student / Faculty ID"
                value={studentRoll}
                onChange={(e) => setStudentRoll(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Typography variant="caption" color="textSecondary">
                Standard borrowing term: 14 Days. Late fee: $1 / day thereafter.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setIssueDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
              <Button variant="contained" onClick={handleConfirmIssue} sx={{ textTransform: 'none', backgroundColor: 'var(--primary)' }}>
                Confirm Issue
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};



