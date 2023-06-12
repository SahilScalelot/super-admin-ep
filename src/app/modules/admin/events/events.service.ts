import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalFunctions } from 'app/layout/common/global-functions';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient,private _globalFunctions: GlobalFunctions) { }
  
  getList(filter: any = {}): any {
    return this.http.post(environment.appURL + 'superadmin/event', filter, this._globalFunctions.getFileAuthorizationHeader());
  }

  getone(id: any = ''): any {
    return this.http.post(environment.appURL + 'superadmin/event/getone', {eventid: id}, this._globalFunctions.getAuthorizationHeader());
  }

  approve(id: any = ''): any {
    return this.http.post(environment.appURL + 'superadmin/event/approve', {eventid: id}, this._globalFunctions.getAuthorizationHeader());
  }

  disapprove(id: any = ''): any {
    return this.http.post(environment.appURL + 'superadmin/event/disapprove', {eventid: id}, this._globalFunctions.getAuthorizationHeader());
  }

  approveService(id: any = ''): any {
    return this.http.post(environment.appURL + 'superadmin/service/approve', {serviceid: id}, this._globalFunctions.getAuthorizationHeader());
  }

  disapproveService(id: any = ''): any {
    return this.http.post(environment.appURL + 'superadmin/service/disapprove', {serviceid: id}, this._globalFunctions.getAuthorizationHeader());
  }

  approveItem(id: any = ''): any {
    return this.http.post(environment.appURL + 'superadmin/item/approve', {itemid: id}, this._globalFunctions.getAuthorizationHeader());
  }

  disapproveItem(id: any = ''): any {
    return this.http.post(environment.appURL + 'superadmin/item/disapprove', {itemid: id}, this._globalFunctions.getAuthorizationHeader());
  }

  approveEquipment(id: any = ''): any {
    return this.http.post(environment.appURL + 'superadmin/equipment/approve', {equipmentid: id}, this._globalFunctions.getAuthorizationHeader());
  }

  disapproveEquipment(id: any = ''): any {
    return this.http.post(environment.appURL + 'superadmin/equipment/disapprove', {equipmentid: id}, this._globalFunctions.getAuthorizationHeader());
  }

  delete(id: any = ''): any {
    return this.http.post(environment.appURL + 'superadmin/event/remove', {eventid: id}, this._globalFunctions.getAuthorizationHeader());
  }

}
