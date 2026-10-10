export const exportToCSV = (nodes, alerts) => {
    // 1. Nodes Data
    const nodesHeader = ['Node ID', 'Name', 'Type', 'Status', 'Health', 'Temp (C)', 'Vib (g)', 'Current (A)', 'Fault', 'RUL (hrs)'];
    const nodesRows = nodes.map(node => [
        node.id,
        node.name,
        node.type,
        node.status,
        node.health.toFixed(2),
        node.temp.toFixed(2),
        node.vib.toFixed(2),
        node.current.toFixed(2),
        node.fault,
        node.rul.toFixed(0)
    ]);

    // 2. Alerts Data
    const alertsHeader = ['Alert ID', 'Source', 'Message', 'Severity', 'Time'];
    const alertsRows = alerts.map(alert => [
        alert.id,
        alert.source,
        alert.message,
        alert.severity,
        alert.time
    ]);

    // Combine into CSV string
    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += "--- NODE STATUS REPORT ---\n";
    csvContent += nodesHeader.join(",") + "\n";
    nodesRows.forEach(row => {
        csvContent += row.join(",") + "\n";
    });

    csvContent += "\n--- RECENT ALERTS ---\n";
    csvContent += alertsHeader.join(",") + "\n";
    alertsRows.forEach(row => {
        csvContent += row.join(",") + "\n";
    });

    // Trigger Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `assetsense_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
