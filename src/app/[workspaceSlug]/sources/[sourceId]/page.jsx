'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useGraphQLClient } from '../../../../hooks/useGraphQLClient';
import { GET_SOURCE_DETAILS } from '../../../../graphql/queries/sources';
import '../../../../i18n';

export default function SourceDetailPage({ params }) {
  const { workspaceSlug, sourceId } = params;
  const router = useRouter();
  const graphQLClient = useGraphQLClient();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated || !graphQLClient) return;

    const fetchSourceDetails = async () => {
      try {
        setLoading(true);
        const { data } = await graphQLClient.query({
          query: GET_SOURCE_DETAILS,
          variables: { sourceId, workspaceSlug }
        });
        setSource(data.source);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSourceDetails();
  }, [hasHydrated, graphQLClient, sourceId, workspaceSlug]);

  const handleRefresh = async () => {
    // Implementation for refreshing source data
    console.log('Refreshing source:', sourceId);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this source?')) {
      // Implementation for deleting source
      console.log('Deleting source:', sourceId);
    }
  };

  if (!hasHydrated) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading source details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!source) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Source not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.push(`/${workspaceSlug}/sources`)}
          className="text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center"
        >
          ← Back to Sources
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{source.name}</h1>
            <p className="text-gray-600 mt-2">Type: {source.type}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Refresh
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${source.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                {source.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Sync:</span>
              <span className="font-medium">
                {source.lastSync ? new Date(source.lastSync).toLocaleString() : 'Never'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="font-medium">
                {new Date(source.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Sync Frequency:</span>
              <span className="font-medium">{source.syncFrequency || 'Manual'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Records Synced:</span>
              <span className="font-medium">{source.recordsCount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {source.recentActivity && source.recentActivity.length > 0 ? (
            source.recentActivity.map((activity, index) => (
              <div key={index} className="flex justify-between py-2 border-b last:border-0">
                <span className="text-gray-600">{activity.description}</span>
                <span className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}