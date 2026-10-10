import React from 'react';
import { Download } from 'lucide-react';
import { exportToCSV } from '../utils/exportUtils';

const ExportButton = ({ nodes, alerts }) => {
    return (
        <button
            onClick={() => exportToCSV(nodes, alerts)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'var(--accent-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
            <Download size={18} />
            Export Report
        </button>
    );
};

export default ExportButton;
