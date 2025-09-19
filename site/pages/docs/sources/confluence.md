---
layout: layouts/docs.liquid
title: Confluence Source
description: Connect Confluence to Outrun. Sync pages, blog posts, and document relationships with comprehensive content and metadata extraction.
metaTitle: Confluence Integration - Outrun Source Documentation
metaDescription: Complete guide to integrating Confluence with Outrun. Document mappings, content extraction, space relationships, and collaboration data.
permalink: /docs/sources/confluence/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Sources
    url: /docs/sources/
  - title: Confluence
    url: /docs/sources/confluence/
---

# Confluence Source

Connect your Confluence instance to Outrun for comprehensive knowledge base and document synchronization. Confluence specializes in document-centric data with rich content and collaboration metadata.

<div class="bg-blue-600 bg-opacity-10 border border-blue-600  p-6 my-6">
  <h3 class="text-blue-400 text-lg font-semibold mb-3">📄 Document-Focused Integration</h3>
  <p class="text-gray-300">Confluence integration focuses on documents and content rather than traditional CRM objects. Perfect for knowledge management and content synchronization use cases.</p>
</div>

## Supported Objects

Confluence maps to the following standardized objects:

### 📄 Documents (from Content Objects)
- **Pages**: Standard Confluence pages
- **Blog Posts**: Space blog posts and announcements
- **Primary ID**: Content ID
- **Key Fields**: Title, body content, author, space, URL, status

### 🔗 Relationships (Document-Centric)
- **Document ↔ Space**: Page/post belongs to space
- **Document ↔ User**: Author and collaboration relationships
- **Document ↔ Document**: Page hierarchies and cross-references

## Authentication

Confluence uses Atlassian OAuth 2.0:

1. **OAuth Flow**: Atlassian OAuth 2.0 with refresh tokens
2. **Atlassian Console**: Requires app registration in Atlassian Developer Console
3. **Scopes Required**:
   - `read:confluence-content.all` - Read all content
   - `read:confluence-space.summary` - Read space information
   - `read:confluence-user` - Read user information
4. **Instance Types**: Supports both Cloud and Server instances
5. **Token Management**: Automatic refresh with secure storage

## Field Mappings

### Documents (Pages)

| Outrun Field | Confluence Field | Type | Description |
|--------------|------------------|------|-------------|
| `title` | `title` | String | Page title |
| `body` | `body.view.value` | HTML | Page content (rendered HTML) |
| `url` | `_links.self` | String | Direct link to page |
| `author` | `version.by.displayName` | String | Page author name |
| `authorEmail` | `version.by.email` | String | Page author email |
| `createdAt` | `history.createdDate` | DateTime | Page creation date |
| `updatedAt` | `version.when` | DateTime | Last modification date |
| `spaceKey` | `space.key` | String | Space identifier |
| `spaceName` | `space.name` | String | Space display name |
| `status` | `status` | String | Page status (current, draft, etc.) |
| `type` | `type` | String | Content type (page) |

### Documents (Blog Posts)

| Outrun Field | Confluence Field | Type | Description |
|--------------|------------------|------|-------------|
| `title` | `title` | String | Blog post title |
| `body` | `body.view.value` | HTML | Blog post content (rendered HTML) |
| `url` | `_links.self` | String | Direct link to blog post |
| `author` | `version.by.displayName` | String | Blog post author name |
| `authorEmail` | `version.by.email` | String | Blog post author email |
| `createdAt` | `history.createdDate` | DateTime | Blog post creation date |
| `updatedAt` | `version.when` | DateTime | Last modification date |
| `spaceKey` | `space.key` | String | Space identifier |
| `spaceName` | `space.name` | String | Space display name |
| `status` | `status` | String | Blog post status |
| `type` | `type` | String | Content type (blogpost) |

### Relationships

#### Document-Space Relationships
- **Relationship Type**: `belongsTo`
- **Entity A**: Document (page or blog post)
- **Entity B**: Space
- **Attributes**: Space key, space type

#### Document-User Relationships  
- **Relationship Type**: Variable (author, contributor, etc.)
- **Entity A**: Document
- **Entity B**: User
- **Attributes**: Role (author, editor, viewer)

#### Document-Document Relationships
- **Relationship Type**: Variable (parent, child, reference)
- **Entity A**: Source document
- **Entity B**: Target document
- **Attributes**: Relation type (hierarchy, cross-reference)

## Rate Limits

Confluence has moderate rate limits that Outrun respects:

- **Default Operations**: 50 requests per 10 seconds
- **Search Operations**: 3 requests per second
- **Content Retrieval**: Optimized for bulk content access

<div class="bg-yellow bg-opacity-10 border border-yellow  p-6 my-6">
  <h3 class="text-yellow text-lg font-semibold mb-3">📊 Content-Heavy Operations</h3>
  <p class="text-gray-300">Confluence content can be large (HTML, attachments, comments). Outrun optimizes content retrieval and handles large payloads efficiently while respecting rate limits.</p>
</div>

## Sync Behavior

