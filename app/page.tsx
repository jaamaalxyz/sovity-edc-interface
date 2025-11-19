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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"></div>

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
