'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useGraphQLClient } from '../../../../../hooks/useGraphQLClient';
import { CREATE_OAUTH_URL, CREATE_SOURCE, SCHEDULE_SYNC_JOB } from '../../../../../graphql/queries/sources';
import '../../../../../i18n';

export default function ConfluenceSourcePage({ params }) {
  const { workspaceSlug } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const graphQLClient = useGraphQLClient();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sourceName, setSourceName] = useState('Confluence Knowledge Base');
  const [siteUrl, setSiteUrl] = useState('');
  
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
      setSiteUrl(stateData.siteUrl || '');
      
      // Create the source
      await createSource(authCode, stateData.siteUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startOAuthFlow = async () => {
    try {
      setLoading(true);
      
      if (!siteUrl.trim()) {
        throw new Error('Please enter your Confluence site URL');
      }

      // Extract site name from URL
      const siteMatch = siteUrl.match(/https?:\/\/([^.]+)\.atlassian\.net/);
      if (!siteMatch) {
        throw new Error('Invalid Confluence URL. Expected format: https://your-domain.atlassian.net');
      }

      // Create OAuth URL with Atlassian
      const { data } = await graphQLClient.query({
        query: CREATE_OAUTH_URL,
        variables: {
          service: 'atlassian',
          workspaceSlug,
          redirectUri: `${window.location.origin}/api/callback/sources/add/confluence`,
          scopes: ['read:confluence-space.summary', 'read:confluence-content.all', 'read:confluence-content.summary'],
          additionalParams: {
            siteUrl: siteUrl
          }
        }
      });

      // Redirect to OAuth URL
      window.location.href = data.createOAuthUrl.url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const createSource = async (token, site) => {
    try {
      const { data } = await graphQLClient.mutate({
        mutation: CREATE_SOURCE,
        variables: {
          workspaceSlug,
          input: {
            name: sourceName,
            type: 'confluence',
            config: {
              accessToken: token,
              siteUrl: site,
              syncSpaces: 'all', // or specific space keys
              syncAttachments: true,
              syncComments: false
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
        
        <h1 className="text-3xl font-bold">Connect Confluence</h1>
        <p className="text-gray-600 mt-2">
          Import your knowledge base content from Atlassian Confluence
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
                Enter your Confluence site URL below
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 font-semibold mr-3">2.</span>
              <p className="text-gray-700">
                Authenticate with your Atlassian account
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 font-semibold mr-3">3.</span>
              <p className="text-gray-700">
                Grant access to read your Confluence spaces and pages
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Name
              </label>
              <input
                type="text"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Company Wiki"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confluence Site URL
              </label>
              <input
                type="url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://your-domain.atlassian.net"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your Atlassian Confluence URL
              </p>
            </div>
          </div>

          <button
            onClick={startOAuthFlow}
            disabled={loading || !sourceName.trim() || !siteUrl.trim()}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Connecting...' : 'Connect Confluence'}
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold mb-2">Successfully Connected!</h2>
            <p className="text-gray-600 mb-4">
              Setting up your Confluence integration...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">What content will be synced?</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• All spaces you have access to (or selected spaces)</li>
          <li>• Pages, blog posts, and their content</li>
          <li>• Attachments and embedded files</li>
          <li>• Page hierarchy and structure</li>
          <li>• Last modified dates and authors</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-semibold text-blue-700 mb-2">Note on Permissions</h3>
        <p className="text-sm text-blue-600">
          Only content you have permission to view in Confluence will be synced. 
          Make sure the authenticating user has access to all spaces you want to import.
        </p>
      </div>
    </div>
  );
}