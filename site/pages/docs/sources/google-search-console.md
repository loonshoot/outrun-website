---
layout: layouts/docs.liquid
title: Google Search Console Source
description: Connect Google Search Console to Outrun. Sync search analytics, performance data, and SEO metrics with comprehensive facts mapping.
metaTitle: Google Search Console Integration - Outrun Source Documentation
metaDescription: Complete guide to integrating Google Search Console with Outrun. Analytics mappings, performance metrics, and SEO data synchronization.
permalink: /docs/sources/google-search-console/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: Sources
    url: /docs/sources/
  - title: Google Search Console
    url: /docs/sources/google-search-console/
---

# Google Search Console Source

Connect your Google Search Console to Outrun for comprehensive SEO and search performance data synchronization. This source specializes in analytics data and performance metrics rather than traditional CRM objects.

<div class="bg-green-500 bg-opacity-10 border border-green-500  p-6 my-6">
  <h3 class="text-green-400 text-lg font-semibold mb-3">📊 Analytics-Focused Integration</h3>
  <p class="text-gray-300">Google Search Console integration focuses on search analytics and performance data, stored in the `search_analytics_data` table for time-series analysis and reporting.</p>
</div>

## Supported Objects

Google Search Console maps to the following standardized objects:

### 📊 Search Analytics Data
- **Source Object**: `searchAnalytics`
- **Table**: `search_analytics_data`
- **Key Fields**: Clicks, impressions, CTR, position, query, page, date
- **Granularity**: Daily aggregation

## Authentication

Google Search Console uses Google OAuth 2.0:

1. **OAuth Flow**: Google OAuth 2.0 with refresh tokens
2. **Google Console**: Requires app registration in Google Cloud Console
3. **Scopes Required**:
   - `https://www.googleapis.com/auth/webmasters.readonly` - Read Search Console data
4. **Property Access**: User must have verified access to Search Console properties
5. **Token Management**: Automatic refresh with secure storage

## Field Mappings

### Search Analytics Data

| Outrun Field | Google Search Console Field | Type | Description |
|--------------|----------------------------|------|-------------|
| `site` | Property URL | String | The Search Console property |
| `property` | `site` | String | Search Console property URL |
| `entityId` | `page` | String | Page URL that received traffic |
| `entityType` | `"page"` | String | Fixed entity type |
| `value` | `clicks` | Number | Number of clicks received |
| `dateRange.from` | `date` | Date | Date of the analytics data |
| `dateRange.to` | `date` | Date | Same as from (daily data) |
| `location.country` | `country` | String | Country where searches originated |
| `dimensions.query` | `query` | String | Search query that triggered result |
| `dimensions.device` | `device` | String | Device type (desktop, mobile, tablet) |
| `period` | `"daily"` | String | Fixed aggregation period |
| `source` | `"googleSearchConsole"` | String | Fixed source identifier |

### Additional Metrics

| Metric | Field | Type | Description |
|--------|-------|------|-------------|
| **Impressions** | `impressions` | Number | Number of times page appeared in search results |
| **CTR** | `ctr` | Float | Click-through rate (clicks/impressions) |
| **Position** | `position` | Float | Average position in search results |
| **Date** | `date` | Date | Date of the analytics data |

## Rate Limits

Google Search Console has generous rate limits:

- **Default Operations**: 2000 requests per minute
- **Daily Quota**: Typically sufficient for most use cases
- **Batch Processing**: Efficient bulk data retrieval

<div class="bg-yellow bg-opacity-10 border border-yellow  p-6 my-6">
  <h3 class="text-yellow text-lg font-semibold mb-3">📈 High-Volume Analytics</h3>
  <p class="text-gray-300">Google Search Console can generate large volumes of analytics data. Outrun efficiently processes and aggregates this data while respecting API quotas and optimizing for performance.</p>
</div>

## Data Dimensions

Google Search Console provides multi-dimensional analytics data:

### Available Dimensions
- **Query**: Search terms that triggered your pages
- **Page**: URLs that appeared in search results  
- **Country**: Geographic location of searches
- **Device**: Device type (desktop, mobile, tablet)
- **Search Appearance**: Rich results, AMP, etc.
- **Date**: Time-based aggregation

### Dimension Combinations
- **Query + Page**: Which queries drive traffic to specific pages
- **Country + Device**: Geographic and device performance breakdown
- **Date + Query**: Query performance trends over time
- **Page + Country**: Geographic performance by page

## Sync Behavior

### Initial Sync
- **Backfill Period**: 30 days by default
- **Polling Interval**: 60 minutes
- **Data Processing**:
  1. Raw analytics → `stream_data` table
  2. Processed metrics → `consolidated_data` table
  3. Analytics data → `search_analytics_data` table
  4. Aggregation → Daily, weekly, monthly rollups

### Continuous Sync
- **Change Detection**: Date-based incremental updates
- **Update Frequency**: Every 60 minutes
- **Data Freshness**: Google Search Console data has 2-3 day delay
- **Historical Updates**: Retroactive data corrections handled

