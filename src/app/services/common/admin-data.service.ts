import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AdminRoleData} from "../../interfaces/common/admin-role-data";
import {AdminRole} from "../../interfaces/common/admin-role";
import {Admin} from "../../interfaces/common/admin";
import {environment} from "../../../environments/environment";


const API_ADMIN = environment.apiBaseLink + '/api/admin/';


@Injectable({
  providedIn: 'root'
})
export class AdminDataService {

  constructor(
    private httpClient: HttpClient
  ) {
  }


  getAllAdmin() {
    return this.httpClient.get<{ data: Admin[], message: string }>(API_ADMIN + 'get-all-admin-list');
  }

  getLoginAdminInfo() {
    return this.httpClient.get<{ data: Admin, message: string }>(API_ADMIN + 'get-logged-in-admin-info');
  }

  getSingleAdminById(id: string) {
    return this.httpClient.get<{ data: Admin, message: string }>(API_ADMIN + 'get-single-admin-by-id/' + id);
  }

  editAdmin(userId: string, data: Admin) {
    return this.httpClient.put<{ message: string }>(API_ADMIN + 'edit-admin-info/' + userId, data);
  }

  editAdminOwnProfileInfo(data: Admin) {
    return this.httpClient.put<{ message: string }>(API_ADMIN + 'edit-logged-in-admin-info', data);
  }

  changeAdminOwnPassword(data: {oldPassword: string, newPassword: string}) {
    return this.httpClient.put<{ message: string }>(API_ADMIN + 'change-logged-in-admin-password', data);
  }

  // router.put('/change-logged-in-admin-password', checkAdminAuth, controller.changeAdminOwnPassword);



  deleteAdmin(userId: string) {
    return this.httpClient.delete<{ message: string }>(API_ADMIN + 'delete-admin-by-id/' + userId);
  }

  getDashboardData() {
    return this.httpClient.get<{ data: any, message: string }>(API_ADMIN + 'get-dashboard-data');
  }

  /**
   * ROLE
   */
  addAdminRole(data: AdminRole) {
    return this.httpClient.post<{ message: string }>(API_ADMIN + 'add-admin-role', data);
  }

  getRolesData() {
    return this.httpClient.get<{ data: AdminRole[], message: string }>(API_ADMIN + 'get-all-admin-roles');
  }

  getSingleRoleById(id: string) {
    return this.httpClient.get<{ data: AdminRole, message?: string }>(API_ADMIN + 'get-admin-role-by-id/' + id);
  }


  deleteAdminRoleById(id: string) {
    return this.httpClient.delete<{ message: string }>(API_ADMIN + 'delete-admin-role-by-id/' + id);
  }

  editAdminRole(data: AdminRole) {
    return this.httpClient.put<{ message: string }>(API_ADMIN + 'edit-admin-role', data);
  }

  getLoginAdminRole() {
    return this.httpClient.get<{ data: AdminRoleData }>(API_ADMIN + 'get-logged-in-admin-role');
  }


}