### Initial Sync
- **Backfill Period**: 30 days by default
- **Polling Interval**: 60 minutes
- **Data Processing**:
  1. Raw content → `_stream` collection
  2. Processed content → `_consolidate` collection
  3. Standardized objects → Documents, Relationships
  4. Content indexing → Full-text search capabilities

### Continuous Sync
- **Change Detection**: Version-based change tracking
- **Update Frequency**: Every 60 minutes
- **Incremental Updates**: Only modified content processed
- **Content Versioning**: Track content changes and revisions

### Content Processing
- **HTML Extraction**: Clean HTML content extraction
- **Metadata Parsing**: Author, dates, space information
- **Relationship Detection**: Automatic space and user relationships
- **Comment Handling**: Optional comment extraction and processing

## Content Features

### Rich Content Support
- **HTML Content**: Full HTML content with formatting preserved
- **Attachments**: Metadata about attached files (URLs, types, sizes)
- **Macros**: Confluence macro content where applicable
- **Tables**: Structured table data extraction
- **Links**: Internal and external link detection

### Collaboration Data
- **Author Information**: Complete author details and contact info
- **Version History**: Track content evolution over time
- **Space Context**: Organize content by Confluence spaces
- **Status Tracking**: Draft, published, archived status handling

### Search and Discovery
- **Full-Text Search**: Content indexed for search capabilities
- **Metadata Search**: Search by author, space, dates, status
- **Relationship Queries**: Find related documents and spaces
- **Content Analytics**: Usage and collaboration metrics

## System Nuances

### Confluence-Specific Considerations

1. **Content Types**: Pages and blog posts have different structures and purposes
2. **Space Organization**: All content belongs to spaces with specific permissions
3. **Version Control**: Confluence tracks detailed version history
4. **Macro Content**: Some content may be generated by Confluence macros
5. **Permissions**: Content access respects Confluence space and page permissions
6. **Attachments**: File attachments are referenced but not content-synced

### Data Quality Notes

- **HTML Content**: Content includes full HTML formatting and structure
- **Author Tracking**: Comprehensive author and editor information
- **Date Precision**: Accurate creation and modification timestamps
- **Space Context**: All content properly categorized by space
- **Status Accuracy**: Real-time status updates (draft, published, archived)

### Performance Considerations

- **Content Size**: Large pages may require special handling
- **Bulk Operations**: Efficient batch processing for space-wide syncs
- **Incremental Sync**: Version-based change detection minimizes data transfer
- **Content Caching**: Intelligent caching for frequently accessed content

## Best Practices

### Setup Recommendations

1. **Atlassian Console**: Create dedicated app in Atlassian Developer Console
2. **Permissions**: Ensure access to required spaces and content
3. **Space Selection**: Identify which spaces to include/exclude
4. **Content Types**: Configure page vs blog post preferences
5. **User Access**: Verify user permissions for content access

### Performance Optimization

1. **Space Filtering**: Sync only necessary spaces to reduce data volume
2. **Content Filtering**: Configure content type and status filters
3. **Incremental Sync**: Leverage version-based change detection
4. **Monitoring**: Watch for large content items that may slow sync
5. **Scheduling**: Plan syncs during low-usage periods

### Content Management

1. **HTML Handling**: Plan for HTML content processing in destinations
2. **Attachment Strategy**: Decide how to handle file attachments
3. **Version Control**: Consider version history requirements
4. **Search Integration**: Leverage full-text search capabilities
5. **Relationship Mapping**: Utilize space and author relationships

## Troubleshooting

### Common Issues

**Authentication Failures**
- Verify Atlassian Console app configuration
- Check OAuth scopes and permissions
- Ensure user has access to required spaces
- Confirm instance URL is correct (Cloud vs Server)

**Content Access Issues**
- Verify space permissions for sync user
- Check page-level restrictions
- Confirm content status (published vs draft)
- Review space archival status

**Large Content Handling**
- Monitor sync logs for timeout issues
- Consider content size limits
- Check for macro-generated content issues
- Verify attachment handling

**Rate Limit Errors**
- Monitor API usage patterns
- Adjust sync frequency if needed
- Check for concurrent API usage
- Contact support for optimization

### Support Resources

- **Atlassian Developer Documentation**: [developer.atlassian.com](https://developer.atlassian.com)
- **Confluence REST API**: [developer.atlassian.com/cloud/confluence/rest/](https://developer.atlassian.com/cloud/confluence/rest/)
- **Outrun Support**: [support@getoutrun.com](mailto:support@getoutrun.com)
- **Community**: [Discord](https://discord.gg/outrun)

## Use Cases

### Knowledge Management
- **Content Synchronization**: Keep knowledge bases in sync across systems
- **Search Integration**: Enable cross-platform content search
- **Backup and Archival**: Maintain content backups and historical records

### Collaboration Analytics
- **Author Tracking**: Monitor content creation and collaboration patterns
- **Space Analytics**: Analyze space usage and content distribution
- **Version Analysis**: Track content evolution and update frequency

### Content Migration
- **Platform Migration**: Move content between Confluence instances
- **Format Conversion**: Transform Confluence content for other systems
- **Selective Export**: Extract specific spaces or content types

---

*Ready to connect Confluence? Follow our [Getting Started guide](/docs/getting-started/) to set up your first sync.* 