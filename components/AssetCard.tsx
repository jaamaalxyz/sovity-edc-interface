import { FiEdit2, FiFileText, FiTrash2 } from "react-icons/fi";

import type { Asset } from "@/types/asset";

import Button from "./Button";
import Card, { CardBody } from "./Card";

interface AssetCardProps {
  asset: Asset;
  onView: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
}

export default function AssetCard({
  asset,
  onView,
  onEdit,
  onDelete,
}: AssetCardProps) {
  const assetId = asset["@id"];
  const name =
    asset.properties?.["asset:prop:name"] || asset.properties?.name || assetId;
  const description =
    asset.properties?.["asset:prop:description"] ||
    asset.properties?.description ||
    "No description";
  const contentType =
    asset.properties?.["asset:prop:contenttype"] ||
    asset.properties?.contentType ||
    "N/A";

  return (
    <Card className="h-full">
      <CardBody>
        <div className="mb-3 flex items-start justify-between">
          <div className="flex flex-1 items-start gap-3">
            <div className="rounded-lg bg-primary-100 p-2">
              <FiFileText className="size-5 text-primary-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-semibold text-gray-900">
                {name}
              </h3>
              <p className="truncate text-sm text-gray-500">{assetId}</p>
            </div>
          </div>
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-gray-600">{description}</p>

        <div className="mb-4">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {contentType}
          </span>
        </div>

        <div className="flex items-center gap-2 border-t border-gray-200 pt-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onView(asset)}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(asset)}
            aria-label={`Edit ${name}`}
          >
            <FiEdit2 className="size-4" aria-hidden="true" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(asset)}
            aria-label={`Delete ${name}`}
          >
            <FiTrash2 className="size-4 text-red-600" aria-hidden="true" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
