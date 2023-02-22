import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ImageFolder} from "../../interfaces/gallery/image-folder";
import {Pagination} from "../../interfaces/core/pagination";
import {environment} from "../../../environments/environment";
import { FilterData } from 'src/app/interfaces/common/product.interface';


const API_IMAGE_FOLDER = environment.apiBaseLink + '/api/file-folder/';

@Injectable({
  providedIn: 'root'
})
export class ImageFolderService {

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Image Folder
   */

  addNewImageFolderData(data: ImageFolder) {
    return this.http.post<{ message: string }>(API_IMAGE_FOLDER + 'add', data);
  }

  addNewImageFolderMultiData(data: ImageFolder[]) {
    return this.http.post<{ message: string }>(API_IMAGE_FOLDER + 'add-new-image-folder-multi', {data});
  }

  getAllImageFolderList(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.http.post<{ data: any[], count: number, success: boolean }>(API_IMAGE_FOLDER + 'get-all', filterData, {params});
  }


  editImageFolderData(data: ImageFolder) {
    return this.http.put<{ message: string }>(API_IMAGE_FOLDER + 'edit-image-folder-by-id', data);
  }

  deleteImageFolderData(id: string) {
    return this.http.delete<{ message: string }>(API_IMAGE_FOLDER + 'delete-image-folder-by-id/' + id);
  }

  getSingleImageFolderById(id: string) {
    return this.http.get<{ data: ImageFolder, message?: string }>(API_IMAGE_FOLDER + 'get-image-folder-details-by-id/' + id);
  }




}
