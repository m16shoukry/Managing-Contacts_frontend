import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../../../services/error-handle/error-handle.service';
import { ContactService } from '../../../services/contact.service';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    HeaderComponent,
    ToastrModule,
    CommonModule,
    RouterModule,
    BsDropdownModule,
    ReactiveFormsModule,
    FormsModule,
    TooltipModule,
    ToastrModule,
    NgxPaginationModule,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit, OnDestroy {
  contacts: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  isEditing: { [key: string]: boolean } = {};
  filtersForm!: FormGroup;
  addContactForm!: FormGroup;
  isAddContactModalOpen = false;
  contactLockStatus: { [key: string]: boolean } = {};
  lockStatusSubscription!: Subscription;

  private errorHandlerService = inject(ErrorHandlerService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private contactService = inject(ContactService);

  constructor() {}

  ngOnInit(): void {
    this.loadContacts();

    this.lockStatusSubscription = this.contactService
      .getLockStatusUpdates()
      .subscribe((data: any) => {
        const { contactId, lockedBy, lockedUntil } = data;
        this.contactLockStatus[contactId] = lockedUntil !== null;
      });

    this.filtersForm = this.formBuilder.group({
      name: [''],
      phone: [''],
      address: [''],
    });

    this.filtersForm.valueChanges.subscribe(() => {
      this.loadContacts();
    });

    this.addContactForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      notes: [''],
    });

    this.contactService.startContactLockSSE();
  }

  openAddContactModal() {
    this.addContactForm.reset();
    this.isAddContactModalOpen = true;
  }

  closeAddContactModal(event: Event) {
    this.isAddContactModalOpen = false;
  }

  submitAddContactForm() {
    if (this.addContactForm.valid) {
      this.contactService
        .createContact(this.addContactForm.value)
        .subscribe(() => {
          this.loadContacts();
          this.closeAddContactModal(new Event('close'));
        });
    }
  }

  loadContacts(): void {
    const queryParams = {
      page: this.currentPage,
      ...this.filtersForm?.value,
    };

    this.contactService.listContacts(queryParams).subscribe((response: any) => {
      this.contacts = response.data;
      this.totalItems = response.totalItems;
      this.pageSize = response.pageSize;
      this.totalPages = response.totalPages;
      this.currentPage = response.currentPage;
    });
  }

  editContact(contactId: string): void {
    this.lockContact(contactId);
    this.isEditing[contactId] = true;
  }

  saveContact(contact: any): void {
    this.contactService.updateContact(contact._id, contact).subscribe(() => {
      this.isEditing[contact._id] = false;
      this.toastr.success('Contact updated successfully!', '', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
        closeButton: true,
      });
    });
  }

  lockContact(contactId: string): void {
    this.contactService.lockContact(contactId).subscribe(() => {
      this.contactLockStatus[contactId] = true;
    });
  }

  deleteContact(contactId: string): void {
    if (confirm('Are you sure? This action cannot be undone.')) {
      this.contactService.deleteContact(contactId).subscribe(() => {
        this.toastr.success('Contact has been deleted.', 'Deleted!');
        this.loadContacts();
      });
    }
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadContacts();
  }

  ngOnDestroy(): void {
    if (this.lockStatusSubscription) {
      this.lockStatusSubscription.unsubscribe();
    }
    this.contactService.stopContactLockSSE();
  }
}