### Data Processing
- **Metric Calculation**: CTR and position calculations
- **Dimension Filtering**: Configurable dimension inclusion/exclusion
- **Aggregation Levels**: Support for different time periods
- **Data Validation**: Automatic data quality checks

## Analytics Features

### Performance Metrics
- **Clicks**: Actual user clicks from search results
- **Impressions**: Times your pages appeared in search results
- **CTR**: Click-through rate percentage
- **Position**: Average ranking position in search results

### Search Insights
- **Query Analysis**: Top performing search queries
- **Page Performance**: Best and worst performing pages
- **Geographic Data**: Performance by country and region
- **Device Breakdown**: Desktop vs mobile vs tablet performance

### Trend Analysis
- **Time Series**: Performance trends over time
- **Comparative Analysis**: Period-over-period comparisons
- **Seasonal Patterns**: Identify seasonal search trends
- **Performance Alerts**: Significant changes in metrics

## System Nuances

### Google Search Console-Specific Considerations

1. **Data Delay**: Search Console data has 2-3 day processing delay
2. **Sampling**: Large datasets may be sampled by Google
3. **Property Verification**: User must have verified property access
4. **Data Retention**: Google retains 16 months of data
5. **Dimension Limits**: API limits on dimension combinations
6. **Aggregation**: Data is pre-aggregated by Google

### Data Quality Notes

- **Accuracy**: Data reflects actual Google Search performance
- **Completeness**: Some data may be filtered for privacy
- **Consistency**: Metrics align with Search Console UI
- **Timeliness**: Regular updates with 2-3 day delay
- **Precision**: Position data averaged across all impressions

### Performance Considerations

- **Batch Processing**: Efficient retrieval of large date ranges
- **Dimension Optimization**: Strategic dimension selection for performance
- **Caching**: Intelligent caching for frequently accessed data
- **Incremental Updates**: Only new/changed data processed

## Best Practices

### Setup Recommendations

1. **Property Verification**: Ensure all target properties are verified
2. **Permission Levels**: Use account with appropriate Search Console access
3. **Property Selection**: Identify which properties to sync
4. **Date Range**: Configure appropriate historical data range
5. **Dimension Strategy**: Select relevant dimensions for your use case

### Performance Optimization

1. **Selective Dimensions**: Choose only necessary dimensions
2. **Date Filtering**: Limit date ranges to required periods
3. **Property Filtering**: Sync only active/relevant properties
4. **Monitoring**: Watch for API quota usage
5. **Scheduling**: Plan syncs to avoid peak usage times

### Analytics Strategy

1. **Metric Focus**: Identify key performance indicators
2. **Trend Analysis**: Set up time-series analysis
3. **Comparative Reporting**: Enable period comparisons
4. **Alert Configuration**: Set up performance change alerts
5. **Integration Planning**: Plan downstream analytics integration

## Troubleshooting

### Common Issues

**Authentication Failures**
- Verify Google Cloud Console app configuration
- Check OAuth scopes and permissions
- Ensure user has Search Console property access
- Confirm property verification status

**Data Access Issues**
- Verify property ownership/verification
- Check Search Console permission levels
- Confirm property is active and receiving data
- Review API quota and usage

**Missing Data**
- Account for 2-3 day data processing delay
- Check date range parameters
- Verify property has search traffic
- Review dimension filter settings

**Performance Issues**
- Monitor API quota usage
- Optimize dimension combinations
- Reduce date range scope
- Check for large property datasets

### Support Resources

- **Google Search Console Help**: [support.google.com/webmasters](https://support.google.com/webmasters)
- **Search Console API Documentation**: [developers.google.com/webmaster-tools](https://developers.google.com/webmaster-tools)
- **Google Cloud Console**: [console.cloud.google.com](https://console.cloud.google.com)
- **Outrun Support**: [support@getoutrun.com](mailto:support@getoutrun.com)
- **Community**: [Discord](https://discord.gg/outrun)

## Use Cases

### SEO Analytics
- **Performance Tracking**: Monitor search performance across properties
- **Keyword Analysis**: Track query performance and trends
- **Page Optimization**: Identify top and underperforming pages
- **Geographic Insights**: Understand regional search performance

### Business Intelligence
- **Traffic Analysis**: Integrate search data with business metrics
- **Conversion Tracking**: Combine with conversion data for ROI analysis
- **Competitive Analysis**: Benchmark against industry performance
- **Reporting Automation**: Automated SEO reporting and dashboards

### Content Strategy
- **Content Performance**: Measure content effectiveness in search
- **Keyword Research**: Identify high-performing search terms
- **Content Gaps**: Find opportunities for new content
- **Optimization Priorities**: Data-driven content optimization

---

*Ready to connect Google Search Console? Follow our [Getting Started guide](/docs/getting-started/) to set up your first sync.* 