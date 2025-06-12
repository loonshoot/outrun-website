'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import '../../../../../i18n';

const SOURCE_TYPES = [
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Connect your HubSpot CRM to sync contacts, deals, and companies',
    icon: '🟠',
    available: true
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Integrate with Salesforce CRM for comprehensive data sync',
    icon: '☁️',
    available: true
  },
  {
    id: 'confluence',
    name: 'Confluence',
    description: 'Import knowledge base content from Atlassian Confluence',
    icon: '📄',
    available: true
  },
  {
    id: 'google-search-console',
    name: 'Google Search Console',
    description: 'Track search performance and website visibility',
    icon: '🔍',
    available: true
  },
  {
    id: 'zohocrm',
    name: 'Zoho CRM',
    description: 'Sync your Zoho CRM data including leads and contacts',
    icon: '🔴',
    available: true
  }
];

export default function AddSourcePage({ params }) {
  const { workspaceSlug } = params;
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const handleSourceSelect = (sourceType) => {
    router.push(`/${workspaceSlug}/sources/add/${sourceType}`);
  };

  if (!hasHydrated) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.push(`/${workspaceSlug}/sources`)}
          className="text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center"
        >
          ← Back to Sources
        </button>
        <h1 className="text-3xl font-bold">Add a New Source</h1>
        <p className="text-gray-600 mt-2">Choose a source type to connect to your workspace</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SOURCE_TYPES.map((source) => (
          <div
            key={source.id}
            className={`border rounded-lg p-6 ${
              source.available
                ? 'hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-300'
                : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={() => source.available && handleSourceSelect(source.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-4xl">{source.icon}</span>
              {!source.available && (
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                  Coming Soon
                </span>
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2">{source.name}</h3>
            <p className="text-gray-600 text-sm">{source.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}