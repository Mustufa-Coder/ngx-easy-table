import { Observable, of, Subject, Subscription } from 'rxjs';
import { PaginationControlsDirective } from 'ngx-pagination';

export enum API {
  rowContextMenuClicked = 'rowContextMenuClicked',
  setInputValue = 'setInputValue',
  toolPanelClicked = 'toolPanelClicked',
  onGlobalSearch = 'onGlobalSearch',
  setPaginationCurrentPage = 'setPaginationCurrentPage',
  getPaginationCurrentPage = 'getPaginationCurrentPage',
  getPaginationTotalItems = 'getPaginationTotalItems',
  getPaginationLastPage = 'getPaginationLastPage',
  setPaginationRange = 'setPaginationRange',
  setPaginationPreviousLabel = 'setPaginationPreviousLabel',
  setPaginationNextLabel = 'setPaginationNextLabel',
  setRowClass = 'setRowClass',
  setRowStyle = 'setRowStyle',
}

export type rowClass = { row: number, className: string };
export type rowStyle = { row: number, attr: string, value: string };

export type ApiType =
    { type: API.rowContextMenuClicked; }
  | { type: API.setInputValue; value: Array<{ key: string, value: string }>; }
  | { type: API.toolPanelClicked; }
  | { type: API.onGlobalSearch; value: string; }
  | { type: API.setPaginationCurrentPage; value: number; }
  | { type: API.getPaginationCurrentPage; }
  | { type: API.getPaginationTotalItems; }
  | { type: API.getPaginationLastPage; }
  | { type: API.setPaginationRange; value: number[]; }
  | { type: API.setPaginationPreviousLabel; value: string; }
  | { type: API.setPaginationNextLabel; value: string; }
  | { type: API.setRowClass; value: rowClass | rowClass[] }
  | { type: API.setRowStyle; value: rowStyle | rowStyle[] }
  ;

export class TableAPI {
  public paginationComponent: PaginationControlsDirective;
  private readonly api = new Subject<ApiType>();

  subscribe(event: (type: ApiType) => void): Subscription {
    return this.api.subscribe(event);
  }

  set(event: ApiType): Observable<boolean | number> {
    switch (event.type) {
      case API.getPaginationCurrentPage:
        return of(this.paginationComponent.getCurrent());
      case API.getPaginationTotalItems:
        return of(this.paginationComponent.getTotalItems());
      case API.getPaginationLastPage:
        return of(this.paginationComponent.getLastPage());
      case API.setPaginationCurrentPage:
        this.paginationComponent.setCurrent(event.value);
        return of(true);
      case API.rowContextMenuClicked:
      case API.setInputValue:
      case API.toolPanelClicked:
      case API.onGlobalSearch:
      case API.setPaginationRange:
      case API.setPaginationPreviousLabel:
      case API.setPaginationNextLabel:
      case API.setRowClass:
      case API.setRowStyle:
        this.api.next(event);
        return of(true);
      default:
        console.error('Unrecognized API event');
    }
  }
}
