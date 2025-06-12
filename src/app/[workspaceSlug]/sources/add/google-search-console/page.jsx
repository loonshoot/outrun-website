'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useGraphQLClient } from '../../../../../hooks/useGraphQLClient';
import { CREATE_OAUTH_URL, CREATE_SOURCE, SCHEDULE_SYNC_JOB } from '../../../../../graphql/queries/sources';
import '../../../../../i18n';

export default function GoogleSearchConsolePage({ params }) {
  const { workspaceSlug } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const graphQLClient = useGraphQLClient();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sourceName, setSourceName] = useState('Google Search Console');
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [availableProperties, setAvailableProperties] = useState([]);
  
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

      setAuthToken(authCode);
      
      // Fetch available properties after authentication
      await fetchAvailableProperties(authCode);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableProperties = async (token) => {
    try {
      // This would typically call your API to list GSC properties
      // For now, we'll simulate with mock data
      const mockProperties = [
        { url: 'https://example.com', type: 'Domain' },
        { url: 'https://blog.example.com', type: 'Domain' },
        { url: 'https://app.example.com', type: 'URL prefix' }
      ];
      setAvailableProperties(mockProperties);
    } catch (err) {
      setError('Failed to fetch Search Console properties');
    }
  };

  const startOAuthFlow = async () => {
    try {
      setLoading(true);
      
      // Create OAuth URL with Google
      const { data } = await graphQLClient.query({
        query: CREATE_OAUTH_URL,
        variables: {
          service: 'google',
          workspaceSlug,
          redirectUri: `${window.location.origin}/api/callback/sources/add/google-search-console`,
          scopes: [
            'https://www.googleapis.com/auth/webmasters.readonly',
            'https://www.googleapis.com/auth/siteverification.verify_only'
          ]
        }
      });

      // Redirect to OAuth URL
      window.location.href = data.createOAuthUrl.url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const createSource = async () => {
    try {
      setLoading(true);
      
      if (selectedProperties.length === 0) {
        throw new Error('Please select at least one property to sync');
      }

      const { data } = await graphQLClient.mutate({
        mutation: CREATE_SOURCE,
        variables: {
          workspaceSlug,
          input: {
            name: sourceName,
            type: 'google-search-console',
            config: {
              accessToken: authToken,
              properties: selectedProperties,
              metrics: ['clicks', 'impressions', 'ctr', 'position'],
              dimensions: ['query', 'page', 'country', 'device'],
              dateRange: 'last_30_days'
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
      setLoading(false);
    }
  };

  const toggleProperty = (property) => {
    setSelectedProperties(prev => {
      const isSelected = prev.find(p => p.url === property.url);
      if (isSelected) {
        return prev.filter(p => p.url !== property.url);
      } else {
        return [...prev, property];
      }
    });
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
        
        <h1 className="text-3xl font-bold">Connect Google Search Console</h1>
        <p className="text-gray-600 mt-2">
          Track your website's search performance and visibility on Google
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
                Click the button below to authenticate with your Google account
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 font-semibold mr-3">2.</span>
              <p className="text-gray-700">
                Grant access to read your Search Console data
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 font-semibold mr-3">3.</span>
              <p className="text-gray-700">
                Select which properties you want to sync
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
              placeholder="e.g., Main Website GSC"
            />
          </div>

          <button
            onClick={startOAuthFlow}
            disabled={loading || !sourceName.trim()}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              'Connecting...'
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Connect with Google
              </>
            )}
          </button>
        </div>
      ) : availableProperties.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Select Properties to Sync</h2>
          <p className="text-gray-600 mb-6">
            Choose which Search Console properties you want to sync data from:
          </p>

          <div className="space-y-3 mb-6">
            {availableProperties.map((property) => (
              <label
                key={property.url}
                className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedProperties.some(p => p.url === property.url)}
                  onChange={() => toggleProperty(property)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <div className="ml-3">
                  <div className="font-medium">{property.url}</div>
                  <div className="text-sm text-gray-500">{property.type}</div>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={createSource}
            disabled={loading || selectedProperties.length === 0}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Source...' : 'Create Source'}
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold mb-2">Successfully Connected!</h2>
            <p className="text-gray-600 mb-4">
              Loading your Search Console properties...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">What data will be synced?</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Search queries and their performance metrics</li>
          <li>• Page-level search performance data</li>
          <li>• Clicks, impressions, CTR, and average position</li>
          <li>• Performance by country and device type</li>
          <li>• Historical data (up to 16 months)</li>
        </ul>
      </div>
    </div>
  );
}