import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CONSTANTS } from 'app/layout/common/constants';
import { GlobalFunctions } from 'app/layout/common/global-functions';
import { AgentService } from './agent.service';

import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss'],
  animations: fuseAnimations,
})
export class AgentComponent implements OnInit {

  isLoading: boolean = false;
  constants: any = CONSTANTS;

  searchInputControl: FormControl = new FormControl();

  products: any;
  selectedProduct: any;
  selectedProductArr: any;
  discountsForm: any;

  flashMessage: 'success' | 'error' | null = null;

  pagination: any = {};
  filterObj: any = {};
  results$: Observable<any>;
  /**
   * Constructor
   */
  constructor(
    private _apiService: AgentService,
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
        console.log(result.Data.docs);
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

  exceldawnload(): any{
    this._apiService.export(Blob).subscribe(async (results: any) => {
        // console.log('Data is received - Result - ',results);
        if (results && results.IsSuccess) {
             const href = results.Data;
             const anchorElement = document.createElement('a');
             anchorElement.href = href;
            //  anchorElement.target = '_blank';
            //  anchorElement.download ="";
             document.body.appendChild(anchorElement);
             anchorElement.click();
             document.body.removeChild(anchorElement);
             window.URL.revokeObjectURL(href);
        }
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
    this.selectedProductArr = null;
  }

  toggleDetails(item: any = {}): void {
    // If the product is already selected...
    const tmpSelectedProduct: any = this._globalFunctions.copyObject(this.selectedProduct || {});
    if (tmpSelectedProduct && tmpSelectedProduct._id === item._id) {
      // Close the details
      this.closeDetails();
      return;
    }

    this.selectedProduct = item;
    this.getOrganizer(item._id);
    // this._prepareItemsListForm(item);
  }

  getOrganizer(agentId: any = ''): void {
    this.isLoading = true;
    this._apiService.getOrganizer(agentId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        console.log(result);
        this.selectedProductArr = result?.Data;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
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
}
