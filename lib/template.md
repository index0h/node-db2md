<%= header %>

<% _.each(tables, function (table, tableName) { %>
## <%= tableName %>

<%= table.comment %>

<%= table.table %>

<%= table.footer %>

<% }) %>

<% _.each(groups, function (group) { %>
# <%= group.name %>

<%= group.comment %>

<% _.each(group.tables, function (table, tableName) { %>
## <%= tableName %>

<%= table.comment %>

<%= table.table %>

<%= table.footer %>

<% }) %>

<%= group.footer %>

<% }) %>

<%= footer %>