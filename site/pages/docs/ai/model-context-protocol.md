---
layout: layouts/docs.liquid
title: Model Context Protocol (MCP)
description: Connect AI models directly to your data through the Model Context Protocol. Enable LLMs to query, analyze, and interact with your standardized data.
metaTitle: Model Context Protocol - Outrun Integration Documentation
metaDescription: Complete guide to using the Model Context Protocol with Outrun. AI model integration, authentication, querying, and best practices.
permalink: /docs/ai/model-context-protocol/
breadcrumbs:
  - title: Documentation
    url: /docs/
  - title: AI
    url: /docs/ai/
  - title: Model Context Protocol
    url: /docs/ai/model-context-protocol/
---
The Model Context Protocol destination enables AI models to directly query and interact with your standardized data. This integration provides a secure, standardized way for Large Language Models (LLMs) to access your business data for analysis, insights, and automated decision-making.

<div class="bg-purple-500 bg-opacity-10 border border-purple-500 rounded-lg p-6 my-6">
  <h3 class="text-purple-400 text-lg font-semibold mb-3">🤖 AI-Powered Data Access</h3>
  <p class="text-gray-300">MCP destination transforms your Outrun workspace into an AI-accessible data source, enabling natural language queries, automated analysis, and intelligent insights generation while maintaining security and access controls.</p>
</div>

## What is the Model Context Protocol?

The Model Context Protocol (MCP) is an open standard developed by Anthropic that enables secure connections between AI applications and data sources. It provides a standardized way for AI models to discover, access, and interact with external data systems without requiring custom integrations.

In the context of Outrun, MCP acts as a bridge between your standardized data and AI models, allowing them to understand your data structure, execute queries, and provide intelligent insights about your business operations.

## How MCP Works with Outrun

When you configure MCP as a destination in Outrun, you're essentially making your workspace data available to AI models through a standardized protocol. The integration works through several key components:

**Data Exposure**: Your standardized objects (People, Organizations, Relationships, Facts) become queryable resources that AI models can discover and understand. The MCP server provides schema information, field definitions, and relationship mappings to help AI models understand your data structure.

**Query Interface**: AI models can execute GraphQL queries against your data, enabling them to retrieve specific information, perform aggregations, and explore relationships between objects. This provides a powerful interface for data analysis and insight generation.

**Security Layer**: All access is controlled through bearer token authentication, ensuring that only authorized AI applications can access your data. The integration provides read-only access, maintaining data integrity while enabling comprehensive analysis capabilities.

**Real-time Access**: Unlike traditional data exports or APIs, MCP provides real-time access to your current data, ensuring that AI models always work with the most up-to-date information from your connected sources.

## Setting Up MCP Integration

Setting up MCP follows a simple three-step wizard in your Outrun workspace:

• **Step 1: Name Your Integration** - Navigate to Destinations → Add Destination → Model Context Protocol. Provide a descriptive name for your MCP integration that will appear in your destinations list and audit logs.

• **Step 2: Configure Access Controls** - Optionally set IP address restrictions to limit access to specific AI services or your organization's infrastructure. This provides an additional security layer beyond bearer token authentication.

• **Step 3: Create and Connect** - Review your configuration and create the destination. Outrun generates a dedicated bearer token and provides the MCP server endpoint URL needed to connect AI models to your data.

The integration uses bearer token authentication with read-only access to your standardized data, maintaining full audit trails of all AI model interactions while ensuring data integrity and security compliance.

## AI Model Integration

Once configured, AI models connect using the provided endpoint and bearer token, with popular platforms including Claude Desktop, custom MCP client applications, and various AI development frameworks that support the standard MCP protocol.

When connected, AI models automatically discover your data schema including object types (People, Organizations, Relationships, Facts), field definitions, relationship mappings, and available query capabilities, enabling them to understand your data structure without manual configuration.

AI models can execute GraphQL queries for direct object retrieval, aggregations, relationship traversal, and schema exploration, providing a powerful and flexible interface for data analysis and insight generation.

## Use Cases and Applications

**Data Analysis and Insights** - AI models automatically analyze your standardized data to identify patterns, trends, anomalies, duplicate records, relationship patterns, and data quality issues while generating insights about customer behavior and business trends.

**Natural Language Querying** - Ask questions in plain English like "How many new contacts were added this month?" or "Which organizations have the most engagement?" and receive accurate, data-driven responses as AI models translate natural language into GraphQL queries.

**Automated Reporting** - Generate executive summaries, data quality reports, source system analyses, and custom reports based on current data, with scheduling and event-triggered capabilities for timely insights without manual effort.

**Data Exploration and Discovery** - AI models suggest interesting queries based on data patterns, identify enrichment opportunities, and recommend workflow optimizations to help discover insights and relationships that might otherwise go unnoticed.

## Key Considerations

**Performance and Rate Limiting** - The MCP server respects Outrun's standard rate limiting policies to ensure AI queries don't impact regular workflows, so design applications with appropriate query patterns and caching strategies to optimize performance.

**Data Privacy and Compliance** - All data access is logged and auditable for compliance with privacy regulations, but ensure your AI applications handle sensitive business data appropriately despite read-only access restrictions.

**Cost Considerations** - Monitor API usage and query patterns as high-volume AI queries may impact costs, and implement optimization strategies to minimize unnecessary data access while maintaining functionality.

## Best Practices

**Security Implementation** - Use IP address restrictions, regularly rotate bearer tokens, monitor access logs for unusual patterns, store tokens securely, and avoid exposing them in client-side code or logs.

**Query Optimization** - Use GraphQL field selection to retrieve only necessary data, implement caching strategies, and consider query timing and frequency to avoid overwhelming the system during peak periods.

**Integration Strategy** - Start with specific, well-defined use cases before expanding to complex scenarios, develop clear guidelines for AI data access, and ensure your team understands the integration's capabilities and limitations.

**Monitoring and Maintenance** - Set up alerts for unusual query volumes or access patterns, keep AI applications updated with latest MCP features, and regularly review access controls and IP restrictions.

## Troubleshooting

**Connection Issues** - Verify endpoint URL and bearer token configuration, check IP address restrictions allow access from your AI service, and ensure tokens have appropriate permissions and haven't expired.

**Query Performance Problems** - Optimize query patterns to reduce complexity, monitor resource-intensive aggregation queries, and implement caching strategies or query optimization techniques.

**Authentication Failures** - Check bearer token configuration and permissions, review audit logs for specific error messages, and verify tokens haven't been revoked or expired.

## Technical Specifications

### API Endpoints

The MCP server provides several key endpoints for AI model integration:

- **Server Info**: `/mcp/server-info` - Provides server capabilities and version information
- **Resources**: `/mcp/resources` - Lists available data resources and schema information  
- **Tools**: `/mcp/tools` - Describes available query and analysis tools
- **Query Execution**: `/mcp/query` - Executes GraphQL queries against your data

### Supported MCP Features

The Outrun MCP integration supports the core MCP protocol features including resource discovery for automatic schema understanding, tool execution for query and analysis operations, and secure authentication through bearer tokens.

### Data Formats

All data returned through the MCP interface follows Outrun's standardized object format, ensuring consistency with other destinations and sources. GraphQL queries return data in standard JSON format with appropriate type information and relationship references.

## Getting Started

Navigate to Destinations → Add Destination → Model Context Protocol in your workspace, follow the configuration wizard, and use the provided endpoint and bearer token to connect AI models according to your platform's MCP integration documentation.

For additional support or questions about MCP integration, consult the Outrun support documentation or contact your support team for assistance. 