import { Injectable } from '@angular/core';
import { objectToQuerystring } from '../utils/url-helpers';
import { StorageService } from 'src/app/services/storage-service.service';
import { htmlDecode } from '../utils/string-utils';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleImageSearchService {
  private readonly endpoint: string =
    environment['GOOGLE_IMAGE_SEARCH_ENDPOINT'];
  private readonly apiKey: string = environment['GOOGLE_IMAGE_SEARCH_API_KEY'];
  private readonly customSearchID: string =
    environment['GOOGLE_IMAGE_SEARCH_CUSTOM_SEARCH_ID'];

  constructor(private storageService: StorageService) {}

  private async queryImage(search: string): Promise<GoogleImageSearchResponse> {
    const params: GoogleImageSearchRequestParams = {
      key: this.apiKey,
      cx: this.customSearchID,
      q: search,
      searchType: 'image',
      alt: 'json',
      imageSize: 'medium',
    };
    const response = await fetch(this.endpoint + objectToQuerystring(params));
    return await response.json();
  }

  public async getImageURLsByKeywords(search: string): Promise<string[]> {
    try {
      this.sanitizeSearch(search);
      const cachedItem = this.checkCache(search);
      if (cachedItem) {
        return cachedItem;
      }
      const response = await this.queryImage(search);
      const links = response.items.map((item) => item.link);
      this.storageService.addImageToCache(search, links);
      return links;
    } catch (e) {
      return [];
    }
  }

  private checkCache(search: string): null | string[] {
    this.sanitizeSearch(search);
    const cache = this.storageService.getImagesUrlsCache();
    return cache[search];
  }

  private sanitizeSearch(search: string): string {
    return htmlDecode(search) || search;
  }
}
