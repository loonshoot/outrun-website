'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useGraphQLClient } from '../../../hooks/useGraphQLClient';
import { GET_WORKSPACE_SOURCES } from '../../../graphql/queries/sources';
import '../../../i18n';

export default function SourcesPage({ params }) {
  const { workspaceSlug } = params;
  const router = useRouter();
  const graphQLClient = useGraphQLClient();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated || !graphQLClient) return;

    const fetchSources = async () => {
      try {
        setLoading(true);
        const { data } = await graphQLClient.query({
          query: GET_WORKSPACE_SOURCES,
          variables: { workspaceSlug }
        });
        setSources(data.workspace.sources || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, [hasHydrated, graphQLClient, workspaceSlug]);

  if (!hasHydrated) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading sources...</div>
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sources</h1>
        <button
          onClick={() => router.push(`/${workspaceSlug}/sources/add`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Source
        </button>
      </div>

      {sources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No sources configured yet.</p>
          <button
            onClick={() => router.push(`/${workspaceSlug}/sources/add`)}
            className="text-blue-600 hover:text-blue-700"
          >
            Add your first source →
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <div
              key={source.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/${workspaceSlug}/sources/${source.id}`)}
            >
              <h3 className="text-xl font-semibold mb-2">{source.name}</h3>
              <p className="text-gray-600 mb-4">{source.type}</p>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${source.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                  {source.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(source.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}