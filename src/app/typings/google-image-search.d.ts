//https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list

declare type GoogleImageUrlsCache = { [search: string]: string[] };

declare interface GoogleImageSearchRequestParams {
  key: string; // api key
  cx: string; //customer search ID
  q: string; //custom search text
  searchType: 'image';
  fileType?: string;
  imageSize?: GoogleImageSearchSize;
  alt: 'json';
}

declare type GoogleImageSearchSize =
  | 'huge'
  | 'icon'
  | 'large'
  | 'medium'
  | 'small'
  | 'xlarge'
  | 'xxlarge';

declare interface GoogleImageSearchResponse {
  kind: string;
  url: GoogleImageSearchUrl;
  queries: GoogleImageSearchQueries;
  context: GoogleImageSearchContext;
  searchInformation: GoogleImageSearchSearchInformation;
  items: GoogleImageSearchItem[];
}

declare interface GoogleImageSearchUrl {
  type: string;
  template: string;
}

declare interface GoogleImageSearchQueries {
  request: GoogleImageSearchRequest[];
  nextPage: GoogleImageSearchNextPage[];
}

declare interface GoogleImageSearchRequest {
  title: string;
  totalResults: string;
  searchTerms: string;
  count: number;
  startIndex: number;
  inputEncoding: string;
  outputEncoding: string;
  safe: string;
  cx: string;
  fileType: string;
  searchType: string;
  imgSize: string;
}

declare interface GoogleImageSearchNextPage {
  title: string;
  totalResults: string;
  searchTerms: string;
  count: number;
  startIndex: number;
  inputEncoding: string;
  outputEncoding: string;
  safe: string;
  cx: string;
  fileType: string;
  searchType: string;
  imgSize: string;
}

declare interface GoogleImageSearchContext {
  title: string;
}

declare interface GoogleImageSearchSearchInformation {
  searchTime: number;
  formattedSearchTime: string;
  totalResults: string;
  formattedTotalResults: string;
}

declare interface GoogleImageSearchItem {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  mime: string;
  fileFormat: string;
  image: GoogleImageSearchImage;
}

declare interface GoogleImageSearchImage {
  contextLink: string;
  height: number;
  width: number;
  byteSize: number;
  thumbnailLink: string;
  thumbnailHeight: number;
  thumbnailWidth: number;
}
