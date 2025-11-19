/**
 * Asset Types for Sovity EDC Connector
 * Based on Eclipse Dataspace Components (EDC) specification
 */

export interface Asset {
  "@id": string;
  "@type"?: string;
  properties: AssetProperties;
  dataAddress?: DataAddress;
  createdAt?: number;
}

export interface AssetProperties {
  [key: string]: string | number | boolean | undefined;
  "asset:prop:id"?: string;
  "asset:prop:name"?: string;
  "asset:prop:description"?: string;
  "asset:prop:version"?: string;
  "asset:prop:contenttype"?: string;
  "asset:prop:byteSize"?: number;
}

export interface DataAddress {
  "@type"?: string;
  type: string;
  [key: string]: string | number | boolean | undefined;
}

export interface CreateAssetInput {
  id: string;
  properties: {
    name: string;
    description?: string;
    contentType?: string;
    version?: string;
    [key: string]: string | number | boolean | undefined;
  };
  dataAddress: {
    type: string;
    baseUrl?: string;
    [key: string]: string | number | boolean | undefined;
  };
}

export interface UpdateAssetInput {
  properties?: Partial<AssetProperties>;
  dataAddress?: Partial<DataAddress>;
}

export interface AssetListResponse {
  assets: Asset[];
  total?: number;
  page?: number;
  pageSize?: number;
}
