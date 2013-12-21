<%= header %>

<% _.each(tables, function (table, tableName) { %>
## <%= tableName %>. _<%= table.comment %>_

<%= table.header %>

<%= table.table %>

<%= table.footer %>

<% }) %>

<% _.each(groups, function (group) { %>
# <%= group.name %>

<%= group.comment %>

<% _.each(group.tables, function (table, tableName) { %>
## **<%= tableName %>**. <%= table.comment %>

<%= table.header %>

<%= table.table %>

<%= table.footer %>

<% }) %>

<%= group.footer %>

<% }) %>

<%= footer %>