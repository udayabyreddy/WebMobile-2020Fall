import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpService, SnackBarService, untilDestroyed } from '../@core';
import { SharedStateService } from '../@core/services/shared-state.services';
import { BooksModel } from '../@shared';
import { BookDetailsComponent } from './book-details/book-details.component';

@Component({
  selector: 'app-browse-books',
  templateUrl: './browse-books.component.html',
  styleUrls: ['./browse-books.component.scss'],
})
export class BrowseBooksComponent implements OnInit, OnDestroy {
  booksData: BooksModel[];
  searchForm: FormGroup;
  disbleButtons = true;

  constructor(
    public sharedState: SharedStateService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getBooksList();
    this.observerDisableButtons();
  }

  createForm(): void {
    this.searchForm = this.fb.group({
      category: [''],
      searchValue: [''],
    });
  }
  ngOnDestroy(): void {}
  observerDisableButtons(): void {
    this.sharedState.userName.pipe(untilDestroyed(this)).subscribe((value) => {
      if (value) {
        this.disbleButtons = !true;
      } else {
        this.disbleButtons = !false;
      }
    });
  }

  openDialog(book: BooksModel): void {
    const dialogRef = this.dialog.open(BookDetailsComponent, { data: book });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getBooksList(): void {
    this.sharedState.isLoading.next(true);
    const api = '/books';
    this.httpService
      .getData(api)
      .pipe(untilDestroyed(this))
      .subscribe(
        (data: BooksModel[]) => {
          this.sharedState.isLoading.next(false);
          if (data) {
            this.booksData = data;
          }
        },
        (err) => {
          this.sharedState.isLoading.next(false);
          console.error(err);
          this.snackBarService.openSnackBar('Error while getting books list!');
        }
      );
  }

  resetBooks(): void {
    this.searchForm.reset();
    this.getBooksList();
  }

  searchBy(category: string, searchValue: string): void {
    this.sharedState.isLoading.next(true);
    const api = `/books/searchBy?category=${category}&searchValue=${searchValue}`;
    this.httpService
      .getData(api)
      .pipe(untilDestroyed(this))
      .subscribe(
        (data: BooksModel[]) => {
          this.sharedState.isLoading.next(false);
          this.booksData = data;
        },
        (err) => {
          this.sharedState.isLoading.next(false);
          console.error(err);
          this.snackBarService.openSnackBar(
            'Error while searching!!Contact Admin'
          );
        }
      );
  }

  searchBooks(): void {
    console.log(this.searchForm.value);
    const formData = { ...this.searchForm.value };
    if (!formData.category && !formData.searchValue) {
      this.getBooksList();
    } else {
      if (!formData.category) {
        this.snackBarService.openSnackBar('Enter category!');
      } else if (formData.category && !formData.searchValue) {
        this.snackBarService.openSnackBar('Enter something to search!');
      } else {
        this.searchBy(formData.category, formData.searchValue);
      }
    }
  }

  issueBook(book: BooksModel): void {
    this.sharedState.isLoading.next(true);
    const userData = JSON.parse(sessionStorage.getItem('userDetails'));
    const api = `/books/issueBook?id=${userData._id}`;
    this.httpService
      .postData(api, book)
      .pipe(untilDestroyed(this))
      .subscribe(
        (data: BooksModel[]) => {
          this.httpService
            .putData(`/user/updateBooksIssued/${userData._id}`, {
              booksissued: userData.booksissued,
            })
            .pipe(untilDestroyed(this))
            .subscribe();
          this.snackBarService.openSnackBar('Book issued successfully!');
          this.sharedState.isLoading.next(false);
          this.booksData = data;
        },
        (err) => {
          this.sharedState.isLoading.next(false);
          console.error(err);
          this.snackBarService.openSnackBar(
            'Error while searching!!Contact Admin'
          );
        }
      );
  }
}
