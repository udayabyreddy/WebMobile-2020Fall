import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  HttpService,
  SharedStateService,
  SnackBarService,
  untilDestroyed,
} from 'src/app/@core';
import { BooksModel } from 'src/app/@shared';

@Component({
  selector: 'app-update-books',
  templateUrl: './update-books.component.html',
  styleUrls: ['./update-books.component.scss'],
})
export class UpdateBooksComponent implements OnInit, AfterViewInit, OnDestroy {
  updateBookForm: FormGroup;

  constructor(
    public sharedState: SharedStateService,
    public dialogRef: MatDialogRef<UpdateBooksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BooksModel,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}
  // booktitle: req.body.booktitle,
  // author: req.body.author,
  // category: req.body.category,
  // desc: req.body.desc,
  ngOnInit(): void {
    this.updateBookForm = this.fb.group({
      booktitle: [this.data.booktitle, Validators.required],
      author: [this.data.author, Validators.required],
      category: [this.data.category, Validators.required],
      desc: [this.data.desc, Validators.required],
    });
  }
  ngAfterViewInit(): void {}
  ngOnDestroy(): void {}
  resetForm(): void {
    this.updateBookForm.reset();
  }

  updateBook(): void {
    this.sharedState.isLoading.next(true);
    const data = { ...this.updateBookForm.value };
    const body = {
      booktitle: data.booktitle,
      author: data.author,
      category: data.category,
      desc: data.desc,
    };

    const apiUrl = `/books/${this.data._id}`;
    this.httpService
      .putData(apiUrl, body)
      .pipe(untilDestroyed(this))
      .subscribe(
        (res) => {
          this.sharedState.isLoading.next(false);
          if (res) {
            this.snackBarService.openSnackBar('Updated successfully');
            this.dialogRef.close(true);
          } else {
            this.snackBarService.openSnackBar(
              'Some thing went wrong....Try again'
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
}
