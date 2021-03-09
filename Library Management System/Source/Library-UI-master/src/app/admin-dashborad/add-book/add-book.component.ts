import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpService, SnackBarService, untilDestroyed } from 'src/app/@core';
import { SharedStateService } from 'src/app/@core/services/shared-state.services';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnInit, OnDestroy {
  addBookForm: FormGroup;
  constructor(
    public sharedState: SharedStateService,
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private snackBarService: SnackBarService,
    private dialogRef: MatDialogRef<AddBookComponent>
  ) {}

  ngOnInit(): void {
    this.addBookForm = this.fb.group({
      booktitle: ['', Validators.required],
      author: ['', Validators.required],
      category: ['', Validators.required],
      desc: ['', Validators.required],
      stock: ['1'],
      ISBN: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {}

  addBook(): void {
    this.sharedState.isLoading.next(true);
    const data = { ...this.addBookForm.value };
    const url = '/books/addBook';
    const body = {
      booktitle: data.booktitle,
      author: data.author,
      category: data.category,
      desc: data.desc,
      stock: data.stock,
      ISBN: data.ISBN,
      issuedTo: '',
    };
    this.httpService
      .postData(url, body)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response) => {
          this.sharedState.isLoading.next(false);
          if (response && response !== false) {
            this.dialogRef.close(true);
            this.snackBarService.openSnackBar('Book added successfully!');
          } else {
            this.snackBarService.openSnackBar(
              'Some thing went wrong'
            );
          }
        },
        (err) => {
          this.sharedState.isLoading.next(false);
          console.log(err);
          this.snackBarService.openSnackBar('Error.Contact Admin!');
        }
      );
  }

  resetForm(): void {
    this.addBookForm.reset();
  }
}
