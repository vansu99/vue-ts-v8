/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type {Item} from '../models/Item';
import type {ItemCreate} from '../models/ItemCreate';
import type {ItemUpdate} from '../models/ItemUpdate';
import type {CancelablePromise} from '../core/CancelablePromise';
import {OpenAPI} from '../core/OpenAPI';
import {request as __request} from '../core/request';

export class ItemsService {
  /**
   * Create Item
   * @param refreshToken
   * @param requestBody
   * @returns Item Successful Response
   * @throws ApiError
   */
  public static itemsCreateItem(
    refreshToken: (string | null),
    requestBody: ItemCreate,
  ): CancelablePromise<Item> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/items/create-item',
      cookies: {
        'refresh_token': refreshToken,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  
  /**
   * Read Items
   * @param refreshToken
   * @returns Item Successful Response
   * @throws ApiError
   */
  public static itemsReadItems(
    refreshToken: (string | null),
  ): CancelablePromise<Array<Item>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/items/read-all-item',
      cookies: {
        'refresh_token': refreshToken,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  
  /**
   * Read Item By Id
   * @param id
   * @param refreshToken
   * @returns any Successful Response
   * @throws ApiError
   */
  public static itemsReadItemById(
    id: string,
    refreshToken: (string | null),
  ): CancelablePromise<(Item | null)> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/items/get-by-id/{id}',
      path: {
        'id': id,
      },
      cookies: {
        'refresh_token': refreshToken,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  
  /**
   * Read Item By Owner
   * @param refreshToken
   * @returns Item Successful Response
   * @throws ApiError
   */
  public static itemsReadItemByOwner(
    refreshToken: (string | null),
  ): CancelablePromise<Array<Item>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/items/get-by-owner',
      cookies: {
        'refresh_token': refreshToken,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  
  /**
   * Update Item
   * @param refreshToken
   * @param requestBody
   * @returns Item Successful Response
   * @throws ApiError
   */
  public static itemsUpdateItem(
    refreshToken: (string | null),
    requestBody: ItemUpdate,
  ): CancelablePromise<Item> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/items/update-item',
      cookies: {
        'refresh_token': refreshToken,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  
  /**
   * Delete Item
   * @param id
   * @param refreshToken
   * @returns Item Successful Response
   * @throws ApiError
   */
  public static itemsDeleteItem(
    id: string,
    refreshToken: (string | null),
  ): CancelablePromise<Item> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/items/delete/{id}',
      path: {
        'id': id,
      },
      cookies: {
        'refresh_token': refreshToken,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
