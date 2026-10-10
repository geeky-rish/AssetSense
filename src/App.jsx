import React, { useState } from 'react';
import { useSimulation } from './hooks/useSimulation';
import NodeCard from './components/NodeCard';
import NodeGrid from './components/NodeGrid';
import RankingPanel from './components/RankingPanel';
import AlertsPanel from './components/AlertsPanel';
import SystemStatus from './components/SystemStatus';
import NodeDetailModal from './components/NodeDetailModal';
import ComparisonPanel from './components/ComparisonPanel';
import ExportButton from './components/ExportButton';
import FaultControlPanel from './components/FaultControlPanel';
import SystemResponseBanner from './components/SystemResponseBanner';
import Analytics from './components/Analytics';
import Team from './components/Team';
import SettingsPage from './components/Settings';
import SystemArchitecture from './components/SystemArchitecture';
import { LayoutDashboard, Settings, Users, BarChart2, Cpu } from 'lucide-react';

function App() {
  const { nodes, alerts, systemStatus, injectFault, repairNode } = useSimulation();
  const [selectedNode, setSelectedNode] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'analytics':
        return <Analytics nodes={nodes} />;
      case 'architecture':
        return <SystemArchitecture />;
      case 'team':
        return <Team />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Plant Overview</h2>
                <p style={{ color: 'var(--text-muted)' }}>Real-time predictive maintenance monitoring</p>
              </div>
              <SystemStatus status={systemStatus} nodeCount={nodes.length} />
            </header>

            {/* System Response Banner */}
            <SystemResponseBanner systemStatus={systemStatus} alerts={alerts} />

            {/* Top Cards Grid */}
            <div className="grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '2rem' }}>
              {nodes.map(node => (
                <NodeCard key={node.id} node={node} onClick={setSelectedNode} />
              ))}
            </div>

            {/* Fault Control Panel */}
            <div style={{ marginBottom: '2rem' }}>
              <FaultControlPanel nodes={nodes} injectFault={injectFault} repairNode={repairNode} />
            </div>

            {/* Middle Section: Ranking & Alerts */}
            <div className="grid-layout" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '2rem' }}>
              <RankingPanel nodes={nodes} />
              <AlertsPanel alerts={alerts} />
            </div>

            {/* Comparison Section */}
            <div style={{ marginBottom: '2rem' }}>
              <ComparisonPanel nodes={nodes} />
            </div>

            {/* Bottom Section: Detailed Grid */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Detailed Node Status</h3>
              <ExportButton nodes={nodes} alerts={alerts} />
            </div>
            <NodeGrid nodes={nodes} />
          </>
        );
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        position: 'fixed',
        height: '100vh',
        zIndex: 10
      }}>
        <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent-primary)', borderRadius: '6px' }} />
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '1px' }}>ASSETSENSE</h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={currentView === 'dashboard'}
            onClick={() => setCurrentView('dashboard')}
          />
          <NavItem
            icon={<BarChart2 size={20} />}
            label="Analytics"
            active={currentView === 'analytics'}
            onClick={() => setCurrentView('analytics')}
          />
          <NavItem
            icon={<Cpu size={20} />}
            label="Architecture"
            active={currentView === 'architecture'}
            onClick={() => setCurrentView('architecture')}
          />
          <NavItem
            icon={<Users size={20} />}
            label="Team"
            active={currentView === 'team'}
            onClick={() => setCurrentView('team')}
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Settings"
            active={currentView === 'settings'}
            onClick={() => setCurrentView('settings')}
          />
        </nav>

        <div style={{ marginTop: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          v1.1.0 - ML Enhanced
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '250px', flex: 1, padding: '2rem' }}>
        {renderContent()}
      </main>

      {/* Modal */}
      {selectedNode && (
        <NodeDetailModal node={selectedNode} onClose={() => setSelectedNode(null)} />
      )}
    </div>
  );
}

const NavItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem',
      borderRadius: '6px',
      background: active ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
      color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        e.currentTarget.style.color = 'var(--text-primary)';
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'var(--text-secondary)';
      }
    }}
  >
    {icon}
    <span style={{ fontWeight: '500' }}>{label}</span>
  </div>
);

export default App;
