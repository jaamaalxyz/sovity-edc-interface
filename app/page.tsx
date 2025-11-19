import Link from "next/link";
import { FiArrowRight, FiDatabase, FiShield } from "react-icons/fi";
import { MdLink } from "react-icons/md";

import Card, { CardBody, CardHeader } from "@/components/Card";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Sovity EDC Manager
        </h1>
        <p className="text-xl text-gray-600">
          Manage your dataspace assets, policies, and contracts with ease
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/assets">
          <Card hoverable className="h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary-100 p-3">
                  <FiDatabase className="size-6 text-primary-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Assets</h2>
              </div>
            </CardHeader>
            <CardBody>
              <p className="mb-4 text-gray-600">
                Create, view, update, and manage data assets in your dataspace
                connector.
              </p>
              <div className="flex items-center font-medium text-primary-600">
                Manage Assets
                <FiArrowRight className="ml-2" />
              </div>
            </CardBody>
          </Card>
        </Link>

        <Link href="/policies">
          <Card hoverable className="h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-3">
                  <FiShield className="size-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Policies
                </h2>
              </div>
            </CardHeader>
            <CardBody>
              <p className="mb-4 text-gray-600">
                Define access policies, permissions, and constraints for your
                data assets.
              </p>
              <div className="flex items-center font-medium text-green-600">
                Manage Policies
                <FiArrowRight className="ml-2" />
              </div>
            </CardBody>
          </Card>
        </Link>

        <Link href="/contracts">
          <Card hoverable className="h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-3">
                  <MdLink className="size-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Contracts
                </h2>
              </div>
            </CardHeader>
            <CardBody>
              <p className="mb-4 text-gray-600">
                Link assets to policies by creating contract definitions for
                data sharing.
              </p>
              <div className="flex items-center font-medium text-purple-600">
                Manage Contracts
                <FiArrowRight className="ml-2" />
              </div>
            </CardBody>
          </Card>
        </Link>
      </div>

      <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-blue-900">
          Getting Started
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>• Ensure your Sovity EDC connector is running</li>
          <li>• Configure the API endpoint in your .env.local file</li>
          <li>
            • Create assets and policies, then link them with contract
            definitions
          </li>
        </ul>
      </div>
    </div>
  );
}
