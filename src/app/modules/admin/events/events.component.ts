import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CONSTANTS } from 'app/layout/common/constants';
import { GlobalFunctions } from 'app/layout/common/global-functions';

import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { EventsService } from './events.service';

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  animations: fuseAnimations,
})
export class EventsComponent implements OnInit {

  isLoading: boolean = false;
  constants: any = CONSTANTS;

  searchInputControl: FormControl = new FormControl();

  products: any;
  productsService: any;
  selectedProduct: any;
  discountsForm: any;

  flashMessage: 'success' | 'error' | null = null;

  pagination: any = {};
  filterObj: any = {};
  results$: Observable<any>;
  /**
   * Constructor
   */
  constructor(
    private _apiService: EventsService,
    private _globalFunctions: GlobalFunctions,

    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
  ) { }

  ngOnInit(): void {
    this.filterObj = {
      page: '1',
      limit: '10',
      search: "",
      sortfield: "_id",
      sortoption: "-1",
    };
    this.getEvent();
    // this._prepareItemsListForm();

    this.search = _.debounce(this.search, 500);
  }

  getEvent(): void {
    this.isLoading = true;
    this._apiService.getList(this.filterObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.products = result.Data.docs;        
        const pagination: any = this._globalFunctions.copyObject(result.Data);
        delete pagination.docs;
        this.pagination = pagination;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  sortField(event: any = ''): void {
    this.filterObj.sortfield = event?.active || "_id";
    this.filterObj.sortoption = event?.direction || "-1";
    this.getEvent();
  }

  paginate(event: any): void {
    const page = event ? (event.pageIndex + 1) : 1;
    this.filterObj.page = page || '1';
    this.filterObj.limit = event?.pageSize || '10';
    this.getEvent();
  }

  search(event: any): void {
    this.filterObj.search = event?.target?.value || '';
    this.getEvent();
  }

  closeDetails(): void {
    this.selectedProduct = null;
  }

  toggleDetails(item: any = {}): void {    
    // If the product is already selected...
    const tmpSelectedProduct: any = this._globalFunctions.copyObject(this.selectedProduct || {});
    if (tmpSelectedProduct && tmpSelectedProduct._id === item._id) {
      // Close the details
      this.closeDetails();
      return;
    }
    // this._prepareItemsListForm(item);
    this.selectedProduct = item;
  }

  showFlashMessage(type: 'success' | 'error'): void {
    // Show the message
    this.flashMessage = type;
    // Mark for check
    this._changeDetectorRef.markForCheck();
    // Hide it after 3 seconds
    setTimeout(() => {
      this.flashMessage = null;
      // Mark for check
      this._changeDetectorRef.markForCheck();
    }, 3000);
  }

  approve(organizerObj: any): void {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Approve Organizer',
      message: 'Are you sure you want to Approve this {{organizerObj.name}} organizer.',
      actions: {
        confirm: {
          label: 'Approve'
        }
      }
    });
    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // Get the product object
        const product = organizerObj;
        const index = this.products.findIndex((item: any) => item.id === product._id);
        if (product._id != '' && index != -1) {
          this._apiService.approve(product._id).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              this.products[index].is_approved = true;
            }
          });
        }
        this.closeDetails();
      } else {
        this.closeDetails();
      }
    });
  }

  disapprove(organizerObj: any): void {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Disapprove Organizer',
      message: 'Are you sure you want to Disapprove this ' + organizerObj.name + ' organizer.',
      actions: {
        confirm: {
          label: 'Disapprove'
        }
      }
    });
    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // Get the product object
        const product = organizerObj;
        const index = this.products.findIndex((item: any) => item.id === product._id);
        if (product._id != '' && index != -1) {
          this._apiService.disapprove(product._id).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              this.products[index].is_approved = false;
            }
          });
        }
        this.closeDetails();
      } else {
        this.closeDetails();
      }
    });
  }

  // Service
  approveService(organizerObj: any, index: number): void {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Approve Service',
      message: 'Are you sure you want to Approve this service.',
      actions: {
        confirm: {
          label: 'Approve'
        }
      }
    });
    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // Get the product object
        const product = organizerObj;
        const selectedServiceIndex = this.products.findIndex((item: any) => item.id === this.selectedProduct._id);
        if (product._id != '' && index != -1) {
          this._apiService.approveService(product._id).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              this.products[selectedServiceIndex].services[index].is_approved = true;
              // this.productsService[index].is_approved = true;
            }
          });
        }
      }
    });
  }

  disapproveService(organizerObj: any, index: number): void {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Disapprove Service',
      message: 'Are you sure you want to Disapprove this service.',
      actions: {
        confirm: {
          label: 'Disapprove'
        }
      }
    });
    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // Get the product object
        const product = organizerObj;
        const selectedServiceIndex = this.products.findIndex((item: any) => item.id === this.selectedProduct._id);
        if (product._id != '' && index != -1) {
          this._apiService.disapproveService(product._id).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              this.products[selectedServiceIndex].services[index].is_approved = false;
              // this.productsService[index].is_approved = true;
            }
          });
        }
      }
    });
  }

  // Items
  approveItem(organizerObj: any, index: number): void {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Approve Item',
      message: 'Are you sure you want to Approve this item.',
      actions: {
        confirm: {
          label: 'Approve'
        }
      }
    });
    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // Get the product object
        const product = organizerObj;
        const selectedServiceIndex = this.products.findIndex((item: any) => item.id === this.selectedProduct._id);
        if (product._id != '' && index != -1) {
          this._apiService.approveItem(product._id).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              this.products[selectedServiceIndex].items[index].is_approved = true;
              // this.productsService[index].is_approved = true;
            }
          });
        }
      }
    });
  }

  disapproveItem(organizerObj: any, index: number): void {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Disapprove Item',
      message: 'Are you sure you want to Disapprove this item.',
      actions: {
        confirm: {
          label: 'Disapprove'
        }
      }
    });
    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // Get the product object
        const product = organizerObj;
        const selectedServiceIndex = this.products.findIndex((item: any) => item.id === this.selectedProduct._id);
        if (product._id != '' && index != -1) {
          this._apiService.disapproveItem(product._id).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              this.products[selectedServiceIndex].items[index].is_approved = false;
              // this.productsService[index].is_approved = true;
            }
          });
        }
      }
    });
  }

  // Equipment
  approveEquipment(organizerObj: any, index: number): void {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Approve Equipment',
      message: 'Are you sure you want to Approve this equipment.',
      actions: {
        confirm: {
          label: 'Approve'
        }
      }
    });
    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // Get the product object
        const product = organizerObj;
        const selectedServiceIndex = this.products.findIndex((item: any) => item.id === this.selectedProduct._id);
        if (product._id != '' && index != -1) {
          this._apiService.approveService(product._id).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              this.products[selectedServiceIndex].equipments[index].is_approved = true;
              // this.productsService[index].is_approved = true;
            }
          });
        }
      }
    });
  }

  disapproveEquipment(organizerObj: any, index: number): void {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Disapprove Equipment',
      message: 'Are you sure you want to Disapprove this equipment.',
      actions: {
        confirm: {
          label: 'Disapprove'
        }
      }
    });
    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // Get the product object
        const product = organizerObj;
        const selectedServiceIndex = this.products.findIndex((item: any) => item.id === this.selectedProduct._id);
        if (product._id != '' && index != -1) {
          this._apiService.disapproveService(product._id).subscribe((result: any) => {
            if (result && result.IsSuccess) {
              this.products[selectedServiceIndex].equipments[index].is_approved = false;
              // this.productsService[index].is_approved = true;
            }
          });
        }
      }
    });
  }

  deleteSelectedProduct(organizerObj: any): void {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete product',
      message: 'Are you sure you want to remove ' + organizerObj.name + '? This action cannot be undone!',
      actions: {
        confirm: {
          label: 'Delete'
        }
      }
    });
    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // Get the product object
        const product = organizerObj;
        const index = this.products.findIndex((item: any) => item.id === product._id);
        if (product._id != '' && index != -1) {
          this.products.splice(index, 1);
          // Delete the product on the server
          this._apiService.delete(product._id).subscribe((result) => {
            if (result && result.IsSuccess) {
              this.pagination.totalDocs = this.pagination.totalDocs - 1;
            }
          });
        } else if (product._id == '') {
          this.products.splice(0, 1);
        }
        this.closeDetails();
      } else {
        this.closeDetails();
      }
    });
  }

}