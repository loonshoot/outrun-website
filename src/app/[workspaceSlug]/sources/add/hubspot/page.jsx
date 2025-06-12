'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useGraphQLClient } from '../../../../../hooks/useGraphQLClient';
import { CREATE_OAUTH_URL, CREATE_SOURCE, GET_WORKSPACE } from '../../../../../graphql/queries/sources';
import '../../../../../i18n';

export default function HubSpotSourcePage({ params }) {
  const { workspaceSlug } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const graphQLClient = useGraphQLClient();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sourceName, setSourceName] = useState('HubSpot Integration');
  
  // OAuth state
  const [authToken, setAuthToken] = useState(null);
  const authCode = searchParams.get('code');
  const authError = searchParams.get('error');
  const state = searchParams.get('state');

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated || !graphQLClient) return;

    // Handle OAuth callback
    if (authCode && state) {
      handleOAuthCallback();
    } else if (authError) {
      setError(`Authentication failed: ${authError}`);
    }
  }, [hasHydrated, graphQLClient, authCode, state, authError]);

  const handleOAuthCallback = async () => {
    try {
      setLoading(true);
      // Parse state to get workspace info
      const stateData = JSON.parse(atob(state));
      
      if (stateData.workspaceSlug !== workspaceSlug) {
        throw new Error('Invalid state parameter');
      }

      // Exchange code for token (this would typically be done server-side)
      // For now, we'll assume the token exchange happens in the API callback
      setAuthToken(authCode);
      
      // Create the source
      await createSource(authCode);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startOAuthFlow = async () => {
    try {
      setLoading(true);
      
      // Create OAuth URL
      const { data } = await graphQLClient.query({
        query: CREATE_OAUTH_URL,
        variables: {
          service: 'hubspot',
          workspaceSlug,
          redirectUri: `${window.location.origin}/api/callback/sources/add/hubspot`,
          scopes: ['crm.objects.contacts.read', 'crm.objects.companies.read', 'crm.objects.deals.read']
        }
      });

      // Redirect to OAuth URL
      window.location.href = data.createOAuthUrl.url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const createSource = async (token) => {
    try {
      const { data } = await graphQLClient.mutate({
        mutation: CREATE_SOURCE,
        variables: {
          workspaceSlug,
          input: {
            name: sourceName,
            type: 'hubspot',
            config: {
              accessToken: token,
              syncContacts: true,
              syncCompanies: true,
              syncDeals: true
            }
          }
        }
      });

      // Schedule initial sync job
      await graphQLClient.mutate({
        mutation: SCHEDULE_SYNC_JOB,
        variables: {
          sourceId: data.createSource.id
        }
      });

      // Redirect to sources page
      router.push(`/${workspaceSlug}/sources`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!hasHydrated) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.push(`/${workspaceSlug}/sources/add`)}
          className="text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center"
        >
          ← Back to Source Selection
        </button>
        
        <h1 className="text-3xl font-bold">Connect HubSpot</h1>
        <p className="text-gray-600 mt-2">
          Sync your HubSpot CRM data including contacts, companies, and deals
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {!authToken ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <span className="text-blue-600 font-semibold mr-3">1.</span>
              <p className="text-gray-700">
                Click the "Connect HubSpot" button below to authenticate with your HubSpot account
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 font-semibold mr-3">2.</span>
              <p className="text-gray-700">
                Grant access to read your CRM data (contacts, companies, and deals)
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 font-semibold mr-3">3.</span>
              <p className="text-gray-700">
                Once connected, we'll automatically sync your data periodically
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source Name
            </label>
            <input
              type="text"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., HubSpot Production"
            />
          </div>

          <button
            onClick={startOAuthFlow}
            disabled={loading || !sourceName.trim()}
            className="w-full bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Connecting...' : 'Connect HubSpot'}
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold mb-2">Successfully Connected!</h2>
            <p className="text-gray-600 mb-4">
              Setting up your HubSpot integration...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">What data will be synced?</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• All contacts with their properties and activities</li>
          <li>• Companies and their associated contacts</li>
          <li>• Deals and pipeline information</li>
          <li>• Custom properties and fields</li>
        </ul>
      </div>
    </div>
  );
}